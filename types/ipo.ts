export type ActiveUpcomingIPORow = {
  ipoName: string;
  priceBand: string;
  dates: string;
  minInvest: string;
  gmp: string;
  type: string;
  pe: string;
  salesFy2324: string;
  salesFy2425: string;
  salesFy2526: string;
  netProfitFy2324: string;
  netProfitFy2425: string;
  netProfitFy2526: string;
  qibSub: string;
  retailSub: string;
  hniSub: string;
  totalSub: string;
  allotDate: string;
  refundDate: string;
};

export type RecentIPORow = {
  ipoName: string;
  priceBand: string;
  listingPrice: string;
  listingGain: string;
  anchorLockIn50: string;
  anchorLockIn100: string;
  preIpoLockIn: string;
};

export type ActiveUpcomingIPORecord = ActiveUpcomingIPORow & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type RecentIPORecord = RecentIPORow & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type IPODashboardData = {
  activeUpcoming: ActiveUpcomingIPORecord[];
  recentIpos: RecentIPORecord[];
  lastUpdatedAt: string | null;
};
