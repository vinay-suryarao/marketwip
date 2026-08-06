import type { StockListItem, CompanyData } from "@/types/analyzer";

const BASE_URL = "https://stock.indianapi.in";

function getApiKey(): string {
  const key = process.env.INDIAN_API_KEY;
  if (!key) {
    throw new Error("INDIAN_API_KEY is not set in environment variables");
  }
  return key;
}

/* ─── In-memory cache ─── */

type CacheEntry<T> = { data: T; expiresAt: number };

let stockListCache: CacheEntry<StockListItem[]> | null = null;
const companyCache = new Map<string, CacheEntry<CompanyData>>();

const STOCK_LIST_TTL = 60 * 60 * 1000; // 1 hour
const COMPANY_DATA_TTL = 5 * 60 * 1000; // 5 minutes

/* ─── Fetch all stocks (for autocomplete search) ─── */

export async function fetchStockList(): Promise<StockListItem[]> {
  if (stockListCache && Date.now() < stockListCache.expiresAt) {
    return stockListCache.data;
  }

  const apiKey = getApiKey();

  const urls = [
    "https://analyst.indianapi.in/static/all_stocks.json",
    `${BASE_URL}/static/all_stocks.json`,
  ];

  let lastError: Error | null = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { "X-Api-Key": apiKey },
        cache: "no-store",
      });

      if (!response.ok) {
        lastError = new Error(`${url} returned ${response.status}`);
        continue;
      }

      const raw = await response.json();
      // The response may be an array directly or wrapped in an object
      const data: StockListItem[] = Array.isArray(raw) ? raw : (raw.stocks ?? raw.data ?? []);

      if (data.length > 0) {
        stockListCache = {
          data,
          expiresAt: Date.now() + STOCK_LIST_TTL,
        };
        return data;
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("Failed to fetch stock list from all endpoints");
}

/* ─── Fetch company data (for company analysis page) ─── */

export async function fetchStockData(name: string): Promise<CompanyData> {
  const cacheKey = name.toLowerCase().trim();

  const cached = companyCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const apiKey = getApiKey();
  const encodedName = encodeURIComponent(name);

  const urls = [
    `${BASE_URL}/stock?name=${encodedName}`,
    `https://analyst.indianapi.in/stock?name=${encodedName}`,
  ];

  let lastError: Error | null = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { "X-Api-Key": apiKey },
        cache: "no-store",
      });

      if (!response.ok) {
        lastError = new Error(`${url} returned ${response.status}`);
        continue;
      }

      const data = (await response.json()) as any;

      if (data && data.error) {
        lastError = new Error(data.error);
        break;
      }

      if (data && (data.companyName || data.tickerId)) {
        
        // Transform the financials array into the expected UI structures
        if (Array.isArray(data.financials)) {
          // Separate into Quarterly (Interim) and Annual
          const quarterlyPeriods = data.financials.filter((f: any) => f.Type === "Interim").sort((a: any, b: any) => new Date(a.EndDate).getTime() - new Date(b.EndDate).getTime());
          const annualPeriods = data.financials.filter((f: any) => f.Type === "Annual").sort((a: any, b: any) => new Date(a.EndDate).getTime() - new Date(b.EndDate).getTime());

          const buildTable = (periods: any[], mapKey: string) => {
            if (periods.length === 0) return undefined;
            const metricsMap = new Map<string, Record<string, string | number | null>>();
            
            // Collect all columns (dates)
            const cols = periods.map(p => {
              const d = new Date(p.EndDate);
              return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
            });

            // Map each metric
            periods.forEach((period, pIdx) => {
              const colName = cols[pIdx];
              const section = period.stockFinancialMap?.[mapKey];
              if (Array.isArray(section)) {
                section.forEach((item: any) => {
                  const metricName = item.displayName || item.key;
                  if (!metricsMap.has(metricName)) {
                    metricsMap.set(metricName, { "Metric": metricName });
                  }
                  const row = metricsMap.get(metricName)!;
                  row[colName] = item.value;
                });
              }
            });

            return Array.from(metricsMap.values());
          };

          data.quarterlyResults = buildTable(quarterlyPeriods, "INC"); // Quarterly income statement
          data.profitLoss = buildTable(annualPeriods, "INC"); // Annual income statement
          data.balanceSheet = buildTable(annualPeriods, "BAL"); // Balance sheet
          data.cashFlow = buildTable(annualPeriods, "CAS"); // Cash flow
        }

        if (data.stockDetailsReusableData?.peerCompanyList) {
          data.peerCompanyList = data.stockDetailsReusableData.peerCompanyList;
        }

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
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error(`Failed to fetch stock data for "${name}"`);
}
