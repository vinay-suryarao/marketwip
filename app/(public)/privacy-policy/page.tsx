import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_14px_30px_rgba(24,58,120,0.1)] sm:p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e7ac9] hover:text-[#173462]">
          <span>←</span>
          <span>Back to Home</span>
        </Link>
        <h1 className="mt-4 bg-linear-to-r from-[#102550] to-[#2d86cc] bg-clip-text text-4xl font-extrabold font-display text-transparent sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm font-medium text-[#6074a0] sm:text-base">
          Your privacy and trust matter to us.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[#d8e2f5] bg-white p-6 shadow-[0_10px_22px_rgba(24,58,120,0.1)]">
          <h2 className="text-xl font-extrabold text-[#173462]">Educational Purpose</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6074a0]">
            Content on this platform is shared only for educational and informational purposes.
          </p>
        </article>

        <article className="rounded-2xl border border-[#f2b0b8] bg-[#fff6f8] p-6 shadow-[0_10px_22px_rgba(24,58,120,0.08)]">
          <h2 className="text-xl font-extrabold text-[#7d2031]">No Financial Advice</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6074a0]">
            We are not SEBI-registered advisors and do not provide investment recommendations.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-6 shadow-[0_10px_22px_rgba(24,58,120,0.1)]">
        <h2 className="text-xl font-extrabold text-[#173462]">Data and Responsibility</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6074a0]">
          Information is sourced from publicly available channels and may have delays or inaccuracies. Please verify independently and consult qualified professionals before taking financial decisions.
        </p>
      </section>
    </main>
  );
}
