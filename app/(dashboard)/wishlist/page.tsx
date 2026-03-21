import WishlistManager from "@/components/dashboard/WishlistManager";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-2xl border border-[#1A2552] bg-[#0A102E] p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] sm:rounded-3xl sm:p-7">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#C100FF] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1A2552] pb-5 relative z-10">
          <div>
            <h1 className="bg-gradient-to-r from-white to-[#00F0FF] bg-clip-text text-2xl font-extrabold font-display text-transparent sm:text-3xl">Wishlist Tags</h1>
            <p className="mt-2 text-sm leading-6 text-[#8B95A5] font-medium">
              Add stock tags that matter to you. Matching updates are delivered to your email.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border border-[#1A2552] bg-[#060B19] px-4 py-2 text-sm font-semibold text-[#8B95A5] transition hover:bg-[#1A2552] hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-6">
          <WishlistManager />
        </div>
      </section>
    </main>
  );
}
