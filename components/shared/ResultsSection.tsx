"use client";

import { useCompanyResults } from "@/hooks/useCompanyResults";
import type { CompanyResultRecord } from "@/types/result";

function headingCellClass() {
  return "border border-[#212121] bg-[#f7f7f7] px-2 py-1 text-left text-sm font-bold text-black";
}

function bodyCellClass() {
  return "border border-[#212121] px-2 py-1 text-sm text-black";
}

function getSignedValueColorClass(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return "text-black";
  }

  const isBracketNegative = normalized.startsWith("(") && normalized.endsWith(")");
  const numeric = Number.parseFloat(normalized.replace(/[^\d+\-.]/g, ""));

  if (!Number.isFinite(numeric)) {
    return "text-black";
  }

  const signedNumeric = isBracketNegative ? -Math.abs(numeric) : numeric;

  if (signedNumeric < 0) {
    return "text-red-600";
  }

  if (signedNumeric > 0) {
    return "text-green-600";
  }

  return "text-black";
}

function renderMetricRow(label: string, row: CompanyResultRecord["sales"]) {
  const trendCellClass = label === "Sales" ? getSignedValueColorClass(row.yoy) : "text-black";
  const momentumCellClass = label === "Sales" ? getSignedValueColorClass(row.qoq) : "text-black";

  return (
    <tr>
      <th className={`${headingCellClass()} w-[130px]`}>{label}</th>
      <td className={`${bodyCellClass()} ${trendCellClass}`}>{row.yoy}</td>
      <td className={`${bodyCellClass()} ${momentumCellClass}`}>{row.qoq}</td>
      <td className={bodyCellClass()}>{row.month1}</td>
      <td className={bodyCellClass()}>{row.month2}</td>
      <td className={bodyCellClass()}>{row.month3}</td>
    </tr>
  );
}

function CompanyResultCard({ company }: { company: CompanyResultRecord }) {
  return (
    <article className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-[0_10px_24px_rgba(24,58,120,0.08)] sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <tbody>
            <tr>
              <th className={`${headingCellClass()} w-[130px]`}>Company</th>
              <td className={`${bodyCellClass()} w-[260px]`}>
                <span className="font-bold">{company.companyName || "--"}</span>
              </td>
              <th className={`${headingCellClass()} w-[120px]`}>M.Cap</th>
              <td className={`${bodyCellClass()} w-[170px]`}>{company.marketCap || "--"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th className={`${headingCellClass()} w-[130px]`} />
              <th className={headingCellClass()}>YOY</th>
              <th className={headingCellClass()}>QOQ</th>
              <th className={headingCellClass()}>{company.monthLabel1 || "Month 1"}</th>
              <th className={headingCellClass()}>{company.monthLabel2 || "Month 2"}</th>
              <th className={headingCellClass()}>{company.monthLabel3 || "Month 3"}</th>
            </tr>
          </thead>
          <tbody>
            {renderMetricRow("Sales", company.sales)}
            {renderMetricRow("Net Profit", company.netProfit)}
            {renderMetricRow("EPS", company.eps)}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-base font-bold text-[#173462]">Audit Points</p>
          {company.auditPoints.length > 0 ? (
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[#173462]">
              {company.auditPoints.map((point, index) => (
                <li key={`${company.id}-audit-${index}`}>{point}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-[#6074a0]">No audit points provided.</p>
          )}
        </div>

        <div>
          <p className="text-base font-bold text-[#173462]">Crux</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[#173462]">{company.crux || "--"}</p>
        </div>
      </div>
    </article>
  );
}

export default function ResultsSection() {
  const { results, isLoading } = useCompanyResults();

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-[#d8e2f5] bg-white p-6 text-sm font-medium text-[#6074a0]">
        Loading company results...
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-white p-4 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#d8e2f5] pb-3">
        <h2 className="text-2xl font-extrabold text-[#173462] sm:text-3xl">Results</h2>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d8e2f5] bg-[#fbfdff] p-8 text-center text-sm font-medium text-[#6074a0]">
          No company result data available yet.
        </div>
      ) : (
        <div className="space-y-5">
          {results.map((company) => (
            <CompanyResultCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </section>
  );
}
