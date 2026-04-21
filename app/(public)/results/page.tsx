import ResultsSection from "@/components/shared/ResultsSection";

export default function ResultsPage() {
  return (
    <main className="relative mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_14px_30px_rgba(24,58,120,0.1)] sm:p-8">
        <div className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-[#9bc2ff]/22 blur-[90px]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-[#9de2ff]/20 blur-[90px]" />
        <h1 className="relative z-10 bg-linear-to-r from-[#102550] to-[#2d86cc] bg-clip-text text-4xl font-extrabold font-display text-transparent sm:text-5xl">
          Result
        </h1>
        <p className="relative z-10 mt-3 max-w-2xl text-sm font-medium leading-relaxed text-[#6074a0] sm:text-base">
          Track company financial result breakdowns with audit points and clear crux insights.
        </p>
      </section>

      <ResultsSection />
    </main>
  );
}
