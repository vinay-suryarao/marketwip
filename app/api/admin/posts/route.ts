import { NextResponse } from "next/server";
import { createPost } from "@/lib/services/postService";
import { notifyUsersByTag } from "@/lib/services/notificationService";
import { NEWS_CATEGORIES } from "@/constants/newsCategories";
import type { CreatePostInput, NewsPost } from "@/types/post";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePostInput;

    if (!body.title || !body.content || !body.stockTag) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const safeCategory =
      NEWS_CATEGORIES.find((item) => item.value === body.category)?.value ?? NEWS_CATEGORIES[0].value;

    const created = await createPost({
      title: body.title,
      content: body.content,
      stockTag: body.stockTag.toUpperCase(),
      imageUrl: body.imageUrl ?? "",
      category: safeCategory,
    });

    const postForNotify: NewsPost = {
      id: created.id,
      title: body.title,
      content: body.content,
      stockTag: body.stockTag.toUpperCase(),
      imageUrl: body.imageUrl ?? "",
      slug: created.slug,
      category: safeCategory,
      createdAt: new Date().toISOString(),
    };

    const notifications = await notifyUsersByTag(postForNotify);

    return NextResponse.json({
      message: "Post created",
      postId: created.id,
      notifications,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to create post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
