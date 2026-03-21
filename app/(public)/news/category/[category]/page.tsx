import { NEWS_CATEGORIES, getCategoryLabel } from "@/constants/newsCategories";
import LiveNewsSection from "@/components/shared/LiveNewsSection";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function NewsCategoryPage({ params }: Props) {
  const { category } = await params;

  const safeCategory = NEWS_CATEGORIES.some((item) => item.value === category)
    ? category
    : "all";

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-6 py-10 md:px-8">
      <section className="rounded-3xl border border-[#1A2552] bg-[#0A102E] p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#C100FF] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <h1 className="text-4xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-[#C100FF] relative z-10">
          {safeCategory === "all" ? "All News" : `${getCategoryLabel(safeCategory)} News`}
        </h1>
        <p className="mt-2 text-base text-[#8B95A5] font-medium relative z-10">
          Focused stock-market stream for this category with fast search and quick switching.
        </p>
      </section>

      <LiveNewsSection initialCategory={safeCategory} />
    </main>
  );
}
