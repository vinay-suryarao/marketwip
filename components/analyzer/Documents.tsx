"use client";

import { useState } from "react";

type Props = {
  documents?: any;
};

export default function Documents({ documents }: Props) {
  const [announcementTab, setAnnouncementTab] = useState<"Recent" | "Important" | "Search" | "All">("Recent");
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [showAllReports, setShowAllReports] = useState(false);
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [showAllConcalls, setShowAllConcalls] = useState(false);

  // Parse data from API — supports multiple response shapes
  const announcements: any[] = (() => {
    if (!documents) return [];
    const src = documents.announcements || documents.data?.announcements || [];
    return Array.isArray(src) ? src : [];
  })();

  const annualReports: any[] = (() => {
    if (!documents) return [];
    const src = documents.annualReports || documents.annual_reports || documents.data?.annualReports || documents.data?.annual_reports || [];
    return Array.isArray(src) ? src : [];
  })();

  const creditRatings: any[] = (() => {
    if (!documents) return [];
    const src = documents.creditRatings || documents.credit_ratings || documents.data?.creditRatings || documents.data?.credit_ratings || [];
    return Array.isArray(src) ? src : [];
  })();

  const concalls: any[] = (() => {
    if (!documents) return [];
    const src = documents.concalls || documents.data?.concalls || documents.transcripts || documents.data?.transcripts || [];
    return Array.isArray(src) ? src : [];
  })();

  const hasAnyData = announcements.length > 0 || annualReports.length > 0 || creditRatings.length > 0 || concalls.length > 0;

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_12px_28px_rgba(24,58,120,0.08)] sm:p-8">
      <div className="mb-6 border-b border-[#d8e2f5] pb-4">
        <h2 className="text-2xl font-extrabold text-[#173462] sm:text-3xl">Documents</h2>
      </div>

      {hasAnyData ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Card 1: Announcements */}
          <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h3 className="text-base font-bold text-[#1e293b]">Announcements</h3>

            {/* Sub-tabs */}
            <div className="mt-3 flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-1 text-xs">
              {(["Recent", "Important", "Search", "All"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setAnnouncementTab(tab)}
                  className={`flex-1 rounded-md py-1 font-semibold transition ${
                    announcementTab === tab
                      ? "bg-white text-[#4f46e5] shadow-xs"
                      : "text-[#64748b] hover:text-[#1e293b]"
                  }`}
                >
                  {tab === "All" ? "All ↗" : tab}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="mt-4 flex-1 space-y-4">
              {announcements.length > 0 ? (
                (showAllAnnouncements ? announcements : announcements.slice(0, 2)).map((a: any, idx: number) => (
                  <div key={idx} className="group">
                    <a
                      href={a.link || a.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#4f46e5] group-hover:underline leading-snug line-clamp-2"
                    >
                      {a.title || a.headline || a.subject || "Announcement"}
                    </a>
                    <p className="mt-1 text-xs text-[#64748b] line-clamp-2">
                      {a.date ? `${a.date} - ` : ""}
                      {a.desc || a.description || a.details || a.summary || ""}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#94a3b8]">No announcements available</p>
              )}
            </div>

            {announcements.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllAnnouncements(!showAllAnnouncements)}
                className="mt-4 flex w-full items-center justify-center pt-2 text-[#94a3b8] hover:text-[#4f46e5]"
              >
                <svg
                  className={`h-4 w-4 transform transition-transform ${showAllAnnouncements ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Card 2: Annual Reports */}
          <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h3 className="text-base font-bold text-[#1e293b]">Annual reports</h3>

            <div className="mt-4 flex-1 space-y-3.5">
              {annualReports.length > 0 ? (
                (showAllReports ? annualReports : annualReports.slice(0, 4)).map((r: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <a
                        href={r.link || r.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-[#4f46e5] hover:underline"
                      >
                        {r.title || `Annual Report ${r.year || r.period || ""}`}
                      </a>
                      <p className="text-[11px] text-[#94a3b8]">{r.source || r.exchange || ""}</p>
                    </div>
                    {(r.hasAiSummary || r.ai_summary) && (
                      <span className="rounded-md border border-[#818cf8] px-2 py-0.5 text-[10px] font-semibold text-[#4f46e5]">
                        AI Summary
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#94a3b8]">No annual reports available</p>
              )}
            </div>

            {annualReports.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllReports(!showAllReports)}
                className="mt-4 flex w-full items-center justify-center pt-2 text-[#94a3b8] hover:text-[#4f46e5]"
              >
                <svg
                  className={`h-4 w-4 transform transition-transform ${showAllReports ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Card 3: Credit Ratings */}
          <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h3 className="text-base font-bold text-[#1e293b]">Credit ratings</h3>

            <div className="mt-4 flex-1 space-y-3.5">
              {creditRatings.length > 0 ? (
                (showAllRatings ? creditRatings : creditRatings.slice(0, 4)).map((cr: any, idx: number) => (
                  <div key={idx}>
                    <a
                      href={cr.link || cr.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#4f46e5] hover:underline"
                    >
                      {cr.title || cr.rating || "Rating update"}
                    </a>
                    <p className="text-[11px] text-[#94a3b8]">{cr.desc || cr.details || cr.agency || ""}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#94a3b8]">No credit ratings available</p>
              )}
            </div>

            {creditRatings.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllRatings(!showAllRatings)}
                className="mt-4 flex w-full items-center justify-center pt-2 text-[#94a3b8] hover:text-[#4f46e5]"
              >
                <svg
                  className={`h-4 w-4 transform transition-transform ${showAllRatings ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Card 4: Concalls */}
          <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e293b]">Concalls</h3>
              <span className="text-[11px] font-semibold text-[#64748b] flex items-center gap-1">
                <span>🚩</span> Add Missing
              </span>
            </div>

            <div className="mt-4 flex-1 space-y-3">
              {concalls.length > 0 ? (
                (showAllConcalls ? concalls : concalls.slice(0, 5)).map((c: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-1 text-xs">
                    <span className="w-16 font-semibold text-[#334155]">{c.period || c.date || c.quarter || ""}</span>
                    <div className="flex items-center gap-1">
                      {(c.transcript || c.transcript_url) && (
                        <a
                          href={c.transcript_url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-[#c7d2fe] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#4f46e5] hover:bg-[#eef2ff]"
                        >
                          Transcript
                        </a>
                      )}
                      {(c.aiSummary || c.ai_summary || c.summary_url) && (
                        <a
                          href={c.summary_url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-[#c7d2fe] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#4f46e5] hover:bg-[#eef2ff]"
                        >
                          AI Summary
                        </a>
                      )}
                      {(c.ppt || c.ppt_url) && (
                        <a
                          href={c.ppt_url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-[#c7d2fe] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#4f46e5] hover:bg-[#eef2ff]"
                        >
                          PPT
                        </a>
                      )}
                      {(c.rec || c.rec_url) && (
                        <a
                          href={c.rec_url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-[#c7d2fe] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#4f46e5] hover:bg-[#eef2ff]"
                        >
                          REC
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#94a3b8]">No concalls available</p>
              )}
            </div>

            {concalls.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllConcalls(!showAllConcalls)}
                className="mt-4 flex w-full items-center justify-center pt-2 text-[#94a3b8] hover:text-[#4f46e5]"
              >
                <svg
                  className={`h-4 w-4 transform transition-transform ${showAllConcalls ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Empty state — shown when API returns no data (free plan) */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Announcements card */}
          <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h3 className="text-base font-bold text-[#1e293b]">Announcements</h3>
            <div className="mt-3 flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-1 text-xs">
              {["Recent", "Important", "Search", "All ↗"].map((tab) => (
                <span key={tab} className="flex-1 rounded-md py-1 text-center font-semibold text-[#94a3b8]">{tab}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-1 items-center justify-center">
              <p className="text-xs text-[#94a3b8]">Available with paid plan</p>
            </div>
          </div>

          {/* Annual Reports card */}
          <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h3 className="text-base font-bold text-[#1e293b]">Annual reports</h3>
            <div className="mt-6 flex flex-1 items-center justify-center">
              <p className="text-xs text-[#94a3b8]">Available with paid plan</p>
            </div>
          </div>

          {/* Credit Ratings card */}
          <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h3 className="text-base font-bold text-[#1e293b]">Credit ratings</h3>
            <div className="mt-6 flex flex-1 items-center justify-center">
              <p className="text-xs text-[#94a3b8]">Available with paid plan</p>
            </div>
          </div>

          {/* Concalls card */}
          <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e293b]">Concalls</h3>
              <span className="text-[11px] font-semibold text-[#94a3b8] flex items-center gap-1">
                <span>🚩</span> Add Missing
              </span>
            </div>
            <div className="mt-6 flex flex-1 items-center justify-center">
              <p className="text-xs text-[#94a3b8]">Available with paid plan</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
