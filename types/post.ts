export type NewsPost = {
  id: string;
  title: string;
  content: string;
  stockTag: string;
  imageUrl: string;
  slug: string;
  category: string;
  createdAt: string;
};

export type CreatePostInput = {
  title: string;
  content: string;
  stockTag: string;
  imageUrl: string;
  category: string;
};
