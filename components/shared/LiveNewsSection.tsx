"use client";

import NewsCatalog from "@/components/shared/NewsCatalog";
import { usePosts } from "@/hooks/usePosts";

type Props = {
  initialCategory?: string;
};

export default function LiveNewsSection({ initialCategory }: Props) {
  const { posts, isLoading } = usePosts();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#d8e2f5] bg-white p-6 text-sm font-medium text-[#6074a0]">
        Loading latest posts...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8e2f5] bg-white p-8 text-center text-sm font-medium text-[#6074a0]">
        No posts yet. Create your first post from admin panel.
      </div>
    );
  }

  return <NewsCatalog posts={posts} initialCategory={initialCategory} />;
}
