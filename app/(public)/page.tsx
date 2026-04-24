import Link from "next/link";
import FIIDIIActivityDisplay from "@/components/shared/FIIDIIActivityDisplay";
import EconomicMapWidget from "@/components/shared/EconomicMapWidget";
import { NEWS_CATEGORIES } from "@/constants/newsCategories";

const categoryCardMeta: Record<
  string,
  { description: string; iconBg: string; iconColor: string; iconType: "doc" | "briefcase" | "trend" | "factory" | "handshake" | "bar" | "dots" }
> = {
  "work-order": {
    description: "New contracts and project wins",
    iconBg: "bg-[#dcecff]",
    iconColor: "text-[#1f7bd6]",
    iconType: "briefcase",
  },
  acquisitions: {
    description: "M&A deals and strategic investments",
    iconBg: "bg-[#f0ddff]",
    iconColor: "text-[#9836d4]",
    iconType: "trend",
  },
  "capacity-expansions": {
    description: "Infrastructure and production growth",
    iconBg: "bg-[#dbf5e7]",
    iconColor: "text-[#1c9a5f]",
    iconType: "factory",
  },
  mou: {
    description: "Strategic partnerships and agreements",
    iconBg: "bg-[#ffe8d8]",
    iconColor: "text-[#e06617]",
    iconType: "handshake",
  },
  results: {
    description: "Quarterly and annual financial results",
    iconBg: "bg-[#ffdff0]",
    iconColor: "text-[#d1268a]",
    iconType: "bar",
  },
  other: {
    description: "Industry news and market updates",
    iconBg: "bg-[#e2ebf8]",
    iconColor: "text-[#44618a]",
    iconType: "dots",
  },
};

function CategoryIcon({ type }: { type: "doc" | "briefcase" | "trend" | "factory" | "handshake" | "bar" | "dots" }) {
  if (type === "briefcase") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M9 7V5h6v2" />
      </svg>
    );
  }

  if (type === "trend") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
        <path d="M4 16l5-5 4 3 7-7" />
        <path d="M15 7h5v5" />
      </svg>
    );
  }

  if (type === "factory") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
        <path d="M3 20V9l6 3V9l6 3V5h6v15H3z" />
        <path d="M7 15h2M11 15h2M15 15h2" />
      </svg>
    );
  }

  if (type === "handshake") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
        <path d="M7 12l3 3a2 2 0 002.8 0l4.2-4.2" />
        <path d="M3 10l4-4 4 4-4 4-4-4z" />
        <path d="M13 10l4-4 4 4-4 4-4-4z" />
      </svg>
    );
  }

  if (type === "bar") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
        <path d="M4 20V4" />
        <path d="M4 20h16" />
        <rect x="8" y="12" width="2.5" height="6" />
        <rect x="12" y="9" width="2.5" height="9" />
        <rect x="16" y="6" width="2.5" height="12" />
      </svg>
    );
  }

  if (type === "dots") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
        <circle cx="6" cy="12" r="1.7" />
        <circle cx="12" cy="12" r="1.7" />
        <circle cx="18" cy="12" r="1.7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-full flex-1 flex-col gap-8 overflow-x-hidden px-4 py-8 sm:px-6 md:max-w-300 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f3f8ff] px-5 py-8 shadow-[0_16px_34px_rgba(24,58,120,0.12)] sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#9bc2ff]/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#9de2ff]/24 blur-[100px]" />

        <div className="relative z-10 mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#cddcf6] bg-[#ffffff]/85 px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#305ea3] sm:text-sm">
          LIVE MARKET COVERAGE
        </div>

        <h1 className="mx-auto max-w-4xl text-center font-display text-4xl font-extrabold leading-tight text-[#132746] sm:text-6xl sm:leading-[1.1]">
          Latest Indian stock market news and updates
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm font-medium leading-relaxed text-[#6074a0] sm:text-base">
          Track work orders, acquisitions, capacity expansions, MoUs, financial results, and economic events from India&apos;s leading companies.
        </p>

        <form action="/news" className="mx-auto mt-6 max-w-4xl">
          <label htmlFor="home-search" className="sr-only">
            Search for companies and stocks
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8da0c4]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20 L16.5 16.5" />
              </svg>
            </span>
            <input
              id="home-search"
              name="q"
              type="search"
              placeholder="Search for companies and stocks to analyse"
              className="h-14 w-full rounded-xl border border-[#cbdcf7] bg-[#ffffff] pl-12 pr-4 text-[15px] font-medium text-[#173462] outline-none transition placeholder:text-[#8da0c4] focus:border-[#2e7ac9] focus:ring-4 focus:ring-[#2e7ac9]/15"
            />
          </div>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <Link href="/news" className="rounded-full border border-[#cddcf6] bg-[#ffffff] px-4 py-2 text-xs font-bold text-[#2e7ac9] transition hover:bg-[#f1f7ff] sm:text-sm">
            Explore News
          </Link>
          <Link href="/results" className="rounded-full border border-[#cddcf6] bg-[#ffffff] px-4 py-2 text-xs font-bold text-[#2e7ac9] transition hover:bg-[#f1f7ff] sm:text-sm">
            Company Results
          </Link>
          <Link href="/economic-calendar" className="rounded-full border border-[#cddcf6] bg-[#ffffff] px-4 py-2 text-xs font-bold text-[#2e7ac9] transition hover:bg-[#f1f7ff] sm:text-sm">
            Economic Calendar
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#d7e4fb] bg-[#ffffff]/90 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]">Coverage</p>
            <p className="mt-1 text-xl font-extrabold text-[#173462]">{NEWS_CATEGORIES.length} Categories</p>
          </div>
          <div className="rounded-2xl border border-[#d7e4fb] bg-[#ffffff]/90 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]">Focus</p>
            <p className="mt-1 text-xl font-extrabold text-[#173462]">Results + Flows</p>
          </div>
          <div className="rounded-2xl border border-[#d7e4fb] bg-[#ffffff]/90 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]">Updates</p>
            <p className="mt-1 text-xl font-extrabold text-[#173462]">Realtime Widgets</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f8fbff] p-5 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-7">
        <div className="mb-5 border-b border-[#d8e2f5] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f77a5]">Market Discovery</p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#173462] sm:text-3xl">Browse by category</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS_CATEGORIES.map((category) => {
            const meta = categoryCardMeta[category.value];

            return (
              <Link
                key={category.value}
                href={`/news/category/${category.value}`}
                className="group rounded-2xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f9fcff] p-5 shadow-[0_8px_20px_rgba(20,58,120,0.07)] transition hover:-translate-y-0.5 hover:border-[#c7d8f7] hover:shadow-[0_14px_26px_rgba(20,58,120,0.12)]"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${meta.iconBg} ${meta.iconColor}`}>
                  <CategoryIcon type={meta.iconType} />
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#173462]">{category.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6074a0]">{meta.description}</p>

                <p className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#2e7ac9]">
                  Explore
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                    &rarr;
                  </span>
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f7fbff] p-6 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-8">
        <div className="mb-5 border-b border-[#d8e2f5] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f77a5]">Liquidity Pulse</p>
          <h2 className="text-2xl font-extrabold text-[#173462] sm:text-3xl">FII / DII Activity Snapshot</h2>
          <p className="mt-2 text-sm text-[#6074a0]">
            Live market cash flow view for quick daily context.
          </p>
        </div>
        <FIIDIIActivityDisplay />

        <div className="mt-6 overflow-hidden rounded-xl border border-[#deebff] bg-[#fbfdff] p-3 sm:p-4">
          <h3 className="mb-3 text-base font-extrabold text-[#173462] sm:text-lg">Economic Map</h3>
          <EconomicMapWidget />
        </div>
      </section>
    </main>
  );
}
