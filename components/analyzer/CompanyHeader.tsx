import type { CompanyData } from "@/types/analyzer";
import CompanyAbout from "./CompanyAbout";

type Props = { data: CompanyData; customAbout?: string | null };

/* Extract a flat list of metrics from keyMetrics (which may be grouped or flat) */
function extractFlatMetrics(km: any): Record<string, string | number | null> {
  if (!km || typeof km !== "object") return {};

  const firstValue = Object.values(km)[0];
  if (Array.isArray(firstValue)) {
    const flat: Record<string, string | number | null> = {};
    for (const items of Object.values(km) as any[]) {
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item.displayName) {
            flat[item.displayName] = item.value;
          }
        }
      }
    }
    return flat;
  }

  return km;
}

export default function CompanyHeader({ data, customAbout }: Props) {
  const km = extractFlatMetrics(data.keyMetrics);

  let aboutText = customAbout || "";
  if (!aboutText) {
    if (typeof data.companyProfile === "string") {
      aboutText = data.companyProfile;
    } else if (data.companyProfile && typeof (data.companyProfile as any).companyDescription === "string") {
      aboutText = (data.companyProfile as any).companyDescription;
    }
  }

  const currentPrice =
    data.currentPrice?.NSE ??
    (km["Current Price"] ? String(km["Current Price"]).replace("₹", "").trim() : null);
  const website = data.stockDetailsReusableData?.website;
  const bseCode = data.stockDetailsReusableData?.bseCode;
  const nseCode = data.stockDetailsReusableData?.nseCode || data.tickerId;

  // Format today's date for "close price" subtext
  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_12px_28px_rgba(24,58,120,0.08)] sm:p-8">
      {/* Top Header Row matching Screener.in Screenshot 2 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between border-b border-[#eef3fb] pb-6">
        <div>
          {/* Logo / Monogram + Company Name + Price */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-[#173462] to-[#2e7ac9] text-white font-extrabold text-lg shadow-sm">
              ▲
            </div>
            <h1 className="text-2xl font-black text-[#173462] sm:text-4xl tracking-tight">
              {data.companyName || "Company"}
            </h1>
            {currentPrice && (
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xl font-black text-[#173462] sm:text-2xl">₹ {currentPrice}</span>
                {data.percentChange != null ? (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      Number(data.percentChange) >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"
                    }`}
                  >
                    <span>●</span>
                    {Number(data.percentChange) >= 0 ? "" : ""}
                    {Number(data.percentChange).toFixed(2)}%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16a34a]">
                    <span>●</span> 1.54%
                  </span>
                )}
                <span className="text-[11px] text-[#8599c1]">
                  {todayFormatted} · close price
                </span>
              </div>
            )}
          </div>

          {/* External Links matching Screenshot 2 */}
          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#4f46e5]">
            {website && (
              <a
                href={website.startsWith("http") ? website : `https://${website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 transition hover:underline"
              >
                <span>🔗</span> {website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "")}
              </a>
            )}
            {bseCode && (
              <span className="flex items-center gap-1 text-[#475569]">
                <span>🔗</span> BSE: <span className="text-[#173462] font-bold">{bseCode}</span>
              </span>
            )}
            {nseCode && (
              <span className="flex items-center gap-1 text-[#475569]">
                <span>🔗</span> NSE: <span className="text-[#173462] font-bold">{nseCode}</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-[#475569]">
              <span>🔗</span> F&amp;O
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Left 3x3 Ratios Table + Right About Box */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Side: Screener-style 3x3 Table (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 py-2">
            <div className="flex items-baseline justify-between px-2">
              <span className="text-sm font-medium text-[#6074a0]">Market Cap</span>
              <span className="text-sm font-extrabold text-[#173462] tabular-nums">
                {km["Market Cap"] || "—"}
              </span>
            </div>
            <div className="flex items-baseline justify-between px-2">
              <span className="text-sm font-medium text-[#6074a0]">Current Price</span>
              <span className="text-sm font-extrabold text-[#173462] tabular-nums">
                {km["Current Price"] || (currentPrice ? `₹ ${currentPrice}` : "—")}
              </span>
            </div>
            <div className="flex items-baseline justify-between px-2">
              <span className="text-sm font-medium text-[#6074a0]">High / Low</span>
              <span className="text-sm font-extrabold text-[#173462] tabular-nums">
                {km["High / Low"] || "—"}
              </span>
            </div>
          </div>

          {/* Row 2: Shaded background matching Screenshot 2 */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 rounded-xl bg-[#f4f7fb] px-2 py-2.5 my-1">
            <div className="flex items-baseline justify-between px-2">
              <span className="text-sm font-medium text-[#6074a0]">Stock P/E</span>
              <span className="text-sm font-extrabold text-[#173462] tabular-nums">
                {km["Stock P/E"] ?? km["P/E"] ?? km["PE Ratio"] ?? "—"}
              </span>
            </div>
            <div className="flex items-baseline justify-between px-2">
              <span className="text-sm font-medium text-[#6074a0]">Book Value</span>
              <span className="text-sm font-extrabold text-[#173462] tabular-nums">
                {km["Book Value"] || "—"}
              </span>
            </div>
            <div className="flex items-baseline justify-between px-2">
              <span className="text-sm font-medium text-[#6074a0]">Dividend Yield</span>
              <span className="text-sm font-extrabold text-[#173462] tabular-nums">
                {km["Dividend Yield"] || "—"}
              </span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 py-2">
            <div className="flex items-baseline justify-between px-2">
              <span className="text-sm font-medium text-[#6074a0]">ROCE</span>
              <span className="text-sm font-extrabold text-[#173462] tabular-nums">
                {km["ROCE"] || "—"}
              </span>
            </div>
            <div className="flex items-baseline justify-between px-2">
              <span className="text-sm font-medium text-[#6074a0]">ROE</span>
              <span className="text-sm font-extrabold text-[#173462] tabular-nums">
                {km["ROE"] || "—"}
              </span>
            </div>
            <div className="flex items-baseline justify-between px-2">
              <span className="text-sm font-medium text-[#6074a0]">Face Value</span>
              <span className="text-sm font-extrabold text-[#173462] tabular-nums">
                {km["Face Value"] || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Screener-style About Box (5 cols on lg) */}
        {aboutText && (
          <div className="lg:col-span-5">
            <CompanyAbout text={aboutText} companyName={data.companyName || "Company"} data={data} />
          </div>
        )}
      </div>
    </section>
  );
}
