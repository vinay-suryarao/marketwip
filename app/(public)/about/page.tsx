"use client";

import React from "react";

export default function AboutPage() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden pb-20 font-sans selection:bg-[#4353FF]/50 selection:text-white sm:pb-32">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute left-[-35%] top-[-5%] z-0 h-[420px] w-[420px] animate-pulse-slow rounded-full bg-[#1A56FF] opacity-40 mix-blend-screen blur-[140px] sm:left-[0%] sm:top-[-10%] sm:h-[800px] sm:w-[800px] sm:blur-[180px]"></div>
      <div className="pointer-events-none absolute right-[-35%] top-[20%] z-0 h-[380px] w-[380px] animate-pulse-slow rounded-full bg-[#C100FF] opacity-30 mix-blend-screen blur-[140px] sm:right-[-10%] sm:h-[700px] sm:w-[700px] sm:blur-[180px]" style={{ animationDelay: "2s" }}></div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
        <div className="text-center mb-10">
          <h1 className="mb-3 bg-gradient-to-r from-[#00F0FF] to-[#8B22FF] bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            About Market W.I.P
          </h1>
          <p className="mx-auto max-w-2xl text-base text-[#8B95A5] font-medium sm:text-lg">
            Simplifying complex financial information for everyday investors
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 mx-auto w-full max-w-[1000px] px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-7">
        {/* What is Market W.I.P */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-3xl sm:text-4xl">📱</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                What is Market W.I.P?
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium">
                Market W.I.P is a stock market-focused blog platform created with the aim of simplifying complex financial information and making it easy to understand for everyday investors. In today's fast-moving market, where there is an overload of news and opinions, our goal is to <span className="text-[#00F0FF] font-bold">filter out the noise</span> and present only the most relevant and useful updates in a clear and concise manner.
              </p>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-3xl sm:text-4xl">🎯</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Our Structured Approach
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium mb-4">
                We specifically focus on <span className="text-[#34E0A1] font-bold">category-wise news tracking</span> so that users can quickly identify what type of update a company has announced.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "📋 Work Orders",
                  "🏆 Order Wins",
                  "🏗️ Capacity Additions",
                  "📈 Expansions",
                  "💼 M&A Activities",
                  "📝 MoUs",
                  "✅ Government Approvals",
                  "⚖️ Regulatory Updates",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[#8B95A5] text-sm sm:text-base">
                    <div className="w-2 h-2 bg-[#4353FF] rounded-full"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Coverage */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-3xl sm:text-4xl">📰</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                What We Cover
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium mb-4">
                We cover daily market news, company-specific updates, financial results analysis, and important announcements, all presented in a <span className="text-[#00F0FF] font-bold">simplified format</span>. Instead of lengthy reports, we provide <span className="text-[#34E0A1] font-bold">short, clear summaries</span> that highlight what actually matters for investors and traders.
              </p>
            </div>
          </div>
        </div>

        {/* Data Source */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-3xl sm:text-4xl">🔍</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Our Research Process
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium">
                Our content is created by collecting information from <span className="text-[#F3A623] font-bold">publicly available sources</span> across the internet and then summarizing and interpreting it in an easy-to-read format. While we strive to provide accurate and timely information, there may be chances of errors, omissions, or delays due to the nature of sourced data.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl border border-[#FF5B79]/30 bg-[#FF5B79]/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl">⚠️</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Important Disclaimer
              </h2>
              <div className="space-y-3 text-base text-[#8B95A5] leading-relaxed font-medium">
                <p>
                  <span className="text-[#FF5B79] font-bold">Market W.I.P is NOT a SEBI-registered advisor.</span> All content available on this platform is strictly for <span className="text-[#F3A623] font-bold">educational and informational purposes only.</span>
                </p>
                <p>
                  We do not provide any buy or sell recommendations, and any investment or trading decisions taken by users are entirely at their own risk. We are not responsible for any financial losses arising from the use of our content.
                </p>
                <p>
                  Users are always advised to <span className="text-[#00F0FF] font-bold">do their own research</span> and consult qualified financial professionals before making any investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Vision */}
        <div className="rounded-2xl border border-[#1A2552] bg-[#0A102E]/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-3xl sm:text-4xl">🚀</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Continuously Evolving
              </h2>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium mb-4">
                As the name suggests, <span className="text-[#4353FF] font-bold">Market W.I.P is continuously evolving.</span> We are constantly working on improving our content quality, adding better features, and enhancing user experience to make this platform more valuable for our users.
              </p>
              <p className="text-base text-[#8B95A5] leading-relaxed font-medium">
                Market W.I.P is built for individuals who want <span className="text-[#00F0FF] font-bold">clear, structured, and practical market insights</span> without unnecessary complexity.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-[#4353FF]/50 bg-gradient-to-b from-[#1A56FF]/20 to-[#0A102E] p-6 sm:p-8 text-center shadow-2xl">
          <h3 className="text-2xl font-extrabold text-white mb-3">Ready to Get Started?</h3>
          <p className="text-[#8B95A5] mb-6 font-medium">
            Explore structured market news and stay informed with daily insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/news"
              className="inline-block rounded-full bg-[#4353FF] px-8 py-3 text-center font-bold text-white shadow-[0_0_30px_rgba(67,83,255,0.5)] transition hover:scale-105 hover:bg-[#5C6EFF]"
            >
              📰 Explore News
            </a>
            <a
              href="/"
              className="inline-block rounded-full border border-white/20 bg-transparent px-8 py-3 text-center font-bold text-white shadow-xl transition hover:border-white/40 hover:bg-white/5"
            >
              🏠 Back to Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
