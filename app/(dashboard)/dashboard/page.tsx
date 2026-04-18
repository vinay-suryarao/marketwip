import Link from "next/link";
import WishlistManager from "@/components/dashboard/WishlistManager";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-8 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-5 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:rounded-3xl sm:p-7">
        <h1 className="bg-linear-to-r from-[#102550] via-[#1a3f89] to-[#2d86cc] bg-clip-text text-3xl font-extrabold font-display text-transparent sm:text-4xl">Central Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#6074a0]">
          Manage your stock watchlist, monitor market feeds, and access key sections quickly from one organized workspace.
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-[13px] font-bold tracking-wide">
          <span className="rounded-full border border-[#bfd1f1] bg-[#f4f8ff] px-4 py-1.5 text-[#2e7ac9]">Manage Wishlist</span>
          <span className="rounded-full border border-[#d5e0f5] bg-[#f9fbff] px-4 py-1.5 text-[#5d729e]">News Feed</span>
          <span className="rounded-full border border-[#d5e0f5] bg-[#f9fbff] px-4 py-1.5 text-[#5d729e]">Category Tracking</span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold font-display tracking-wide text-[#173462]">Your Wishlist</h2>
        <WishlistManager />
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-[#d8e2f5] bg-white p-5 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:rounded-3xl md:p-7">
        <div className="pointer-events-none absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-[#92dfff]/20 blur-[100px]"></div>

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 border-b border-[#d8e2f5] pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2e7ac9]">Market Workflow</p>
            <h2 className="mt-2 text-xl font-bold font-display text-[#173462] sm:text-2xl">Your daily execution path</h2>
          </div>
          <Link
            href="/news"
            className="rounded-xl bg-[#4353FF] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(67,83,255,0.4)] transition hover:scale-105 active:scale-95 border border-[#4353FF] hover:bg-[#5C6EFF] hover:border-[#5C6EFF]"
          >
            Open Live Feed
          </Link>
        </div>

        <div className="relative z-10 mt-6 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-[#d8e2f5] bg-[#f9fbff] p-6 transition hover:border-[#bfd1f1] hover:shadow-[0_10px_24px_rgba(24,58,120,0.1)]">
            <h3 className="text-lg font-bold font-display text-[#173462]">What to do first</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-[#6074a0]">
              Review latest market headlines, then switch to your preferred category and shortlist action-worthy updates.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/news"
                className="rounded-xl border border-[#c9d9f6] bg-white px-4 py-2 text-sm font-semibold text-[#27447f] transition hover:bg-[#edf3ff]"
              >
                Browse News
              </Link>
              <Link
                href="/news/category/work-order"
                className="rounded-xl border border-[#c9d9f6] bg-white px-4 py-2 text-sm font-semibold text-[#27447f] transition hover:bg-[#edf3ff]"
              >
                Work Order
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-[#d8e2f5] bg-[#f9fbff] p-6 transition hover:border-[#bfd1f1] hover:shadow-[0_10px_24px_rgba(24,58,120,0.1)]">
            <h3 className="text-lg font-bold font-display text-[#173462]">Your alert readiness</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-[#6074a0]">
              Keep your wishlist tags updated to receive matching stock-news alerts quickly when admin publishes new posts.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/wishlist"
                className="rounded-xl border border-[#c9d9f6] bg-white px-4 py-2 text-sm font-semibold text-[#27447f] transition hover:bg-[#edf3ff]"
              >
                Manage Wishlist
              </Link>
              <Link
                href="/news/category/results"
                className="rounded-xl border border-[#c9d9f6] bg-white px-4 py-2 text-sm font-semibold text-[#27447f] transition hover:bg-[#edf3ff]"
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
