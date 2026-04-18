import WishlistManager from "@/components/dashboard/WishlistManager";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <main className="mx-auto w-full max-w-300 flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-2xl border border-[#d8e2f5] bg-white p-5 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:rounded-3xl sm:p-7">
        <div className="pointer-events-none absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-[#92dfff]/20 blur-[100px]"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e2f5] pb-5">
          <div>
            <h1 className="bg-linear-to-r from-[#102550] via-[#1a3f89] to-[#2d86cc] bg-clip-text text-2xl font-extrabold font-display text-transparent sm:text-3xl">Wishlist Tags</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-[#6074a0]">
              Add stock tags that matter to you. Matching updates are delivered to your email.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border border-[#c9d9f6] bg-white px-4 py-2 text-sm font-semibold text-[#27447f] transition hover:bg-[#edf3ff]"
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
