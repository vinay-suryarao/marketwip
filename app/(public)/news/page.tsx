import LiveNewsSection from "@/components/shared/LiveNewsSection";

export default function NewsPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-2xl border border-[#1A2552] bg-[#0A102E] p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] sm:rounded-3xl sm:p-7">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#00F0FF] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <h1 className="relative z-10 bg-gradient-to-r from-white to-[#00F0FF] bg-clip-text text-3xl font-extrabold font-display text-transparent sm:text-4xl">Share Market News Board</h1>
        <p className="relative z-10 mt-2 text-sm font-medium text-[#8B95A5] sm:text-base">
          Browse latest stock updates, filter by category, and search by stock tag in seconds.
        </p>
      </section>

      <LiveNewsSection />
    </main>
  );
}
