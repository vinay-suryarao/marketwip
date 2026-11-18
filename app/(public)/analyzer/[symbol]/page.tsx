import Link from "next/link";
import { fetchStockData } from "@/lib/services/analyzerService";
import { getCustomCompanyAbout } from "@/lib/services/companyAboutService";
import { getCustomCompanySummary } from "@/lib/services/companySummaryService";
import type { CompanyData } from "@/types/analyzer";
import CompanyHeader from "@/components/analyzer/CompanyHeader";
import PriceChart from "@/components/analyzer/PriceChart";
import KeyRatios from "@/components/analyzer/KeyRatios";
import PeerComparison from "@/components/analyzer/PeerComparison";
import QuarterlyResults from "@/components/analyzer/QuarterlyResults";
import ProfitLoss from "@/components/analyzer/ProfitLoss";
import BalanceSheet from "@/components/analyzer/BalanceSheet";
import CashFlow from "@/components/analyzer/CashFlow";
import RevenueBySegment from "@/components/analyzer/RevenueBySegment";
import ShareholdingPattern from "@/components/analyzer/ShareholdingPattern";
import Documents from "@/components/analyzer/Documents";
import CompanySummary from "@/components/analyzer/CompanySummary";

type PageProps = {
  params: Promise<{ symbol: string }>;
};

export const dynamic = "force-dynamic";

export default async function CompanyPage({ params }: PageProps) {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol);

  let data: CompanyData | null = null;
  let error: string | null = null;
  let customAbout: string | null = null;
  let customSummary: string | null = null;

  try {
    data = await fetchStockData(decodedSymbol);

    // Fetch custom "About" override - try multiple keys due to variations (e.g. "HDFCBANK" vs "HDFC Bank")
    if (data) {
      customAbout = await getCustomCompanyAbout(decodedSymbol);

      if (!customAbout && data.companyName) {
        customAbout = await getCustomCompanyAbout(data.companyName);
      }

      if (!customAbout && data.tickerId) {
        customAbout = await getCustomCompanyAbout(data.tickerId);
      }

      customSummary = await getCustomCompanySummary(decodedSymbol);
      if (!customSummary && data.companyName) {
        customSummary = await getCustomCompanySummary(data.companyName);
      }
      if (!customSummary && data.tickerId) {
        customSummary = await getCustomCompanySummary(data.tickerId);
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load company data";
  }

  if (error || !data) {
    return (
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center sm:px-6 md:px-8">
        <div className="rounded-2xl border border-[#fce3e3] bg-[#fff8f8] p-8">
          <p className="text-lg font-bold text-[#d92b4a]">Unable to load data</p>
          <p className="mt-2 text-sm text-[#6074a0]">{error || "No data available for this company."}</p>
          <Link
            href="/analyzer"
            className="mt-4 inline-block rounded-lg border border-[#cddcf6] bg-white px-5 py-2.5 text-sm font-bold text-[#2e7ac9] transition hover:bg-[#f1f7ff]"
          >
            &larr; Back to Search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 overflow-hidden px-4 py-8 sm:px-6 md:px-8 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-semibold text-[#8599c1]">
        <Link href="/analyzer" className="transition hover:text-[#2e7ac9]">
          Market Analyzer
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#173462]">{data.companyName || decodedSymbol}</span>
      </nav>

      {/* 1. Company Header */}
      <CompanyHeader data={data} customAbout={customAbout} />

      {/* 2. Interactive Price Chart */}
      <PriceChart
        symbol={decodedSymbol}
        companyName={data.companyName}
        nseCode={data.stockDetailsReusableData?.nseCode || data.tickerId || (data.companyProfile as any)?.exchangeCodeNse}
        bseCode={data.stockDetailsReusableData?.bseCode || (data.companyProfile as any)?.exchangeCodeBse}
      />

      {/* 3. Key Ratios (wapas leke aaya same format me) */}
      <KeyRatios metrics={data.keyMetrics} />

      {/* 4. Peer Comparison (ratios ke niche) */}
      <PeerComparison
        peers={data.peerCompanyList}
        currentSymbol={decodedSymbol}
        sector={data.industry || (data.stockDetailsReusableData?.sector)}
      />

      {/* 5. Quarterly Results */}
      <QuarterlyResults rows={data.quarterlyResults} standaloneRows={data.quarterlyResultsStandalone} />

      {/* 6. Profit & Loss */}
      <ProfitLoss rows={data.profitLoss} standaloneRows={data.profitLossStandalone} />

      {/* 7. Balance Sheet & Corporate Actions */}
      <BalanceSheet
        rows={data.balanceSheet}
        standaloneRows={data.balanceSheetStandalone}
        actions={data.stockCorporateActionData}
      />

      {/* 8. Shareholding Pattern */}
      <ShareholdingPattern shareholding={data.shareholding} />

      {/* 9. Cash Flow */}
      <CashFlow rows={data.cashFlow} standaloneRows={data.cashFlowStandalone} />

      {/* 10. Revenue by Segment (cash flow ke bad) */}
      <RevenueBySegment data={data.segmentRevenue} />

      {/* 11. Documents */}
      <Documents documents={data.documents} />

      {/* 12. Custom Company Summary */}
      <CompanySummary summary={customSummary} />
    </main>
  );
}
