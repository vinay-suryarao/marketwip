import type { NewsItem } from "@/types/analyzer";

type Props = { news?: NewsItem[] };

export default function LatestNews({ news }: Props) {
  if (!news || news.length === 0) return null;

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f8fbff] p-6 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-8">
      <div className="mb-4 border-b border-[#d8e2f5] pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f77a5]">Recent Updates</p>
        <h2 className="mt-1 text-xl font-extrabold text-[#173462] sm:text-2xl">Latest News</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {news.slice(0, 8).map((item, idx) => (
          <a
            key={idx}
            href={item.url || item.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 rounded-2xl border border-[#e3ecf8] bg-[#f9fbff] p-4 transition hover:-translate-y-0.5 hover:border-[#c7d8f7] hover:shadow-[0_8px_20px_rgba(20,58,120,0.08)]"
          >
            {item.thumbnailImage || item.listimage || item.thumbnail ? (
              <img
                src={item.thumbnailImage || item.listimage || item.thumbnail}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
                loading="lazy"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#eef3ff] text-lg font-bold text-[#2e7ac9]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2">
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <path d="M8 8h8M8 12h8M8 16h6" />
                </svg>
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-bold leading-snug text-[#173462] group-hover:text-[#2e7ac9]">
                {item.headline || item.title || "Untitled"}
              </p>
              {item.lastPublishedDate || item.date || item.source ? (
                <p className="mt-1.5 text-xs font-semibold text-[#8599c1]">
                  {item.source ? <span>{item.source}</span> : null}
                  {item.source && (item.lastPublishedDate || item.date) ? <span> · </span> : null}
                  {item.lastPublishedDate || item.date ? <span>{new Date((item.lastPublishedDate || item.date) as string).toLocaleDateString()}</span> : null}
                </p>
              ) : null}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
