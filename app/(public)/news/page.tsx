import LiveNewsSection from "@/components/shared/LiveNewsSection";

export default function NewsPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-6 py-10 md:px-8">
      <section className="rounded-3xl border border-[#1A2552] bg-[#0A102E] p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#00F0FF] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <h1 className="text-4xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00F0FF] relative z-10">Share Market News Board</h1>
        <p className="mt-2 text-base text-[#8B95A5] font-medium relative z-10">
          Browse latest stock updates, filter by category, and search by stock tag in seconds.
        </p>
      </section>

      <LiveNewsSection />
    </main>
  );
}
