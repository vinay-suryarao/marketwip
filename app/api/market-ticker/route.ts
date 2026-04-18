import { NextResponse } from "next/server";

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        previousClose?: number;
      };
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
        }>;
      };
    }>;
  };
};

const MARKETS = [
  { symbol: "^NSEI", label: "NIFTY" },
  { symbol: "^BSESN", label: "SENSEX" },
  { symbol: "^NSEBANK", label: "BANK NIFTY" },
  { symbol: "INR=X", label: "USD/INR" },
  { symbol: "GC=F", label: "GOLD" },
];

function getLastClose(values?: Array<number | null>) {
  if (!values || values.length === 0) {
    return undefined;
  }

  for (let i = values.length - 1; i >= 0; i -= 1) {
    const value = values[i];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return undefined;
}

export async function GET() {
  try {
    const items = await Promise.all(
      MARKETS.map(async (market) => {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(market.symbol)}?range=1d&interval=1m`,
          {
            cache: "no-store",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as YahooChartResponse;
        const result = data.chart?.result?.[0];
        const marketPrice = result?.meta?.regularMarketPrice;
        const previousClose = result?.meta?.previousClose;
        const fallbackClose = getLastClose(result?.indicators?.quote?.[0]?.close);
        const resolvedPrice =
          typeof marketPrice === "number" && Number.isFinite(marketPrice) ? marketPrice : fallbackClose;

        if (resolvedPrice == null || previousClose == null || previousClose === 0) {
          return null;
        }

        const changePercent = ((resolvedPrice - previousClose) / previousClose) * 100;

        return {
          symbol: market.label,
          price: resolvedPrice.toFixed(2),
          changePercent: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
          isUp: changePercent >= 0,
        };
      }),
    );

    return NextResponse.json({ items: items.filter(Boolean) }, { status: 200 });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
