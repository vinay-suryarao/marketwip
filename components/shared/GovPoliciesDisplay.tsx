"use client";

import { useGovPolicies } from "@/hooks/useGovPolicies";

export default function GovPoliciesDisplay() {
  const { policies, isLoading } = useGovPolicies();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#d8e2f5] bg-white p-6 text-sm font-medium text-[#6074a0]">
        Loading government policies...
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8e2f5] bg-white p-8 text-center text-sm font-medium text-[#6074a0]">
        Government policies will appear here once admin publishes data.
      </div>
    );
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center rounded-full border border-[#cddcf6] bg-[#f0f6ff] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#2e7ac9]">
          Policy Watch
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-[#132746] sm:text-4xl">
          Government Policies
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-medium text-[#6074a0]">
          Latest Government of India policy announcements, tagged by ministry and sector — sourced from PIB.
        </p>
      </div>

      {/* Policy Cards */}
      <div className="space-y-4">
        {policies.map((policy) => (
          <article
            key={policy.id}
            className="group relative rounded-2xl border border-[#d8e2f5] bg-white p-5 shadow-[0_4px_16px_rgba(24,58,120,0.06)] transition hover:border-[#c0d2f0] hover:shadow-[0_8px_24px_rgba(24,58,120,0.1)] sm:p-6"
          >
            {/* Top row: department + date */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#2e7ac9]">
                {policy.department}
              </p>
              <p className="text-[12px] font-medium text-[#6074a0] whitespace-nowrap">
                {policy.dateOfPost}
              </p>
            </div>

            {/* Headline */}
            <h3 className="text-base font-bold leading-snug text-[#132746] sm:text-lg">
              {policy.headline}
            </h3>

            {/* Description */}
            <p className="mt-2 text-[13px] leading-relaxed text-[#6074a0]">
              {policy.description}
            </p>

            {/* Sector tag */}
            {policy.sector ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="inline-block rounded-full border border-[#c5d7f5] bg-[#eef4ff] px-3 py-1 text-[11px] font-semibold text-[#2e5fa3]">
                  {policy.sector}
                </span>
              </div>
            ) : null}

            {/* PIB Reference */}
            {policy.pibReference ? (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[12px] font-medium text-[#6074a0] italic">
                  {policy.pibReference}
                </p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
