"use client";

import { useVideos } from "@/hooks/useVideos";

export default function VideosPage() {
  const { videos, isLoading } = useVideos();

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-2xl border border-[#1A2552] bg-[#0A102E] p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] sm:rounded-3xl sm:p-7">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#00F0FF] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <h1 className="relative z-10 bg-gradient-to-r from-white to-[#00F0FF] bg-clip-text text-3xl font-extrabold font-display text-transparent sm:text-4xl">Market Video Signals</h1>
        <p className="relative z-10 mt-2 text-sm font-medium text-[#8B95A5] sm:text-base">
          Follow latest video tags shared by admin and open the corresponding YouTube video instantly.
        </p>
      </section>

      {isLoading ? (
        <section className="rounded-2xl border border-[#1A2552] bg-[#060B19]/50 p-6 text-sm text-[#8B95A5] font-medium">
          Loading videos...
        </section>
      ) : videos.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#1A2552] bg-[#060B19]/50 p-8 text-center text-sm text-[#8B95A5] font-medium">
          No videos available yet.
        </section>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article key={video.id} className="group relative overflow-hidden rounded-2xl border border-[#1A2552] bg-[#0A102E] p-4 shadow-lg sm:p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#00F0FF] relative z-10">Video Tag</p>
              <h2 className="relative z-10 mt-2 text-lg font-bold font-display text-white sm:text-xl">{video.tag}</h2>
              <p className="mt-2 text-xs text-[#8B95A5] font-medium relative z-10">Posted: {new Date(video.createdAt).toLocaleDateString()}</p>

              <a
                href={video.youtubeUrl}
                target="_self"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-xl bg-[#4353FF] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(67,83,255,0.4)] transition hover:bg-[#5C6EFF] hover:scale-105 active:scale-95 border border-[#4353FF] relative z-10"
              >
                Watch on YouTube
              </a>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
