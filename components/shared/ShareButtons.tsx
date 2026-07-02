"use client";

import { useState } from "react";

type ShareButtonsProps = {
  url: string;
  title: string;
  description?: string;
};

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const text = description ? `${title}\n\n${description}` : title;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled or share failed silently
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied
    }
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareInstagram = async () => {
    // Instagram has no direct web share URL — copy link so user can paste in DM/Story
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="flex flex-col gap-3">
      {/* Native share — full width, prominent on mobile */}
      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          id="share-native-btn"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#2e7ac9]/20 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-5 py-3 text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:brightness-110 active:scale-[0.97]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share This News
        </button>
      )}

      {/* Individual platform buttons */}
      <div className="flex items-center gap-2">
        {/* WhatsApp */}
        <button
          onClick={shareWhatsApp}
          id="share-whatsapp-btn"
          title="Share on WhatsApp"
          className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#25d366]/20 bg-[#25d366]/10 transition-all duration-200 hover:bg-[#25d366] hover:shadow-[0_4px_12px_rgba(37,211,102,0.3)] active:scale-[0.93]"
        >
          <svg className="h-[18px] w-[18px] text-[#25d366] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={shareFacebook}
          id="share-facebook-btn"
          title="Share on Facebook"
          className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#1877f2]/20 bg-[#1877f2]/10 transition-all duration-200 hover:bg-[#1877f2] hover:shadow-[0_4px_12px_rgba(24,119,242,0.3)] active:scale-[0.93]"
        >
          <svg className="h-[18px] w-[18px] text-[#1877f2] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* Twitter / X */}
        <button
          onClick={shareTwitter}
          id="share-twitter-btn"
          title="Share on X (Twitter)"
          className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#14171a]/15 bg-[#14171a]/8 transition-all duration-200 hover:bg-[#14171a] hover:shadow-[0_4px_12px_rgba(20,23,26,0.25)] active:scale-[0.93]"
        >
          <svg className="h-[16px] w-[16px] text-[#14171a] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Instagram */}
        <button
          onClick={shareInstagram}
          id="share-instagram-btn"
          title={copied ? "Link copied! Paste on Instagram" : "Share on Instagram"}
          className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#E1306C]/20 bg-[#E1306C]/10 transition-all duration-200 hover:bg-gradient-to-br hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:shadow-[0_4px_12px_rgba(225,48,108,0.3)] active:scale-[0.93]"
        >
          <svg className="h-[18px] w-[18px] text-[#E1306C] transition-colors group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          id="share-copy-link-btn"
          title={copied ? "Copied!" : "Copy link"}
          className={`group flex h-10 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-bold transition-all duration-200 active:scale-[0.93] ${
            copied
              ? "border-emerald-400/40 bg-emerald-50 text-emerald-600"
              : "border-[#d8e2f5] bg-[#f4f8ff] text-[#6074a0] hover:border-[#b6c8ef] hover:bg-[#e8efff] hover:text-[#173462]"
          }`}
        >
          {copied ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
