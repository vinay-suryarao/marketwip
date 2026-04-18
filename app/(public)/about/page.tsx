import IPODashboard from "@/components/shared/IPODashboard";

export default function AboutPage() {
  return (
    <main className="relative mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_14px_30px_rgba(24,58,120,0.1)] sm:p-8">
        <div className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-[#9bc2ff]/22 blur-[90px]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-[#9de2ff]/20 blur-[90px]" />
        <h1 className="relative z-10 bg-linear-to-r from-[#102550] to-[#2d86cc] bg-clip-text text-4xl font-extrabold font-display text-transparent sm:text-5xl">
          About Market W.I.P
        </h1>
        <p className="relative z-10 mt-3 max-w-2xl text-sm font-medium leading-relaxed text-[#6074a0] sm:text-base">
          Market W.I.P simplifies important stock-market updates into clear, structured summaries so users can focus on what matters.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[#d8e2f5] bg-white p-6 shadow-[0_10px_22px_rgba(24,58,120,0.1)]">
          <h2 className="text-2xl font-extrabold text-[#173462]">What We Do</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6074a0]">
            We cover work orders, results, expansions, MoUs, and market-relevant company updates in a short and readable format.
          </p>
        </article>

        <article className="rounded-2xl border border-[#d8e2f5] bg-white p-6 shadow-[0_10px_22px_rgba(24,58,120,0.1)]">
          <h2 className="text-2xl font-extrabold text-[#173462]">Our Goal</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6074a0]">
            Cut through noise and help users navigate stock updates with category-first clarity and actionable context.
          </p>
        </article>
      </section>

      <IPODashboard />

      <section className="rounded-2xl border border-[#f2b0b8] bg-[#fff6f8] p-6 shadow-[0_10px_22px_rgba(24,58,120,0.08)]">
        <h2 className="text-2xl font-extrabold text-[#7d2031]">Disclaimer</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6074a0]">
          Market W.I.P is for educational and informational purposes only. We are not SEBI-registered advisors and do not provide buy/sell recommendations.
        </p>
      </section>
    </main>
  );
}
