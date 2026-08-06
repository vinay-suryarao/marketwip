import Link from "next/link";
import { fetchStockData } from "@/lib/services/analyzerService";
import { getCustomCompanyAbout } from "@/lib/services/companyAboutService";
import { getCustomCompanySummary } from "@/lib/services/companySummaryService";
import type { CompanyData } from "@/types/analyzer";
import CompanyHeader from "@/components/analyzer/CompanyHeader";
import PriceChart from "@/components/analyzer/PriceChart";
import AboutCompany from "@/components/analyzer/AboutCompany";
import KeyRatios from "@/components/analyzer/KeyRatios";
import PeerComparison from "@/components/analyzer/PeerComparison";
import QuarterlyResults from "@/components/analyzer/QuarterlyResults";
import ProfitLoss from "@/components/analyzer/ProfitLoss";
import BalanceSheet from "@/components/analyzer/BalanceSheet";
import CashFlow from "@/components/analyzer/CashFlow";
import ShareholdingPattern from "@/components/analyzer/ShareholdingPattern";
import CorporateActions from "@/components/analyzer/CorporateActions";
import LatestNews from "@/components/analyzer/LatestNews";
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
        nseCode={(data.companyProfile as any)?.exchangeCodeNse}
        bseCode={(data.companyProfile as any)?.exchangeCodeBse}
      />

      {/* 3. About Company (Hero Section) */}
      <AboutCompany data={data} />

      {/* 4. Key Ratios */}
      <KeyRatios metrics={data.keyMetrics} />

      {/* 5. Peer Comparison */}
      <PeerComparison peers={data.peerCompanyList} />

      {/* 6. Quarterly Results */}
      <QuarterlyResults rows={data.quarterlyResults} />

      {/* 7. Profit & Loss */}
      <ProfitLoss rows={data.profitLoss} />

      {/* 8. Balance Sheet & Corporate Actions */}
      <div className="relative">
        <BalanceSheet rows={data.balanceSheet} />
        <div className="absolute right-8 top-6 sm:top-8">
          <CorporateActions actions={data.stockCorporateActionData} />
        </div>
      </div>

      {/* 9. Cash Flow */}
      <CashFlow rows={data.cashFlow} />

      {/* 10. Shareholding Pattern */}
      <ShareholdingPattern shareholding={data.shareholding} />

      {/* 11. Custom Company Summary */}
      <CompanySummary summary={customSummary} />
    </main>
  );
}
