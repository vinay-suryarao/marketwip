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
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-6 py-10 md:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#d8e2f5] bg-white p-7 shadow-[0_12px_28px_rgba(24,58,120,0.1)]">
        <div className="pointer-events-none absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-[#9de2ff]/20 blur-[100px]"></div>
        <h1 className="relative z-10 bg-linear-to-r from-[#102550] to-[#2d86cc] bg-clip-text text-4xl font-extrabold font-display text-transparent">
          {safeCategory === "all" ? "All News" : `${getCategoryLabel(safeCategory)} News`}
        </h1>
        <p className="relative z-10 mt-2 text-base font-medium text-[#6074a0]">
          Focused stock-market stream for this category with fast search and quick switching.
        </p>
      </section>

      <LiveNewsSection initialCategory={safeCategory} />
    </main>
  );
}
