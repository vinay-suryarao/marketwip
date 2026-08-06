"use client";

import { useState, useEffect } from "react";

export default function CompanyAbout({ text, companyName, data }: { text: string; companyName: string; data?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!text) return null;

  // Attempt to split text to simulate "About" and "Key Points" if it's long enough
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const aboutPreview = sentences.slice(0, 2).join(" ").trim();
  const keyPointsPreview = sentences.length > 2 ? sentences.slice(2, 4).join(" ").trim() : "";

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-[#d8e2f5] bg-white/60 p-5 shadow-[0_8px_20px_rgba(20,58,120,0.05)] backdrop-blur-sm sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#173462]">About</p>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#6074a0]">
            {aboutPreview || text}
          </p>
        </div>
        
        {keyPointsPreview && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#173462]">Key Points</p>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6074a0]">
              {keyPointsPreview}
            </p>
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="mt-1 self-start text-xs font-bold uppercase tracking-wider text-[#4f46e5] transition hover:text-[#4338ca] flex items-center gap-1"
        >
          Read More
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth="3">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] px-6 py-4 sm:px-8 sm:py-5">
              <h2 className="text-xl font-extrabold text-[#0f172a] sm:text-2xl">{companyName}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#0f172a]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 space-y-8">
              
              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#173462]">About</h3>
                <p className="text-sm leading-relaxed text-[#475569] sm:text-base whitespace-pre-wrap">
                  {text}
                </p>
              </section>

              {/* Key Metrics Overview removed as requested */}

              {data?.peerCompanyList && data.peerCompanyList.length > 0 && (
                <section>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[#173462]">Peers Comparison</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.peerCompanyList.slice(0, 4).map((peer: any) => (
                      <div key={peer.tickerId} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-3">
                        <div>
                          <p className="text-sm font-bold text-[#0f172a]">{peer.companyName}</p>
                          <p className="text-xs font-semibold text-[#64748b]">₹{peer.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-[#64748b] uppercase">P/E Ratio</p>
                          <p className="text-sm font-semibold text-[#0f172a]">{peer.priceToEarningsValueRatio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}



            </div>
          </div>
        </div>
      )}
    </>
  );
}
