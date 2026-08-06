import Link from "next/link";
import AnalyzerSearch from "@/components/shared/AnalyzerSearch";

const TRENDING_COMPANIES = [
  { name: "Reliance Industries", symbol: "RELIANCE" },
  { name: "HDFC Bank", symbol: "HDFCBANK" },
  { name: "TCS", symbol: "TCS" },
  { name: "Infosys", symbol: "INFY" },
  { name: "ICICI Bank", symbol: "ICICIBANK" },
  { name: "HAL", symbol: "HAL" },
  { name: "BEL", symbol: "BEL" },
  { name: "IRFC", symbol: "IRFC" },
];

const TRENDING_COLORS = [
  { iconBg: "bg-[#dcecff]", iconColor: "text-[#1f7bd6]" },
  { iconBg: "bg-[#dbf5e7]", iconColor: "text-[#1c9a5f]" },
  { iconBg: "bg-[#f0ddff]", iconColor: "text-[#9836d4]" },
  { iconBg: "bg-[#ffe8d8]", iconColor: "text-[#e06617]" },
  { iconBg: "bg-[#ffdff0]", iconColor: "text-[#d1268a]" },
  { iconBg: "bg-[#e8f4d9]", iconColor: "text-[#5a8a2e]" },
  { iconBg: "bg-[#fff3d8]", iconColor: "text-[#b88c1a]" },
  { iconBg: "bg-[#e2ebf8]", iconColor: "text-[#44618a]" },
];

export default function AnalyzerPage() {
  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-8 overflow-x-hidden px-4 py-8 sm:px-6 md:px-8 md:py-10">
      {/* ── Hero section ── */}
      <section className="relative rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f3f8ff] px-5 py-10 shadow-[0_16px_34px_rgba(24,58,120,0.12)] sm:px-9 sm:py-14">
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#9bc2ff]/25 blur-[90px]" />
          <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#9de2ff]/24 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#cddcf6] bg-[#ffffff]/85 px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#305ea3] sm:text-sm">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
            <path d="M4 16l5-5 4 3 7-7" />
            <path d="M15 7h5v5" />
          </svg>
          MARKET ANALYZER
        </div>

        <h1 className="mx-auto max-w-4xl text-center font-display text-4xl font-extrabold leading-tight text-[#132746] sm:text-6xl sm:leading-[1.1]">
          Analyze any NSE/BSE listed company
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm font-medium leading-relaxed text-[#6074a0] sm:text-base">
          Deep-dive into financials, ratios, shareholding patterns, peer comparisons, and more — all in one place.
        </p>

        <div className="mx-auto mt-8 max-w-2xl">
          <AnalyzerSearch />
        </div>
      </section>

      {/* ── Trending companies ── */}
      <section className="rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f8fbff] p-5 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-7">
        <div className="mb-5 border-b border-[#d8e2f5] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f77a5]">Popular Picks</p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#173462] sm:text-3xl">Trending Companies</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING_COMPANIES.map((company, idx) => {
            const color = TRENDING_COLORS[idx % TRENDING_COLORS.length];
            return (
              <Link
                key={company.symbol}
                href={`/analyzer/${company.symbol}`}
                className="group flex items-center gap-4 rounded-2xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f9fcff] p-4 shadow-[0_6px_16px_rgba(20,58,120,0.06)] transition hover:-translate-y-0.5 hover:border-[#c7d8f7] hover:shadow-[0_12px_24px_rgba(20,58,120,0.11)]"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold ${color.iconBg} ${color.iconColor}`}>
                  {company.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#173462] group-hover:text-[#2e7ac9]">{company.name}</p>
                  <p className="text-xs font-semibold text-[#8599c1]">{company.symbol}</p>
                </div>
                <span className="text-[#8599c1] transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
