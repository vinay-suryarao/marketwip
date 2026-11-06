/* ─── Superstars / Superinvestor Portfolio Service ─── */

export type SuperstarHolding = {
  companyName?: string;
  symbol?: string;
  holdingValue?: number;
  holdingPercentage?: number;
  quantity?: number;
  [key: string]: unknown;
};

export type SuperstarTransaction = {
  companyName?: string;
  symbol?: string;
  type?: "Buy" | "Sell" | "Increase" | "Decrease" | string;
  quantity?: number;
  value?: number;
  date?: string;
  [key: string]: unknown;
};

export type SuperstarSectorAllocation = {
  sector?: string;
  percentage?: number;
  value?: number;
  [key: string]: unknown;
};

export type Superstar = {
  name: string;
  portfolioValue?: number;
  portfolioValueChange?: number;
  numberOfStocks?: number;
  sectorPreference?: SuperstarSectorAllocation[];
  topHoldings?: SuperstarHolding[];
  recentlyBought?: SuperstarTransaction[];
  recentlySold?: SuperstarTransaction[];
  quarterlyNetWorth?: number;
  [key: string]: unknown;
};

export type SuperstarsData = {
  investors: Superstar[];
  lastUpdated?: string;
};

const BASE_URL = "https://data.finedgeapi.com/api/v1";

function getApiKey(): string {
  const key = process.env.FINEDGE_API_KEY?.trim();
  if (!key) {
    throw new Error("FINEDGE_API_KEY is not set in environment variables");
  }
  return key.replace(/^["']|["']$/g, "");
}

async function finedgeFetch(endpoint: string): Promise<any> {
  const apiKey = getApiKey();
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}token=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    if (response.status === 401 && errorText.includes("not authorized")) {
      throw new Error("Superstars data is not available in your current FinEdge plan. Upgrade to access this feature.");
    }
    throw new Error(`FinEdge API returned ${response.status}: ${errorText}`);
  }

  return response.json();
}

/* ─── Cache ─── */

type CacheEntry<T> = { data: T; expiresAt: number };
let superstarsCache: CacheEntry<SuperstarsData> | null = null;
const SUPERSTARS_TTL = 15 * 60 * 1000; // 15 minutes

/* ─── Helper: Format Cr value ─── */

function formatCrValue(value: number | null | undefined): string {
  if (value == null) return "—";
  if (Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Lakh Cr`;
  }
  if (Math.abs(value) >= 1) {
    return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  }
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

/* ─── Fetch Superstars Data ─── */

export async function fetchSuperstarsData(): Promise<SuperstarsData> {
  if (superstarsCache && Date.now() < superstarsCache.expiresAt) {
    return superstarsCache.data;
  }

  // Try multiple possible FinEdge endpoints for superinvestor data
  const endpoints = [
    "/superinvestor",
    "/superinvestor/portfolio",
    "/superstar-portfolio",
    "/superstar",
    "/investor-portfolio",
  ];

  let rawData: any = null;

  for (const endpoint of endpoints) {
    try {
      rawData = await finedgeFetch(endpoint);
      if (rawData) {
        console.log(`[FinEdge] ✅ Superstars data loaded from ${endpoint}`);
        break;
      }
    } catch (err) {
      console.log(`[FinEdge] Superstars endpoint ${endpoint} failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (!rawData) {
    throw new Error(
      "Superstars portfolio data is not available. This feature requires a paid FinEdge plan."
    );
  }

  // Parse the response — adapt to whatever shape FinEdge returns
  const investorsList: any[] = Array.isArray(rawData)
    ? rawData
    : rawData.investors ?? rawData.data ?? rawData.superinvestors ?? rawData.portfolios ?? [];

  const investors: Superstar[] = investorsList.map((inv: any) => ({
    name: inv.name || inv.investorName || inv.investor_name || "Unknown Investor",
    portfolioValue: inv.portfolioValue ?? inv.portfolio_value ?? inv.totalValue ?? undefined,
    portfolioValueChange: inv.portfolioValueChange ?? inv.portfolio_change ?? inv.changePercent ?? undefined,
    numberOfStocks: inv.numberOfStocks ?? inv.stock_count ?? inv.numStocks ?? undefined,
    sectorPreference: parseSectorAllocation(inv.sectorPreference ?? inv.sector_allocation ?? inv.sectors),
    topHoldings: parseHoldings(inv.topHoldings ?? inv.top_holdings ?? inv.holdings),
    recentlyBought: parseTransactions(inv.recentlyBought ?? inv.recently_bought ?? inv.buys, "Buy"),
    recentlySold: parseTransactions(inv.recentlySold ?? inv.recently_sold ?? inv.sells, "Sell"),
    quarterlyNetWorth: inv.quarterlyNetWorth ?? inv.quarterly_net_worth ?? undefined,
  }));

  const result: SuperstarsData = {
    investors,
    lastUpdated: rawData.lastUpdated ?? rawData.last_updated ?? new Date().toISOString(),
  };

  superstarsCache = {
    data: result,
    expiresAt: Date.now() + SUPERSTARS_TTL,
  };

  return result;
}

/* ─── Parsers for nested data ─── */

function parseSectorAllocation(raw: any): SuperstarSectorAllocation[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((s: any) => ({
    sector: s.sector || s.sectorName || s.name || "",
    percentage: s.percentage ?? s.weight ?? s.percent ?? undefined,
    value: s.value ?? s.amount ?? undefined,
  }));
}

function parseHoldings(raw: any): SuperstarHolding[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((h: any) => ({
    companyName: h.companyName || h.company_name || h.name || "",
    symbol: h.symbol || h.ticker || "",
    holdingValue: h.holdingValue ?? h.value ?? h.amount ?? undefined,
    holdingPercentage: h.holdingPercentage ?? h.percentage ?? h.weight ?? undefined,
    quantity: h.quantity ?? h.shares ?? undefined,
  }));
}

function parseTransactions(raw: any, defaultType: string): SuperstarTransaction[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((t: any) => ({
    companyName: t.companyName || t.company_name || t.name || "",
    symbol: t.symbol || t.ticker || "",
    type: t.type || t.action || defaultType,
    quantity: t.quantity ?? t.shares ?? undefined,
    value: t.value ?? t.amount ?? undefined,
    date: t.date || t.transactionDate || undefined,
  }));
}

export { formatCrValue };

