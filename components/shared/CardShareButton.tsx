"use client";

type CardShareButtonProps = {
  url: string;
  title: string;
};

export default function CardShareButton({ url, title }: CardShareButtonProps) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled
      }
    } else {
      // Desktop fallback — open WhatsApp
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <button
      onClick={handleShare}
      title="Share"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d8e2f5] bg-[#f4f8ff] text-[#6074a0] transition-all duration-200 hover:border-[#2e7ac9]/30 hover:bg-[#2e7ac9] hover:text-white hover:shadow-[0_3px_10px_rgba(46,122,201,0.25)] active:scale-[0.9]"
    >
      <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    </button>
  );
}
