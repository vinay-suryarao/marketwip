"use client";

import { useMemo, useState } from "react";
import NewsCard from "@/components/shared/NewsCard";
import { NEWS_CATEGORIES, type NewsCategory } from "@/constants/newsCategories";
import type { NewsPost } from "@/types/post";

type Props = {
  posts: NewsPost[];
  initialCategory?: string;
};

const ALL_CATEGORIES = "all";

export default function NewsCatalog({ posts, initialCategory = ALL_CATEGORIES }: Props) {
  const safeInitial =
    initialCategory === ALL_CATEGORIES ||
    NEWS_CATEGORIES.some((category) => category.value === initialCategory)
      ? initialCategory
      : ALL_CATEGORIES;

  const [activeCategory, setActiveCategory] = useState<string>(safeInitial);
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return posts.filter((post) => {
      const categoryMatch =
        activeCategory === ALL_CATEGORIES || post.category === (activeCategory as NewsCategory);
      const searchMatch =
        search.length === 0 ||
        post.title.toLowerCase().includes(search) ||
        post.stockTag.toLowerCase().includes(search) ||
        post.content.toLowerCase().includes(search);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, posts, query]);

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-[#1A2552] bg-[#0A102E] p-6 shadow-2xl">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-xl border border-[#1A2552] bg-[#060B19] px-5 py-3.5 text-[15px] font-medium text-white placeholder:text-[#8B95A5] outline-none hover:border-[#4353FF]/50 ring-[#00F0FF]/20 transition focus:ring-4 focus:border-[#00F0FF]"
          placeholder="Search by title, content or stock tag"
          aria-label="Search news"
        />
        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveCategory(ALL_CATEGORIES)}
            type="button"
            className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide transition ${
              activeCategory === ALL_CATEGORIES
                ? "bg-[#4353FF] text-white shadow-[0_0_15px_rgba(67,83,255,0.4)] border border-[#4353FF]"
                : "bg-[#1A2552] text-[#8B95A5] border border-[#1A2552] hover:bg-[#1A2552]/80 hover:text-white"
            }`}
          >
            All News
          </button>
          {NEWS_CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              type="button"
              className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide transition ${
                activeCategory === category.value
                  ? "bg-[#4353FF] text-white shadow-[0_0_15px_rgba(67,83,255,0.4)] border border-[#4353FF]"
                  : "bg-[#1A2552] text-[#8B95A5] border border-[#1A2552] hover:bg-[#1A2552]/80 hover:text-white"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#1A2552] bg-[#0A102E] p-8 text-center text-sm font-medium text-[#8B95A5]">
          No news found for selected filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
