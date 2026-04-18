import EconomicCalendarWidget from "@/components/shared/EconomicCalendarWidget";

export default function EconomicCalendarPage() {
  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-2xl border border-[#d8e2f5] bg-white p-5 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:rounded-3xl sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#9de2ff]/18 blur-[90px]" />
        <h1 className="relative z-10 bg-linear-to-r from-[#102550] via-[#1a3f89] to-[#2d86cc] bg-clip-text text-3xl font-extrabold font-display text-transparent sm:text-4xl">
          Economic Calendar
        </h1>
        <p className="relative z-10 mt-2 text-sm font-medium text-[#6074a0] sm:text-base">
          Live macro events powered by TradingView. As their calendar updates, this feed updates here as well.
        </p>
      </section>

      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-3 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-4">
        <EconomicCalendarWidget />
      </section>
    </main>
  );
}
