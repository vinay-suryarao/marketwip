import type { CompanyData } from "@/types/analyzer";

type Props = { data?: CompanyData };

export default function AboutCompany({ data }: Props) {
  if (!data) return null;

  // Extract necessary fields
  const companyName = data.companyName || "Unknown Company";
  const price = data.currentPrice?.NSE || data.currentPrice?.BSE || data.stockDetailsReusableData?.price || "—";
  const change = data.percentChange || data.stockDetailsReusableData?.percentChange || "0";
  const isPositive = parseFloat(change) >= 0;

  const bseCode = (data.companyProfile as any)?.exchangeCodeBse || "—";
  const nseCode = (data.companyProfile as any)?.exchangeCodeNse || "—";
  const website = (data.companyProfile as any)?.website || "";

  // Grid Stats
  const marketCap = data.stockDetailsReusableData?.marketCap || "—";
  const high = data.stockDetailsReusableData?.yhigh || data.stockDetailsReusableData?.high || "—";
  const low = data.stockDetailsReusableData?.ylow || data.stockDetailsReusableData?.low || "—";
  const pe = data.stockDetailsReusableData?.pPerEBasicExcludingExtraordinaryItemsTTM || data.stockDetailsReusableData?.priceToEarningsValueRatio || "—";
  const divYield = data.stockDetailsReusableData?.currentDividendYieldCommonStockPrimaryIssueLTM || data.stockDetailsReusableData?.dividendYieldIndicatedAnnualDividend || "0.00";
  const roe = data.stockDetailsReusableData?.returnOnAverageEquityTrailing12Month || "—";
  
  // Extract from keyMetrics
  let bookValue = "—";
  let faceValue = "—";
  let roce = "—";
  
  if (data.keyMetrics && typeof data.keyMetrics === "object" && !Array.isArray(data.keyMetrics) && "value" in data.keyMetrics) {
    const metrics = (data.keyMetrics as any).value;
    const perShare = metrics.persharedata || [];
    bookValue = perShare.find((m: any) => m.key?.toLowerCase().includes("bookvalue"))?.value || "—";
    faceValue = perShare.find((m: any) => m.key?.toLowerCase().includes("facevalue") || m.key?.toLowerCase().includes("parvalue"))?.value || "—";
    const mgmt = metrics.mgmtEffectiveness || [];
    roce = mgmt.find((m: any) => m.key?.toLowerCase().includes("returnoninvestment") || m.key?.toLowerCase().includes("roce"))?.value || "—";
  }

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-[#ffffff] p-6 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 border-b border-[#d8e2f5] pb-6 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-extrabold text-[#173462] sm:text-4xl">{companyName}</h1>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#3d5178]">₹{price}</span>
              <span className={`text-sm font-bold ${isPositive ? "text-[#06AA5A]" : "text-[#FF0000]"}`}>
                {isPositive ? "▲" : "▼"} {Math.abs(parseFloat(change))}%
              </span>
            </div>
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
          <span className="text-sm font-bold text-[#173462]">₹ {marketCap} Cr.</span>
        </div>
        <div className="flex justify-between border-b border-[#eef3fb] pb-2">
          <span className="text-sm font-semibold text-[#8599c1]">Current Price</span>
          <span className="text-sm font-bold text-[#173462]">₹ {price}</span>
        </div>
        <div className="flex justify-between border-b border-[#eef3fb] pb-2">
          <span className="text-sm font-semibold text-[#8599c1]">High / Low</span>
          <span className="text-sm font-bold text-[#173462]">₹ {high} / {low}</span>
        </div>
        
        <div className="flex justify-between rounded-md bg-[#f9fbff] px-2 py-2">
          <span className="text-sm font-semibold text-[#8599c1]">Stock P/E</span>
          <span className="text-sm font-bold text-[#173462]">{pe}</span>
        </div>
        <div className="flex justify-between rounded-md bg-[#f9fbff] px-2 py-2">
          <span className="text-sm font-semibold text-[#8599c1]">Book Value</span>
          <span className="text-sm font-bold text-[#173462]">₹ {bookValue}</span>
        </div>
        <div className="flex justify-between rounded-md bg-[#f9fbff] px-2 py-2">
          <span className="text-sm font-semibold text-[#8599c1]">Dividend Yield</span>
          <span className="text-sm font-bold text-[#173462]">{divYield} %</span>
        </div>

        <div className="flex justify-between border-b border-[#eef3fb] pb-2">
          <span className="text-sm font-semibold text-[#8599c1]">ROCE</span>
          <span className="text-sm font-bold text-[#173462]">{roce} %</span>
        </div>
        <div className="flex justify-between border-b border-[#eef3fb] pb-2">
          <span className="text-sm font-semibold text-[#8599c1]">ROE</span>
          <span className="text-sm font-bold text-[#173462]">{roe} %</span>
        </div>
        <div className="flex justify-between border-b border-[#eef3fb] pb-2">
          <span className="text-sm font-semibold text-[#8599c1]">Face Value</span>
          <span className="text-sm font-bold text-[#173462]">₹ {faceValue}</span>
        </div>
      </div>
    </section>
  );
}
