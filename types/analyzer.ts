/* ─── Stock list item (from /static/all_stocks.json) ─── */

export type StockListItem = {
  id: string;
  name: string;
  "bse-code"?: string;
};

/* ─── Company data (from /stock?name=...) ─── */

export type CompanyData = {
  tickerId?: string;
  companyName?: string;
  companyProfile?: string | Record<string, unknown>;
  industry?: string;

  currentPrice?: {
    BSE?: number;
    NSE?: number;
  };
  percentChange?: number;

  yearHigh?: number;
  yearLow?: number;

  keyMetrics?: Record<string, string | number | null>;
  technicals?: Record<string, string | number | null>;
  stockTechnicalData?: Record<string, string | number | null>;

  quarterlyResults?: QuarterlyRow[];
  profitLoss?: FinancialRow[];
  balanceSheet?: FinancialRow[];
  cashFlow?: FinancialRow[];

  shareholding?: ShareholdingCategory[];

  peerComparison?: PeerRow[];

  stockCorporateActionData?: CorporateActionRow[];

  recentNews?: NewsItem[];

  analystView?: Record<string, unknown>;
};

/* ─── Quarterly / Annual financial rows ─── */

export type QuarterlyRow = Record<string, string | number | null>;
export type FinancialRow = Record<string, string | number | null>;

/* ─── Shareholding ─── */

export type ShareholdingEntry = {
  [period: string]: string | number | null;
};

export type ShareholdingCategory = {
  category?: string;
  values?: ShareholdingEntry[];
  [key: string]: unknown;
};

/* ─── Peer comparison ─── */

export type PeerRow = Record<string, string | number | null>;

/* ─── Corporate actions ─── */

export type CorporateActionRow = {
  date?: string;
  type?: string;
  details?: string;
  [key: string]: unknown;
};

/* ─── News ─── */

export type NewsItem = {
  title?: string;
  description?: string;
  link?: string;
  date?: string;
  source?: string;
  thumbnail?: string;
  [key: string]: unknown;
};
