import type { CompanyData } from "@/types/analyzer";
import CompanyAbout from "./CompanyAbout";

type Props = { data: CompanyData };

function MetricCard({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null || value === "" || value === "—") return null;
  return (
    <div className="rounded-xl border border-[#d8e2f5] bg-[#f9fbff] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6074a0]">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-[#173462]">{value}</p>
    </div>
  );
}

export default function CompanyHeader({ data, customAbout }: Props & { customAbout?: string | null }) {
  const price = data.currentPrice?.NSE ?? data.currentPrice?.BSE;
  const change = data.percentChange;
  const isPositive = typeof change === "number" && change >= 0;

  const km = data.keyMetrics ?? {};

  let aboutText = customAbout || "";
  if (!aboutText) {
    if (typeof data.companyProfile === "string") {
      aboutText = data.companyProfile;
    } else if (data.companyProfile && typeof data.companyProfile.companyDescription === "string") {
      aboutText = data.companyProfile.companyDescription;
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f3f8ff] p-6 shadow-[0_16px_34px_rgba(24,58,120,0.12)] sm:p-8">
      <div className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-[#9bc2ff]/22 blur-[90px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-[#9de2ff]/20 blur-[90px]" />

      <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1">
        {data.industry ? (
          <p className="mb-2 inline-block rounded-full border border-[#cddcf6] bg-[#ffffff]/85 px-3 py-1 text-xs font-bold tracking-[0.1em] text-[#305ea3]">
            {data.industry}
          </p>
        ) : null}

        <h1 className="bg-linear-to-r from-[#102550] to-[#2d86cc] bg-clip-text font-display text-3xl font-extrabold text-transparent sm:text-5xl">
          {data.companyName || "Company"}
        </h1>

        {price != null ? (
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <span className="text-4xl font-extrabold text-[#173462] sm:text-5xl">
              ₹{typeof price === "number" ? price.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : price}
            </span>
            {change != null ? (
              <span
                className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
                  isPositive
                    ? "bg-[#e3f8ec] text-[#1c9a5f]"
                    : "bg-[#fce8ec] text-[#d92b4a]"
                }`}
              >
                {isPositive ? "+" : ""}
                {typeof change === "number" ? change.toFixed(2) : change}%
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <MetricCard label="Market Cap" value={km["Market Cap"] as string} />
          <MetricCard label="PE Ratio" value={km["P/E"] as string ?? km["Stock P/E"] as string} />
          <MetricCard label="PB Ratio" value={km["P/B"] as string ?? km["Price to Book"] as string} />
          <MetricCard label="Book Value" value={km["Book Value"] as string} />
          <MetricCard label="Dividend Yield" value={km["Dividend Yield"] as string} />
          <MetricCard label="ROE" value={km["ROE"] as string} />
          <MetricCard label="ROCE" value={km["ROCE"] as string} />
          <MetricCard label="Face Value" value={km["Face Value"] as string} />
          <MetricCard label="52W High" value={data.yearHigh != null ? `₹${data.yearHigh.toLocaleString("en-IN")}` : null} />
          <MetricCard label="52W Low" value={data.yearLow != null ? `₹${data.yearLow.toLocaleString("en-IN")}` : null} />
        </div>
        </div>

        {aboutText && (
          <div className="w-full shrink-0 xl:w-[400px]">
            <CompanyAbout text={aboutText} companyName={data.companyName || "Company"} data={data} />
          </div>
        )}
      </div>
    </section>
  );
}
