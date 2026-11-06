import type { StockListItem, CompanyData } from "@/types/analyzer";

const BASE_URL = "https://data.finedgeapi.com/api/v1";

function getApiKey(): string {
  const key = process.env.FINEDGE_API_KEY?.trim();
  if (!key) {
    throw new Error("FINEDGE_API_KEY is not set in environment variables");
  }
  // Remove surrounding quotes if accidentally added
  const cleaned = key.replace(/^["']|["']$/g, "");
  console.log(`[FinEdge] API Key loaded: ${cleaned.substring(0, 6)}...${cleaned.substring(cleaned.length - 4)} (length: ${cleaned.length})`);
  return cleaned;
}

/* ─── In-memory cache ─── */

type CacheEntry<T> = { data: T; expiresAt: number };

let stockListCache: CacheEntry<StockListItem[]> | null = null;
const companyCache = new Map<string, CacheEntry<CompanyData>>();

const STOCK_LIST_TTL = 60 * 60 * 1000; // 1 hour
const COMPANY_DATA_TTL = 5 * 60 * 1000; // 5 minutes

/* ─── Helper: FinEdge authenticated fetch ─── */

async function finedgeFetch(endpoint: string, retries = 2): Promise<any> {
  const apiKey = getApiKey();
  
  // FinEdge API requires token as a query parameter
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}token=${encodeURIComponent(apiKey)}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      // Exponential backoff: 500ms, 1500ms
      const delay = 500 * Math.pow(3, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");

      // Rate limited — retry
      if (response.status === 429 || response.status === 503) {
        if (attempt < retries) {
          console.warn(`[FinEdge] Rate limited (${response.status}) for ${endpoint}, retry ${attempt + 1}/${retries}`);
          continue;
        }
        // Final attempt also rate-limited → return null silently
        console.warn(`[FinEdge] Rate limited (${response.status}) for ${endpoint}, giving up after ${retries} retries`);
        return null;
      }
      
      // User-friendly error for plan restrictions
      if (response.status === 401 && errorText.includes("not authorized")) {
        console.warn(`[FinEdge] Stock not available in current plan: ${endpoint}`);
        throw new Error(`This stock is not available in your current FinEdge plan. Upgrade to access all companies.`);
      }

      console.warn(`[FinEdge] Error ${response.status} for ${endpoint}: ${errorText}`);
      throw new Error(`FinEdge API returned ${response.status}: ${errorText}`);
    }

    // Handle empty body (free tier returns 200 with content-length: 0 for some endpoints)
    const contentLength = response.headers.get("content-length");
    if (contentLength === "0") {
      return null;
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  return null;
}

/* ─── Silently try a fetch, return null on failure ─── */

async function finedgeFetchSafe(endpoint: string): Promise<any | null> {
  try {
    return await finedgeFetch(endpoint);
  } catch {
    return null;
  }
}

/* ─── Small delay helper ─── */

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/* ─── Helper: Resolve a company name/query to possible FinEdge symbols ─── */

const NAME_TO_SYMBOLS: Record<string, string[]> = {
  // HDFC Bank variations — try multiple symbol formats
  "hdfc bank": ["HDFCBANK", "HDFC"],
  "hdfc bank ltd": ["HDFCBANK", "HDFC"],
  "hdfcbank": ["HDFCBANK", "HDFC"],
  "hdfc": ["HDFC", "HDFCBANK"],
  // Reliance variations
  "reliance": ["RELIANCE"],
  "reliance industries": ["RELIANCE"],
  "reliance industries ltd": ["RELIANCE"],
  "reliance industries limited": ["RELIANCE"],
  // ITC
  "itc": ["ITC"],
  "itc ltd": ["ITC"],
  "itc limited": ["ITC"],
};

function getSymbolCandidates(nameOrSymbol: string): string[] {
  const input = nameOrSymbol.trim();
  const inputLower = input.toLowerCase().replace(/[-_]+/g, " ").trim();

  const candidates: string[] = [];

  // 1. Direct dictionary match
  if (NAME_TO_SYMBOLS[inputLower]) {
    candidates.push(...NAME_TO_SYMBOLS[inputLower]);
  }

  // 2. Partial dictionary match (e.g. "reliance industries limited eq")
  for (const [key, syms] of Object.entries(NAME_TO_SYMBOLS)) {
    if (inputLower === key || inputLower.startsWith(key) || key.startsWith(inputLower)) {
      for (const s of syms) {
        if (!candidates.includes(s)) candidates.push(s);
      }
    }
  }

  // 3. Clean uppercase alphanumeric symbol
  const cleanSym = input.toUpperCase().replace(/[^A-Z0-9&]/g, "");
  if (cleanSym && !candidates.includes(cleanSym)) {
    candidates.push(cleanSym);
  }

  if (candidates.length === 0) {
    candidates.push(input.toUpperCase());
  }

  return candidates;
}

/* ─── Fetch all stocks (for autocomplete search) ─── */

export async function fetchStockList(): Promise<StockListItem[]> {
  if (stockListCache && Date.now() < stockListCache.expiresAt) {
    return stockListCache.data;
  }

  // Try multiple possible FinEdge endpoints for stock listing
  const stockListEndpoints = [
    "/all-stocks",
    "/stock-list",
    "/symbols",
    "/stocks",
  ];

  for (const endpoint of stockListEndpoints) {
    try {
      const raw = await finedgeFetch(endpoint);

      // FinEdge may return an array or wrapped object
      const rawList: any[] = Array.isArray(raw)
        ? raw
        : raw.stocks ?? raw.data ?? raw.symbols ?? [];

      const data: StockListItem[] = rawList.map((item: any) => ({
        id: item.symbol || item.nse_code || item.id || "",
        name: item.name || item.companyName || item.company_name || "",
        "bse-code": item.bse_code || item["bse-code"] || undefined,
      }));

      if (data.length > 0) {
        console.log(`[FinEdge] ✅ Loaded ${data.length} stocks from ${endpoint}`);
        stockListCache = {
          data,
          expiresAt: Date.now() + STOCK_LIST_TTL,
        };
        return data;
      }
    } catch {
      // Try next endpoint
    }
  }

  console.log(`[FinEdge] Stock list endpoints not available, using fallback`);

  // Fallback: return the companies we know are available on free tier
  const fallbackStocks: StockListItem[] = [
    { id: "ITC", name: "ITC Ltd", "bse-code": "500875" },
    { id: "RELIANCE", name: "Reliance Industries Ltd", "bse-code": "500325" },
    { id: "HDFC", name: "HDFC Bank Ltd", "bse-code": "500180" },
  ];

  stockListCache = {
    data: fallbackStocks,
    expiresAt: Date.now() + STOCK_LIST_TTL,
  };
  return fallbackStocks;
}

/* ─── Helper: Format large numbers to Indian format (Cr) ─── */

function formatToCr(value: number | null | undefined): string {
  if (value == null) return "—";
  const crValue = value / 10000000; // 1 Cr = 10^7
  return formatCrValue(crValue);
}

/* ─── Helper: Format a value already in Crores ─── */

function formatCrValue(crValue: number | null | undefined): string {
  if (crValue == null) return "—";
  if (Math.abs(crValue) >= 100000) {
    // ₹1,00,000+ Cr → show as Lakh Cr
    const lakhCr = crValue / 100000;
    return `₹${lakhCr.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Lakh Cr`;
  }
  if (Math.abs(crValue) >= 1000) {
    return `₹${crValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`;
  }
  return `₹${crValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
}

/* ─── Helper: Build financial table rows from FinEdge ratios ─── */

function buildFinancialTable(
  ratios: any[],
  metricKeys: { key: string; label: string }[],
): Record<string, string | number | null>[] | undefined {
  if (!ratios || ratios.length === 0) return undefined;

  // Sort by year descending (most recent first), TTM first
  const sorted = [...ratios].sort((a, b) => {
    if (a.header === "TTM") return -1;
    if (b.header === "TTM") return 1;
    return b.year - a.year;
  });

  // Build rows: each metric becomes a row, each period becomes a column
  const rows: Record<string, string | number | null>[] = [];

  for (const { key, label } of metricKeys) {
    const row: Record<string, string | number | null> = { Metric: label };
    let hasAnyValue = false;

    for (const period of sorted) {
      const colName = period.header || `${period.year}`;
      const rawValue = period[key];
      if (rawValue == null) {
        row[colName] = "—";
      } else if (typeof rawValue === "number") {
        hasAnyValue = true;
        if (key === "tax" || key === "opm" || key === "dividendPayout" || key === "retentionRatio" || key === "cashFlowMargin" || label.includes("OPM") || label.includes("Tax %") || label.includes("Payout")) {
          // Percentage fields — stored as 0.2414 → show "24%"
          row[colName] = `${Math.round(rawValue * 100)}%`;
        } else if (Math.abs(rawValue) >= 10000000) {
          // Raw rupees → convert to Cr → show as plain Indian-formatted number
          const crVal = rawValue / 10000000;
          row[colName] = Math.round(crVal).toLocaleString("en-IN");
        } else if (Number.isInteger(rawValue) || Math.abs(rawValue) >= 100) {
          row[colName] = Math.round(rawValue).toLocaleString("en-IN");
        } else {
          // Small numbers like EPS → show 2 decimals
          row[colName] = rawValue.toFixed(2);
        }
      } else {
        hasAnyValue = true;
        row[colName] = rawValue;
      }
    }

    // Always include row so all screener parameters are shown
    rows.push(row);
  }

  return rows.length > 0 ? rows : undefined;
}

/* ─── Fetch company data (for company analysis page) ─── */

export async function fetchStockData(name: string): Promise<CompanyData> {
  const cacheKey = name.toLowerCase().trim();

  const cached = companyCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  // FinEdge uses stock symbols (e.g. "ITC", "RELIANCE", "HDFCBANK")
  // Try multiple symbol candidates until one works
  const candidates = getSymbolCandidates(name);

  let profile: any = null;
  let resolvedSymbol = candidates[0];

  for (const sym of candidates) {
    console.log(`[FinEdge] Trying symbol "${sym}" for query "${name}"`);
    profile = await finedgeFetchSafe(`/company-profile/${encodeURIComponent(sym)}`);
    if (profile && (profile.name || profile.symbol)) {
      resolvedSymbol = sym;
      console.log(`[FinEdge] ✅ Symbol "${sym}" worked for "${name}"`);
      break;
    }
  }

  if (!profile || (!profile.name && !profile.symbol)) {
    // Check if any candidate threw a plan restriction error
    const lastErr = candidates.length > 0
      ? await finedgeFetchSafe(`/company-profile/${encodeURIComponent(candidates[0])}`).catch(() => null)
      : null;

    throw new Error(
      `"${name}" is not available in your current FinEdge plan. ` +
      `Free plan only supports: ITC, RELIANCE, HDFC. Upgrade your plan to access all companies.`
    );
  }

  const symbol = resolvedSymbol;

  // ── Batch 1: Critical financials (P&L, BS, CF) ──
  // These are essential for the page; fetch them first.
  const [plData, bsData, cfData] = await Promise.all([
    finedgeFetchSafe(`/basic-financials/${encodeURIComponent(symbol)}?statement_type=s&statement_code=pl`),
    finedgeFetchSafe(`/basic-financials/${encodeURIComponent(symbol)}?statement_type=s&statement_code=bs`),
    finedgeFetchSafe(`/basic-financials/${encodeURIComponent(symbol)}?statement_type=s&statement_code=cf`),
  ]);

  // ── Batch 2: Secondary data (shareholding, corporate actions, documents) ──
  // Small delay to avoid rate-limiting, then fetch.
  // On free tier these return empty (200 with 0 bytes); on paid they return data.
  // Using finedgeFetchSafe so errors are silently swallowed.
  await delay(300);

  const [shData, caData, docsData, annData, arData, crData, ccData, peersData, segAnnualData, segQuarterlyData] = await Promise.all([
    finedgeFetchSafe(`/shareholding-pattern/${encodeURIComponent(symbol)}`),
    finedgeFetchSafe(`/corporate-actions/${encodeURIComponent(symbol)}`),
    finedgeFetchSafe(`/documents/${encodeURIComponent(symbol)}`),
    finedgeFetchSafe(`/announcements/${encodeURIComponent(symbol)}`),
    finedgeFetchSafe(`/annual-reports/${encodeURIComponent(symbol)}`),
    finedgeFetchSafe(`/credit-ratings/${encodeURIComponent(symbol)}`),
    finedgeFetchSafe(`/concalls/${encodeURIComponent(symbol)}`),
    finedgeFetchSafe(`/peers/${encodeURIComponent(symbol)}`),
    finedgeFetchSafe(`/segment-revenue/${encodeURIComponent(symbol)}?statement_type=s&statement_code=pl&period=annual`),
    finedgeFetchSafe(`/segment-revenue/${encodeURIComponent(symbol)}?statement_type=s&statement_code=pl&period=quarterly`),
  ]);

  // Build the CompanyData object that our UI components expect
  const marketCapFormatted = profile.market_cap
    ? formatCrValue(Number(profile.market_cap))
    : undefined;

  const data: CompanyData = {
    companyName: profile.name || name,
    tickerId: profile.symbol || profile.nse_code || symbol,
    companyProfile: profile.description || "",
    industry: profile.industry || profile.sector || "",

    // keyMetrics will be built below after financials are parsed
    keyMetrics: undefined,

    // Store additional profile data for AboutCompany component
    stockDetailsReusableData: {
      marketCap: profile.market_cap || undefined,
      website: profile.website || undefined,
      bseCode: profile.bse_code || undefined,
      nseCode: profile.nse_code || symbol,
      sector: profile.sector || undefined,
      macroSector: profile.macro_sector || undefined,
      subIndustry: profile.sub_industry || undefined,
    },
  };

  // ─── Build Profit & Loss table ───
  const plRatios = plData?.ratios || plData?.data || (Array.isArray(plData) ? plData : null);

  // Extract TTM / latest annual for key metrics
  let metricsSource: any = null;
  let eps: number | undefined;

  if (plRatios && Array.isArray(plRatios)) {
    // Pre-process: calculate derived fields for each period
    // FinEdge provides: operatingRevenue, operatingExpenses, operatingProfit, ebitda, ebit,
    //                    grossIncome, costOfGoodsSold, tax, dividendPayout, salesPerShare, sharesOutstanding
    // Screener.in row order: Sales, Expenses, Operating Profit, OPM%, Other Income, Interest, Depreciation, Profit before tax, Tax%, Net Profit, EPS, Dividend Payout%
    const enrichedRatios = plRatios.map((r: any) => {
      const enriched = { ...r };
      // OPM % = Operating Profit / Revenue (store as decimal for percentage display)
      if (r.operatingProfit != null && r.operatingRevenue != null && r.operatingRevenue !== 0) {
        enriched.opm = r.operatingProfit / r.operatingRevenue;
      }
      // Depreciation = EBITDA - EBIT
      if (r.ebitda != null && r.ebit != null) {
        enriched.depreciation = r.ebitda - r.ebit;
      }
      // Other Income = EBITDA - Operating Profit
      // (EBITDA includes operating profit + other income, so difference = other income)
      if (r.ebitda != null && r.operatingProfit != null) {
        const diff = r.ebitda - r.operatingProfit;
        if (diff >= 0) enriched.otherIncome = diff;
      }
      // Interest = Operating Profit + Other Income - Depreciation - EBIT
      // Since EBIT = Op Profit + Other Income - Depreciation - Interest
      // => Interest = Op Profit + Other Income - Depreciation - EBIT
      if (r.operatingProfit != null && enriched.otherIncome != null && enriched.depreciation != null && r.ebit != null) {
        const interest = r.operatingProfit + enriched.otherIncome - enriched.depreciation - r.ebit;
        if (interest > 0) enriched.interest = interest;
      }
      // Profit Before Tax = EBIT (FinEdge EBIT ≈ PBT for most cases)
      // More accurate: Operating Profit + Other Income - Interest - Depreciation
      if (r.ebit != null) {
        enriched.profitBeforeTax = r.ebit;
      }
      // Net Profit = EBIT × (1 - tax rate)
      if (r.ebit != null && r.tax != null) {
        enriched.netProfit = r.ebit * (1 - r.tax);
      }
      // EPS = Net Profit / Shares Outstanding
      const shares = r.sharesOutstanding || r.dilutedSharesOutstanding;
      if (enriched.netProfit != null && shares) {
        enriched.epsInRs = enriched.netProfit / shares;
      }
      return enriched;
    });

    // Annual P&L — screener.in exact format
    data.profitLoss = buildFinancialTable(enrichedRatios, [
      { key: "operatingRevenue", label: "Sales +" },
      { key: "operatingExpenses", label: "Expenses +" },
      { key: "operatingProfit", label: "Operating Profit" },
      { key: "opm", label: "OPM %" },
      { key: "otherIncome", label: "Other Income +" },
      { key: "interest", label: "Interest" },
      { key: "depreciation", label: "Depreciation" },
      { key: "profitBeforeTax", label: "Profit before tax" },
      { key: "tax", label: "Tax %" },
      { key: "netProfit", label: "Net Profit +" },
      { key: "epsInRs", label: "EPS in Rs" },
      { key: "dividendPayout", label: "Dividend Payout %" },
    ]);

    // Quarterly results — screener.in exact format
    data.quarterlyResults = buildFinancialTable(enrichedRatios, [
      { key: "operatingRevenue", label: "Sales +" },
      { key: "operatingExpenses", label: "Expenses +" },
      { key: "operatingProfit", label: "Operating Profit" },
      { key: "opm", label: "OPM %" },
      { key: "otherIncome", label: "Other Income +" },
      { key: "interest", label: "Interest" },
      { key: "depreciation", label: "Depreciation" },
      { key: "profitBeforeTax", label: "Profit before tax" },
      { key: "tax", label: "Tax %" },
      { key: "netProfit", label: "Net Profit +" },
      { key: "epsInRs", label: "EPS in Rs" },
    ]);

    // Extract key metrics from TTM or latest annual period (use enriched data)
    const ttm = enrichedRatios.find((r: any) => r.header === "TTM");
    const latestAnnual = enrichedRatios.find((r: any) => r.header !== "TTM");
    metricsSource = ttm || latestAnnual;

    if (metricsSource) {
      eps = metricsSource.epsInRs;
    }
  }

  // ─── Get Balance Sheet data for additional metrics ───
  const bsRatios = bsData?.ratios || bsData?.data || (Array.isArray(bsData) ? bsData : null);
  let bsMetricsSource: any = null;
  if (bsRatios && Array.isArray(bsRatios)) {
    bsMetricsSource = bsRatios.find((r: any) => r.header === "TTM") || bsRatios[0];
  }

  // ─── Calculate Screener.in Core Ratios ───
  const shares = metricsSource?.sharesOutstanding || metricsSource?.dilutedSharesOutstanding;
  let currentPriceCalculated: number | undefined;
  if (profile.current_price || profile.price || profile.close) {
    currentPriceCalculated = Number(profile.current_price || profile.price || profile.close);
  } else if (profile.market_cap && shares) {
    currentPriceCalculated = (Number(profile.market_cap) * 10000000) / shares;
  }

  if (currentPriceCalculated) {
    data.currentPrice = { NSE: Math.round(currentPriceCalculated * 100) / 100 };
  }

  // High / Low
  let highLowFormatted: string | undefined;
  const highVal = profile.high_52 || profile.year_high || profile.high52;
  const lowVal = profile.low_52 || profile.year_low || profile.low52;
  if (highVal && lowVal) {
    highLowFormatted = `₹${Math.round(Number(highVal))} / ₹${Math.round(Number(lowVal))}`;
    data.yearHigh = Number(highVal);
    data.yearLow = Number(lowVal);
  }

  // Stock P/E
  let stockPeFormatted: string | undefined;
  const netProfitCr = metricsSource?.netProfit ? metricsSource.netProfit / 10000000 : null;
  if (profile.market_cap && netProfitCr && netProfitCr > 0) {
    stockPeFormatted = (Number(profile.market_cap) / netProfitCr).toFixed(1);
  } else if (currentPriceCalculated && eps && eps > 0) {
    stockPeFormatted = (currentPriceCalculated / eps).toFixed(1);
  }

  // ROCE = EBIT / Capital Employed * 100
  let roceFormatted: string | undefined;
  if (metricsSource?.ebit && bsMetricsSource) {
    const capEmployed = (bsMetricsSource.totalEquity || 0) + (bsMetricsSource.totalDebt || 0);
    if (capEmployed > 0) {
      roceFormatted = `${((metricsSource.ebit / capEmployed) * 100).toFixed(1)} %`;
    }
  }

  // ROE = Net Profit / Total Equity * 100
  let roeFormatted: string | undefined;
  if (metricsSource?.netProfit && bsMetricsSource?.totalEquity && bsMetricsSource.totalEquity > 0) {
    roeFormatted = `${((metricsSource.netProfit / bsMetricsSource.totalEquity) * 100).toFixed(1)} %`;
  }

  // Dividend Yield = (Dividend Payout / P/E) * 100 approx or from profile
  let divYieldFormatted: string | undefined;
  if (profile.dividend_yield) {
    divYieldFormatted = `${Number(profile.dividend_yield).toFixed(2)} %`;
  } else if (metricsSource?.dividendPayout != null && stockPeFormatted) {
    const peNum = parseFloat(stockPeFormatted);
    if (peNum > 0) {
      divYieldFormatted = `${((metricsSource.dividendPayout / peNum) * 100).toFixed(2)} %`;
    }
  }

  // ─── Build Key Ratios (grouped format for KeyRatios component) ───
  type MetricItem = { displayName: string; value: string | number | null };
  const keyRatiosGrouped: Record<string, MetricItem[]> = {};

  // Group 1: Valuation / Core Screener Ratios
  const valuation: MetricItem[] = [];
  if (marketCapFormatted) valuation.push({ displayName: "Market Cap", value: marketCapFormatted });
  if (currentPriceCalculated) valuation.push({ displayName: "Current Price", value: `₹${Math.round(currentPriceCalculated)}` });
  if (highLowFormatted) valuation.push({ displayName: "High / Low", value: highLowFormatted });
  if (stockPeFormatted) valuation.push({ displayName: "Stock P/E", value: stockPeFormatted });
  if (bsMetricsSource?.bookValuepershare) valuation.push({ displayName: "Book Value", value: `₹${bsMetricsSource.bookValuepershare.toFixed(1)}` });
  if (divYieldFormatted) valuation.push({ displayName: "Dividend Yield", value: divYieldFormatted });
  if (roceFormatted) valuation.push({ displayName: "ROCE", value: roceFormatted });
  if (roeFormatted) valuation.push({ displayName: "ROE", value: roeFormatted });
  if (metricsSource?.adjustedFaceValue) valuation.push({ displayName: "Face Value", value: `₹${Number(metricsSource.adjustedFaceValue).toFixed(2)}` });
  if (eps) valuation.push({ displayName: "EPS (TTM)", value: `₹${eps.toFixed(2)}` });
  if (metricsSource?.salesPerShare) valuation.push({ displayName: "Sales Per Share", value: `₹${metricsSource.salesPerShare.toFixed(2)}` });
  if (valuation.length > 0) keyRatiosGrouped["Valuation"] = valuation;

  // Group 2: Profitability
  const profitability: MetricItem[] = [];
  if (metricsSource?.operatingRevenue && metricsSource?.operatingProfit) {
    const opm = (metricsSource.operatingProfit / metricsSource.operatingRevenue) * 100;
    profitability.push({ displayName: "OPM %", value: `${opm.toFixed(2)}%` });
  }
  if (metricsSource?.operatingRevenue) profitability.push({ displayName: "Revenue", value: formatToCr(metricsSource.operatingRevenue) });
  if (metricsSource?.operatingProfit) profitability.push({ displayName: "Operating Profit", value: formatToCr(metricsSource.operatingProfit) });
  if (metricsSource?.ebitda) profitability.push({ displayName: "EBITDA", value: formatToCr(metricsSource.ebitda) });
  if (metricsSource?.netProfit) profitability.push({ displayName: "Net Profit", value: formatToCr(metricsSource.netProfit) });
  if (profitability.length > 0) keyRatiosGrouped["Profitability"] = profitability;

  // Group 3: Balance Sheet Highlights
  const bsHighlights: MetricItem[] = [];
  if (bsMetricsSource?.totalAssets) bsHighlights.push({ displayName: "Total Assets", value: formatToCr(bsMetricsSource.totalAssets) });
  if (bsMetricsSource?.totalEquity) bsHighlights.push({ displayName: "Total Equity", value: formatToCr(bsMetricsSource.totalEquity) });
  if (bsMetricsSource?.totalDebt != null) bsHighlights.push({ displayName: "Total Debt", value: formatToCr(bsMetricsSource.totalDebt) });
  if (bsMetricsSource?.totalCash) bsHighlights.push({ displayName: "Cash", value: formatToCr(bsMetricsSource.totalCash) });
  if (bsHighlights.length > 0) keyRatiosGrouped["Balance Sheet"] = bsHighlights;

  // Group 4: Dividends & Shares
  const dividends: MetricItem[] = [];
  if (metricsSource?.dividendPayout != null && metricsSource.dividendPayout !== null) dividends.push({ displayName: "Dividend Payout", value: `${(metricsSource.dividendPayout * 100).toFixed(1)}%` });
  if (metricsSource?.tax != null) dividends.push({ displayName: "Tax Rate", value: `${(metricsSource.tax * 100).toFixed(1)}%` });
  if (metricsSource?.sharesOutstanding) {
    const sharesCr = metricsSource.sharesOutstanding / 10000000;
    dividends.push({ displayName: "Shares Outstanding", value: `${sharesCr.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr` });
  }
  if (dividends.length > 0) keyRatiosGrouped["Dividends & Shares"] = dividends;

  // Set keyMetrics — flat and grouped
  data.keyMetrics = Object.keys(keyRatiosGrouped).length > 0 ? keyRatiosGrouped : undefined;

  // ─── Build Balance Sheet table — screener.in format with calculated fields ───
  if (bsRatios && Array.isArray(bsRatios)) {
    // Pre-process: calculate derived fields for Balance Sheet
    const enrichedBs = bsRatios.map((r: any) => {
      const enriched = { ...r };
      // Map FinEdge fields to screener field names
      enriched.equityCapital = r.shareCapital;
      enriched.reserves = r.totalReserves;
      enriched.borrowings = r.totalDebt ?? ((r.longTermBorrowings || 0) + (r.shortTermBorrowings || 0));

      // Total Liabilities (screener) = Equity + Reserves + Borrowings + Other Liabilities = totalEquityAndLiabilities
      const totalLiab = r.totalEquityAndLiabilities || r.totalAssets;
      enriched.totalLiabilitiesScreener = totalLiab;

      // Other Liabilities = Total Liabilities - (Equity Capital + Reserves + Borrowings)
      const eqCap = r.shareCapital || 0;
      const res = r.totalReserves || 0;
      const borrow = enriched.borrowings || 0;
      if (totalLiab != null) {
        const otherLiab = totalLiab - (eqCap + res + borrow);
        enriched.otherLiabilities = otherLiab > 0 ? otherLiab : (r.totalPayables || null);
      }

      // Fixed Assets = tangibleBookValue (tangible assets = fixed assets approx.)
      if (r.tangibleBookValue != null) {
        enriched.fixedAssets = r.tangibleBookValue;
      }

      // CWIP & Investments (from FinEdge paid plan fields if present)
      enriched.cwip = r.cwip ?? r.capitalWorkInProgress ?? null;
      enriched.investments = r.investments ?? r.totalInvestments ?? null;

      // Other Assets = Total Assets - Fixed Assets - CWIP - Investments
      if (r.totalAssets != null) {
        const knownDeductions = (enriched.fixedAssets || 0) + (enriched.cwip || 0) + (enriched.investments || 0);
        const otherAssets = r.totalAssets - knownDeductions;
        enriched.otherAssets = otherAssets > 0 ? otherAssets : (r.totalCash || 0) + (r.totalReceivables || 0);
      }
      return enriched;
    });

    data.balanceSheet = buildFinancialTable(enrichedBs, [
      { key: "equityCapital", label: "Equity Capital" },
      { key: "reserves", label: "Reserves" },
      { key: "borrowings", label: "Borrowings +" },
      { key: "otherLiabilities", label: "Other Liabilities +" },
      { key: "totalLiabilitiesScreener", label: "Total Liabilities" },
      { key: "fixedAssets", label: "Fixed Assets +" },
      { key: "cwip", label: "CWIP" },
      { key: "investments", label: "Investments" },
      { key: "otherAssets", label: "Other Assets +" },
      { key: "totalAssets", label: "Total Assets" },
    ]);
  }

  // ─── Build Cash Flow table — with proper labels ───
  const cfRatios = cfData?.ratios || cfData?.data || (Array.isArray(cfData) ? cfData : null);
  if (cfRatios && Array.isArray(cfRatios)) {
    data.cashFlow = buildFinancialTable(cfRatios, [
      { key: "operatingCashFlow", label: "Cash from Operating Activity +" },
      { key: "investingCashFlow", label: "Cash from Investing Activity +" },
      { key: "financingCashFlow", label: "Cash from Financing Activity +" },
      { key: "fcf", label: "Free Cash Flow" },
      { key: "capex", label: "Capital Expenditure" },
      { key: "fcfPerShare", label: "FCF Per Share" },
      { key: "cashFlowMargin", label: "Cash Flow Margin" },
      { key: "newDebtIssued", label: "New Debt Issued" },
      { key: "debtRepayment", label: "Debt Repayment" },
      { key: "equityProceeds", label: "Equity Proceeds" },
    ]);
  }

  // ─── Shareholding Pattern ───
  // shData comes from /shareholding-pattern/{symbol}
  // It may be an array, or an object wrapping the data
  if (shData) {
    if (Array.isArray(shData) && shData.length > 0) {
      data.shareholding = shData;
    } else if (typeof shData === "object") {
      const shList = shData.data ?? shData.shareholdings ?? shData.summary ?? shData.pattern ?? shData.categories ?? [];
      if (Array.isArray(shList) && shList.length > 0) {
        data.shareholding = shList;
      } else {
        // The entire object might be the shareholding data itself (e.g. { promoters: [...], fiis: [...] })
        data.shareholding = shData;
      }
    }
  }

  // ─── Corporate Actions ───
  if (caData) {
    if (Array.isArray(caData) && caData.length > 0) {
      data.stockCorporateActionData = caData;
    } else if (typeof caData === "object") {
      const caList = caData.data ?? caData.actions ?? caData.corporate_actions ?? caData.corporateActions ?? [];
      if (Array.isArray(caList) && caList.length > 0) {
        data.stockCorporateActionData = caList;
      }
    }
  }

  // ─── Documents (combine all document sources) ───
  // Build a combined documents object from individual endpoints + combined /documents endpoint
  const combinedDocs: any = {};

  // Use data from /documents/{symbol} as base if available
  if (docsData && typeof docsData === "object") {
    Object.assign(combinedDocs, docsData);
  }

  // Overlay data from individual endpoints if they returned data
  if (annData) {
    const annList = Array.isArray(annData) ? annData : annData.data ?? annData.announcements ?? [];
    if (Array.isArray(annList) && annList.length > 0) {
      combinedDocs.announcements = annList;
    }
  }
  if (arData) {
    const arList = Array.isArray(arData) ? arData : arData.data ?? arData.reports ?? arData.annualReports ?? [];
    if (Array.isArray(arList) && arList.length > 0) {
      combinedDocs.annualReports = arList;
    }
  }
  if (crData) {
    const crList = Array.isArray(crData) ? crData : crData.data ?? crData.ratings ?? crData.creditRatings ?? [];
    if (Array.isArray(crList) && crList.length > 0) {
      combinedDocs.creditRatings = crList;
    }
  }
  if (ccData) {
    const ccList = Array.isArray(ccData) ? ccData : ccData.data ?? ccData.concalls ?? ccData.transcripts ?? [];
    if (Array.isArray(ccList) && ccList.length > 0) {
      combinedDocs.concalls = ccList;
    }
  }

  // Only set documents if we have any data
  if (Object.keys(combinedDocs).length > 0) {
    data.documents = combinedDocs;
  }

  // ─── Segment Revenue (Revenue by segment / Insights) ───
  if (segAnnualData?.segment_revenues || segQuarterlyData?.segment_revenues) {
    data.segmentRevenue = {
      annual: segAnnualData?.segment_revenues || [],
      quarterly: segQuarterlyData?.segment_revenues || [],
    };
  }

  // ─── Peer Comparison List ───
  const peerSymbols: string[] = peersData?.peers || [];
  if (peerSymbols.length > 0) {
    const peersList: any[] = [];

    // Current stock row
    peersList.push({
      tickerId: symbol,
      companyName: profile.name || symbol,
      price: currentPriceCalculated ? `₹${Math.round(currentPriceCalculated).toLocaleString("en-IN")}` : "—",
      priceToEarningsValueRatio: stockPeFormatted || "—",
      marketCap: profile.market_cap ? `₹${Math.round(Number(profile.market_cap)).toLocaleString("en-IN")}` : "—",
      dividendYieldIndicatedAnnualDividend: divYieldFormatted || "—",
      returnOnAverageEquityTrailing12Month: roeFormatted || "—",
      returnOnCapitalEmployed: roceFormatted || "—",
      isCurrent: true,
    });

    // Other peer stocks
    const otherSyms = peerSymbols.filter((p) => p.toUpperCase() !== symbol.toUpperCase()).slice(0, 7);
    const otherProfiles = await Promise.all(
      otherSyms.map(async (p) => {
        const prof = await finedgeFetchSafe(`/company-profile/${encodeURIComponent(p)}`);
        return { sym: p, prof };
      })
    );

    for (const { sym, prof } of otherProfiles) {
      if (prof && (prof.name || prof.market_cap)) {
        peersList.push({
          tickerId: prof.symbol || sym,
          companyName: prof.name || sym,
          price: prof.current_price ? `₹${Math.round(Number(prof.current_price)).toLocaleString("en-IN")}` : (prof.price ? `₹${prof.price}` : "—"),
          priceToEarningsValueRatio: prof.pe ? Number(prof.pe).toFixed(1) : "—",
          marketCap: prof.market_cap ? `₹${Math.round(Number(prof.market_cap)).toLocaleString("en-IN")}` : "—",
          dividendYieldIndicatedAnnualDividend: prof.dividend_yield ? `${Number(prof.dividend_yield).toFixed(2)} %` : "—",
          returnOnAverageEquityTrailing12Month: prof.roe ? `${Number(prof.roe).toFixed(1)} %` : "—",
          returnOnCapitalEmployed: prof.roce ? `${Number(prof.roce).toFixed(1)} %` : "—",
          isCurrent: false,
        });
      } else {
        peersList.push({
          tickerId: sym,
          companyName: sym,
          price: "—",
          priceToEarningsValueRatio: "—",
          marketCap: "—",
          dividendYieldIndicatedAnnualDividend: "—",
          returnOnAverageEquityTrailing12Month: "—",
          returnOnCapitalEmployed: "—",
          isCurrent: false,
        });
      }
    }

    data.peerCompanyList = peersList;
  }

  // Cache the result
  companyCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + COMPANY_DATA_TTL,
  });

  // Prevent cache from growing unbounded
  if (companyCache.size > 200) {
    const oldestKey = companyCache.keys().next().value;
    if (oldestKey) companyCache.delete(oldestKey);
  }

  return data;
}
