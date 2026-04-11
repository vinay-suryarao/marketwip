"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden pb-20 font-sans selection:bg-[#4353FF]/50 selection:text-white sm:pb-32">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute left-[-35%] top-[-5%] z-0 h-[420px] w-[420px] animate-pulse-slow rounded-full bg-[#1A56FF] opacity-40 mix-blend-screen blur-[140px] sm:left-[0%] sm:top-[-10%] sm:h-[800px] sm:w-[800px] sm:blur-[180px]"></div>
      <div className="pointer-events-none absolute right-[-35%] top-[20%] z-0 h-[380px] w-[380px] animate-pulse-slow rounded-full bg-[#C100FF] opacity-30 mix-blend-screen blur-[140px] sm:right-[-10%] sm:h-[700px] sm:w-[700px] sm:blur-[180px]" style={{ animationDelay: "2s" }}></div>

      {/* Header with Back Button */}
      <section className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[#00F0FF] hover:text-white transition-colors mb-8 font-bold">
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        <div className="text-center">
          <h1 className="mb-4 bg-gradient-to-r from-[#00F0FF] to-[#8B22FF] bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#8B95A5] font-medium">
            Your privacy and trust matter to us
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 mx-auto w-full max-w-[1000px] px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-7">
        {/* Educational Purpose */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">📚</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Educational Purpose Only
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium">
                The content provided on this website is <span className="text-[#00F0FF] font-bold">strictly for educational and informational purposes only.</span> We aim to help you understand market concepts and news, but this should not be treated as professional financial advice.
              </p>
            </div>
          </div>
        </div>

        {/* Not Financial Advisors */}
        <div className="rounded-2xl border border-[#FF5B79]/30 bg-[#FF5B79]/5 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">⚠️</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                We Are Not SEBI Registered Advisors
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium">
                Market W.I.P is <span className="text-[#FF5B79] font-bold">not a SEBI (Securities and Exchange Board of India) registered advisor.</span> We do not provide investment or financial advice, recommendations, or guidance. Any trading or investment decisions you make are <span className="text-[#F3A623] font-bold">entirely at your own risk.</span>
              </p>
            </div>
          </div>
        </div>

        {/* No Investment Advice */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">📊</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                No Investment Recommendations
              </h2>
              <div className="space-y-3">
                <p className="text-base text-[#8B95A5] leading-relaxed font-medium">
                  We do <span className="text-[#FF5B79] font-bold">NOT</span> provide:
                </p>
                <ul className="space-y-2">
                  {[
                    "Buy or sell recommendations",
                    "Investment portfolio advice",
                    "Trading signals or entry/exit points",
                    "Financial planning guidance",
                    "Risk assessment or analysis",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#8B95A5]">
                      <span className="text-[#FF5B79] font-bold mt-1">✗</span>
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Risk & Responsibility */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">💼</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Your Risk & Our Responsibility
              </h2>
              <div className="space-y-3 text-base text-[#8B95A5] leading-relaxed font-medium">
                <p>
                  <span className="text-[#F3A623] font-bold">We are NOT responsible</span> for any profit or loss arising from the use of our content. Any investment or trading losses incurred based on information from this website are <span className="text-[#FF5B79] font-bold">your responsibility alone.</span>
                </p>
                <p className="pt-2">
                  Always consult with a <span className="text-[#34E0A1] font-bold">qualified financial professional</span> before making any investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">🔍</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Data Collection & Processing
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium mb-4">
                This is a <span className="text-[#4353FF] font-bold">blog-based website</span> where we:
              </p>
              <ul className="space-y-2">
                {[
                  "Collect data and news from various publicly available internet sources",
                  "Summarize and interpret this information in our own way",
                  "Present market updates in a simplified format",
                  "Add our analysis and perspective",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#8B95A5]">
                    <span className="text-[#00F0FF] font-bold mt-1">✓</span>
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Accuracy Disclaimer */}
        <div className="rounded-2xl border border-[#F3A623]/30 bg-[#F3A623]/5 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">⏱️</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Errors, Delays & Inaccuracies
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium mb-3">
                Please be aware that:
              </p>
              <div className="space-y-2">
                {[
                  "There may be errors in the content",
                  "Information may be delayed",
                  "Inaccuracies may occur during summarization",
                  "We do NOT guarantee completeness or reliability of any information",
                  "Data sources may have limitations or delays",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[#8B95A5]">
                    <span className="text-[#F3A623] font-bold mt-1">•</span>
                    <span className="text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaway */}
        <div className="rounded-2xl border border-[#4353FF]/50 bg-gradient-to-b from-[#1A56FF]/20 to-[#0A102E] p-5 sm:p-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">✨</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Key Takeaway
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium">
                Market W.I.P is a <span className="text-[#4353FF] font-bold">learning platform</span> designed to help you understand market news and financial concepts in a simplified way. However, <span className="text-[#FF5B79] font-bold">always do your own research</span> and consult with <span className="text-[#34E0A1] font-bold">qualified financial professionals</span> before making any investment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-5 sm:p-6 text-center shadow-2xl">
          <p className="text-[#8B95A5] mb-6 font-medium">
            You're all set!
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-[#4353FF] px-8 py-3 text-center font-bold text-white shadow-[0_0_30px_rgba(67,83,255,0.5)] transition hover:scale-105 hover:bg-[#5C6EFF]"
          >
            🏠 Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
