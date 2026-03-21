import Link from "next/link";
import Image from "next/image";
import type { NewsPost } from "@/types/post";
import { formatDate } from "@/lib/helpers/dateFormat";
import Card from "@/components/ui/Card";
import { getCategoryLabel } from "@/constants/newsCategories";

type Props = {
  post: NewsPost;
};

export default function NewsCard({ post }: Props) {
  return (
    <Card>
      {post.imageUrl ? (
        <div className="mb-4 overflow-hidden rounded-xl">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1200}
            height={720}
            unoptimized
            className="h-44 w-full object-cover transition duration-300 hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="rounded-full bg-[#1A2552] border border-[#1A2552] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#00F0FF]">
          {post.stockTag}
        </p>
        <p className="rounded-full bg-[#1A2552] border border-[#1A2552] px-3 py-1 text-[11px] font-bold text-[#34E0A1]">
          {getCategoryLabel(post.category)}
        </p>
      </div>

      <h3 className="mt-4 text-[22px] font-extrabold font-display leading-[1.3] text-white transition-colors group-hover:text-[#00F0FF]">{post.title}</h3>
      <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-[#8B95A5] font-medium">{post.content}</p>

      <div className="mt-6 flex items-center justify-between text-xs text-[#8B95A5] font-medium border-t border-[#1A2552] pt-4">
        <span>{formatDate(post.createdAt)}</span>
        <Link href={`/news/${post.slug}`} className="font-bold text-[#4353FF] transition hover:text-[#00F0FF]">
          Read more →
        </Link>
      </div>
    </Card>
  );
}
