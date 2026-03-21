import Link from "next/link";
import WishlistManager from "@/components/dashboard/WishlistManager";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-8 px-6 py-10 md:px-8">
      <section className="rounded-3xl border border-[#1A2552] bg-[#0A102E] p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <h1 className="text-4xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00F0FF]">Central Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8B95A5] font-medium">
          Manage your stock watchlist, monitor market feeds, and access key sections quickly from one organized workspace.
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-[13px] font-bold tracking-wide">
          <span className="rounded-full bg-[#1A2552] border border-[#4353FF]/40 px-4 py-1.5 text-[#00F0FF] shadow-[0_0_10px_rgba(67,83,255,0.2)]">Manage Wishlist</span>
          <span className="rounded-full bg-[#1A2552] border border-white/10 px-4 py-1.5 text-white/80">News Feed</span>
          <span className="rounded-full bg-[#1A2552] border border-white/10 px-4 py-1.5 text-white/80">Category Tracking</span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold font-display text-white tracking-wide">Your Wishlist</h2>
        <WishlistManager />
      </section>

      <section className="rounded-3xl border border-[#1A2552] bg-[#0A102E] p-6 shadow-2xl md:p-7 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#4353FF] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#1A2552] pb-5 relative z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#34E0A1]">Market Workflow</p>
            <h2 className="mt-2 text-2xl font-bold font-display text-white">Your daily execution path</h2>
          </div>
          <Link
            href="/news"
            className="rounded-xl bg-[#4353FF] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(67,83,255,0.4)] transition hover:scale-105 active:scale-95 border border-[#4353FF] hover:bg-[#5C6EFF] hover:border-[#5C6EFF]"
          >
            Open Live Feed
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 relative z-10">
          <article className="rounded-2xl border border-[#1A2552] bg-[#060B19]/50 p-6 backdrop-blur-sm transition hover:border-[#4353FF]/50 hover:shadow-[0_10px_30px_rgba(67,83,255,0.1)]">
            <h3 className="text-lg font-bold font-display text-white">What to do first</h3>
            <p className="mt-2 text-sm leading-6 text-[#8B95A5] font-medium">
              Review latest market headlines, then switch to your preferred category and shortlist action-worthy updates.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/news"
                className="rounded-xl bg-[#1A2552] border border-[#1A2552] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4353FF] hover:border-[#4353FF]"
              >
                Browse News
              </Link>
              <Link
                href="/news/category/work-order"
                className="rounded-xl bg-[#1A2552] border border-[#1A2552] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4353FF] hover:border-[#4353FF]"
              >
                Work Order
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-[#1A2552] bg-[#060B19]/50 p-6 backdrop-blur-sm transition hover:border-[#4353FF]/50 hover:shadow-[0_10px_30px_rgba(67,83,255,0.1)]">
            <h3 className="text-lg font-bold font-display text-white">Your alert readiness</h3>
            <p className="mt-2 text-sm leading-6 text-[#8B95A5] font-medium">
              Keep your wishlist tags updated to receive matching stock-news alerts quickly when admin publishes new posts.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/wishlist"
                className="rounded-xl bg-[#1A2552] border border-[#1A2552] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4353FF] hover:border-[#4353FF]"
              >
                Manage Wishlist
              </Link>
              <Link
                href="/news/category/results"
                className="rounded-xl bg-[#1A2552] border border-[#1A2552] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4353FF] hover:border-[#4353FF]"
              >
                Results Feed
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
