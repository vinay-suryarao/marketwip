import type { CompanyData } from "@/types/analyzer";

type Props = { data?: CompanyData };

/* Extract a flat list of metrics from keyMetrics (which may be grouped or flat) */
function extractFlatMetrics(km: any): Record<string, string | number | null> {
  if (!km || typeof km !== "object") return {};
  const firstValue = Object.values(km)[0];
  if (Array.isArray(firstValue)) {
    const flat: Record<string, string | number | null> = {};
    for (const items of Object.values(km) as any[]) {
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item.displayName) flat[item.displayName] = item.value;
        }
      }
    }
    return flat;
  }
  return km;
}

export default function AboutCompany({ data }: Props) {
  if (!data) return null;

  const companyName = data.companyName || "Unknown Company";
  const reusable = data.stockDetailsReusableData || {};
  const km = extractFlatMetrics(data.keyMetrics);

  const website = reusable.website || "";
  const bseCode = reusable.bseCode || "—";
  const nseCode = reusable.nseCode || data.tickerId || "—";
  const marketCap = km["Market Cap"] || (reusable.marketCap ? `₹${Number(reusable.marketCap).toLocaleString("en-IN")} Cr` : "—");
  const sector = reusable.sector || reusable.macroSector || data.industry || "—";
  const subIndustry = reusable.subIndustry || "—";

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-[#ffffff] p-6 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 border-b border-[#d8e2f5] pb-6 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-extrabold text-[#173462] sm:text-4xl">{companyName}</h1>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#6074a0]">
            {website && (
              <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#2e7ac9]">
                <span>🔗</span> {website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            )}
            {bseCode !== "—" && (
              <span className="flex items-center gap-1">
                <span>📄</span> BSE: {bseCode}
              </span>
            )}
            {nseCode !== "—" && (
              <span className="flex items-center gap-1">
                <span>📄</span> NSE: {nseCode}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <div className="flex justify-between border-b border-[#eef3fb] pb-2">
          <span className="text-sm font-semibold text-[#8599c1]">Market Cap</span>
          <span className="text-sm font-bold text-[#173462]">{marketCap}</span>
        </div>
        <div className="flex justify-between border-b border-[#eef3fb] pb-2">
          <span className="text-sm font-semibold text-[#8599c1]">Sector</span>
          <span className="text-sm font-bold text-[#173462]">{sector}</span>
        </div>
        <div className="flex justify-between border-b border-[#eef3fb] pb-2">
          <span className="text-sm font-semibold text-[#8599c1]">Sub Industry</span>
          <span className="text-sm font-bold text-[#173462]">{subIndustry}</span>
        </div>

        {km["EPS (TTM)"] && (
          <div className="flex justify-between rounded-md bg-[#f9fbff] px-2 py-2">
            <span className="text-sm font-semibold text-[#8599c1]">EPS (TTM)</span>
            <span className="text-sm font-bold text-[#173462]">{km["EPS (TTM)"]}</span>
          </div>
        )}
        {km["EBITDA"] && (
          <div className="flex justify-between rounded-md bg-[#f9fbff] px-2 py-2">
            <span className="text-sm font-semibold text-[#8599c1]">EBITDA</span>
            <span className="text-sm font-bold text-[#173462]">{km["EBITDA"]}</span>
          </div>
        )}
        {km["Dividend Payout"] && (
          <div className="flex justify-between rounded-md bg-[#f9fbff] px-2 py-2">
            <span className="text-sm font-semibold text-[#8599c1]">Dividend Payout</span>
            <span className="text-sm font-bold text-[#173462]">{km["Dividend Payout"]}</span>
          </div>
        )}

        {km["Sales Per Share"] && (
          <div className="flex justify-between border-b border-[#eef3fb] pb-2">
            <span className="text-sm font-semibold text-[#8599c1]">Sales Per Share</span>
            <span className="text-sm font-bold text-[#173462]">{km["Sales Per Share"]}</span>
          </div>
        )}
        {km["Operating Profit"] && (
          <div className="flex justify-between border-b border-[#eef3fb] pb-2">
            <span className="text-sm font-semibold text-[#8599c1]">Operating Profit</span>
            <span className="text-sm font-bold text-[#173462]">{km["Operating Profit"]}</span>
          </div>
        )}
        {km["Face Value"] && (
          <div className="flex justify-between border-b border-[#eef3fb] pb-2">
            <span className="text-sm font-semibold text-[#8599c1]">Face Value</span>
            <span className="text-sm font-bold text-[#173462]">{km["Face Value"]}</span>
          </div>
        )}
      </div>
    </section>
  );
}
