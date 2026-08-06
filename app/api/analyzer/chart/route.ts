import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Fetches historical OHLCV chart data for an Indian stock from Yahoo Finance.
 * Query params:
 *   - symbol: NSE ticker (e.g. INFY) or BSE code (e.g. 500209)
 *   - range: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, max (default: 1y)
 *   - interval: 1m, 5m, 15m, 1d, 1wk, 1mo (default: 1d)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get("symbol") || "INFY";
  const range = searchParams.get("range") || "1y";
  const interval = searchParams.get("interval") || "1d";

  // Build Yahoo Finance symbol — append .NS for NSE, .BO for BSE
  // If it's purely numeric, treat it as BSE code
  const isNumeric = /^\d+$/.test(symbol);
  const yahooSymbol = isNumeric ? `${symbol}.BO` : `${symbol}.NS`;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?range=${range}&interval=${interval}&includePrePost=false`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // If NSE fails, try BSE
      if (!isNumeric) {
        const bseUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol + ".BO")}?range=${range}&interval=${interval}&includePrePost=false`;
        const bseRes = await fetch(bseUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          cache: "no-store",
        });
        if (!bseRes.ok) {
          return NextResponse.json({ error: `Yahoo Finance returned ${bseRes.status}` }, { status: bseRes.status });
        }
        const bseData = await bseRes.json();
        return NextResponse.json(transformYahooData(bseData));
      }
      return NextResponse.json({ error: `Yahoo Finance returned ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(transformYahooData(data));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}

function transformYahooData(raw: any) {
  const result = raw?.chart?.result?.[0];
  if (!result) {
    return { candles: [], meta: null };
  }

  const timestamps: number[] = result.timestamp || [];
  const quote = result.indicators?.quote?.[0] || {};
  const opens: (number | null)[] = quote.open || [];
  const highs: (number | null)[] = quote.high || [];
  const lows: (number | null)[] = quote.low || [];
  const closes: (number | null)[] = quote.close || [];
  const volumes: (number | null)[] = quote.volume || [];

  const candles = [];
  for (let i = 0; i < timestamps.length; i++) {
    // Skip entries where close is null
    if (closes[i] == null) continue;
    candles.push({
      time: timestamps[i], // Unix timestamp
      open: opens[i] ?? closes[i],
      high: highs[i] ?? closes[i],
      low: lows[i] ?? closes[i],
      close: closes[i],
      volume: volumes[i] ?? 0,
    });
  }

  return {
    candles,
    meta: {
      symbol: result.meta?.symbol,
      currency: result.meta?.currency,
      exchangeName: result.meta?.exchangeName,
      regularMarketPrice: result.meta?.regularMarketPrice,
      previousClose: result.meta?.previousClose,
    },
  };
}
