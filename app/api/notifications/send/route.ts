import { NextResponse } from "next/server";
import { notifyUsersByTag } from "@/lib/services/notificationService";
import type { NewsPost } from "@/types/post";

export async function POST(request: Request) {
  try {
    const post = (await request.json()) as NewsPost;

    if (!post?.stockTag || !post?.id || !post?.title) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const result = await notifyUsersByTag(post);
    return NextResponse.json({ message: "In-app notifications processed", result });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Notification dispatch failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
