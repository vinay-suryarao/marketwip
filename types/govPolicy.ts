export type GovPolicyRow = {
  dateOfPost: string;
  department: string;
  headline: string;
  description: string;
  sector: string;
  pibReference: string;
};

export type GovPolicyRecord = GovPolicyRow & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
