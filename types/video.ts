export type MarketVideo = {
  id: string;
  tag: string;
  youtubeUrl: string;
  createdAt: string;
};

export type CreateVideoInput = {
  tag: string;
  youtubeUrl: string;
};
