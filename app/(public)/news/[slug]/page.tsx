import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "@/lib/services/postService";
import { formatDate } from "@/lib/helpers/dateFormat";
import ShareButtons from "@/components/shared/ShareButtons";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | Market W.I.P" };
  }

  const description = post.content.length > 160
    ? post.content.slice(0, 157) + "..."
    : post.content;

  return {
    title: `${post.title} | Market W.I.P`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.createdAt,
      ...(post.imageUrl
        ? {
            images: [
              {
                url: post.imageUrl,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: post.imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description,
      ...(post.imageUrl ? { images: [post.imageUrl] } : {}),
    },
  };
}

export default async function NewsDetailsPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://marketwip.com"}/news/${post.slug}`;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link href="/news" className="group mb-6 inline-flex items-center text-[15px] font-bold text-[#6074a0] transition hover:text-[#173462]">
        <svg className="mr-2 h-4 w-4 transform transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Market News
      </Link>
      <article className="relative overflow-hidden rounded-2xl border border-[#d8e2f5] bg-white p-7 shadow-[0_12px_28px_rgba(24,58,120,0.1)]">
        <div className="pointer-events-none absolute -ml-32 -mt-32 left-0 top-0 h-64 w-64 rounded-full bg-[#9de2ff]/20 blur-[120px]"></div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2e7ac9]">
            {post.stockTag}
          </p>
          <p className="text-xs text-[#6074a0] font-medium">{formatDate(post.createdAt)}</p>
        </div>
        <h1 className="relative z-10 mt-3 text-3xl font-extrabold font-display text-[#173462]">{post.title}</h1>

        {post.imageUrl ? (
          <div className="mt-4 overflow-hidden rounded-xl">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={1400}
              height={900}
              unoptimized
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <p className="relative z-10 mt-6 whitespace-pre-wrap text-[17px] font-medium leading-relaxed text-[#6074a0]">
          {post.content}
        </p>

        {/* Share Section */}
        <div className="relative z-10 mt-8 border-t border-[#d8e2f5] pt-5">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-widest text-[#6074a0]">
            Share this news
          </p>
          <ShareButtons
            url={postUrl}
            title={post.title}
            description={post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content}
          />
        </div>
      </article>
    </main>
  );
}
