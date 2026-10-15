export type GrowthStockRow = {
  dateOfPost: string;
  company: string;
  sector: string;
  pe: string;
  growthFactors: string[];
  description: string;
};

export type GrowthStockRecord = GrowthStockRow & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
