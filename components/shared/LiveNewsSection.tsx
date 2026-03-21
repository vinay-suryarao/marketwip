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
      <div className="rounded-2xl border border-[#1A2552] bg-[#060B19]/50 p-6 text-sm font-medium text-[#8B95A5]">
        Loading latest posts...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#1A2552] bg-[#060B19]/50 p-8 text-center text-sm font-medium text-[#8B95A5]">
        No posts yet. Create your first post from admin panel.
      </div>
    );
  }

  return <NewsCatalog posts={posts} initialCategory={initialCategory} />;
}
