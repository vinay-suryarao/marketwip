export type UserProfile = {
  uid: string;
  email?: string;
  displayName?: string;
  role?: "admin" | "user";
  wishlist: string[];
  updatedAt: string;
};
