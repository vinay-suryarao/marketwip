import React from "react";

type Props = { summary: string | null };

export default function CompanySummary({ summary }: Props) {
  if (!summary) return null;

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-[#ffffff] p-6 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-8">
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#2e7ac9]">
          Insights
        </span>
        <h2 className="mt-1 text-2xl font-extrabold text-[#173462] sm:text-3xl">
          Company Summary
        </h2>
      </div>
      <div className="prose prose-sm max-w-none text-[#173462] leading-relaxed">
        {summary.split("\n").map((paragraph, index) => (
          <p key={index} className={index > 0 ? "mt-4" : ""}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
