import EconomicCalendarWidget from "@/components/shared/EconomicCalendarWidget";

export default function EconomicCalendarPage() {
  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-2xl border border-[#d8e2f5] bg-white p-5 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:rounded-3xl sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#9de2ff]/18 blur-[90px]" />
        <h1 className="relative z-10 bg-linear-to-r from-[#102550] via-[#1a3f89] to-[#2d86cc] bg-clip-text text-3xl font-extrabold font-display text-transparent sm:text-4xl">
          Economic Calendar & Map
        </h1>
        <p className="relative z-10 mt-2 text-sm font-medium text-[#6074a0] sm:text-base">
          Live macro calendar and world economics map powered by TradingView. As their data updates, both widgets update here in real time.
        </p>
      </section>

      <section className="space-y-5 rounded-2xl border border-[#d8e2f5] bg-white p-3 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-4">
        <div className="overflow-hidden rounded-xl border border-[#deebff] bg-[#fbfdff] p-3 sm:p-4">
          <h2 className="mb-3 text-base font-extrabold text-[#173462] sm:text-lg">Economic Calendar</h2>
          <EconomicCalendarWidget />
        </div>
      </section>
    </main>
  );
}
