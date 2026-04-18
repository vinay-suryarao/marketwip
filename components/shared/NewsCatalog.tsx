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
      <div className="rounded-2xl border border-[#d8e2f5] bg-white p-6 shadow-[0_10px_24px_rgba(24,58,120,0.1)]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-[#cfdbf3] bg-white px-5 py-3.5 text-[15px] font-medium text-[#16305f] placeholder:text-[#8599c1] outline-none ring-[#71d6ff]/20 transition hover:border-[#b5c7ee] focus:border-[#71d6ff] focus:ring-4"
          placeholder="Search by title, content or stock tag"
          aria-label="Search news"
        />
        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveCategory(ALL_CATEGORIES)}
            type="button"
            className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide transition ${
              activeCategory === ALL_CATEGORIES
                ? "border border-[#f0c659] bg-[#e9b742] text-[#13204a]"
                : "border border-[#d3def4] bg-[#f6f9ff] text-[#33568f] hover:bg-[#edf3ff]"
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
                  ? "border border-[#f0c659] bg-[#e9b742] text-[#13204a]"
                  : "border border-[#d3def4] bg-[#f6f9ff] text-[#33568f] hover:bg-[#edf3ff]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d8e2f5] bg-white p-8 text-center text-sm font-medium text-[#6074a0]">
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
