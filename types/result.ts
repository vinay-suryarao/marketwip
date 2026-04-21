export type ResultMetricCells = {
  yoy: string;
  qoq: string;
  month1: string;
  month2: string;
  month3: string;
};

export type CompanyResultInput = {
  companyName: string;
  marketCap: string;
  monthLabel1: string;
  monthLabel2: string;
  monthLabel3: string;
  sales: ResultMetricCells;
  netProfit: ResultMetricCells;
  eps: ResultMetricCells;
  auditPoints: string[];
  crux: string;
};

export type CompanyResultRecord = CompanyResultInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
