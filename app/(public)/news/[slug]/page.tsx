import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "@/lib/services/postService";
import { formatDate } from "@/lib/helpers/dateFormat";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailsPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link href="/news" className="mb-6 inline-flex items-center text-[15px] font-bold text-[#8B95A5] transition hover:text-white group">
        <svg className="mr-2 h-4 w-4 transform transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Market News
      </Link>
      <article className="rounded-2xl border border-[#1A2552] bg-[#0A102E] p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 -mt-32 -ml-32 w-64 h-64 bg-[#C100FF] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#00F0FF]">
            {post.stockTag}
          </p>
          <p className="text-xs text-[#8B95A5] font-medium">{formatDate(post.createdAt)}</p>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold font-display text-white relative z-10">{post.title}</h1>

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

        <p className="mt-6 whitespace-pre-wrap text-[17px] leading-relaxed text-[#8B95A5] font-medium relative z-10">
          {post.content}
        </p>
      </article>
    </main>
  );
}
