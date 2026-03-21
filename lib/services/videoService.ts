import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { CreateVideoInput } from "@/types/video";

function getVideosCollection() {
  return collection(getDb(), "videos");
}

function isYouTubeUrl(value: string) {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    return host.includes("youtube.com") || host.includes("youtu.be");
  } catch {
    return false;
  }
}

export async function createVideo(input: CreateVideoInput) {
  const tag = input.tag.trim().toUpperCase();
  const youtubeUrl = input.youtubeUrl.trim();

  if (!tag) {
    throw new Error("Video tag is required.");
  }

  if (!isYouTubeUrl(youtubeUrl)) {
    throw new Error("Please provide a valid YouTube URL.");
  }

  const created = await addDoc(getVideosCollection(), {
    tag,
    youtubeUrl,
    createdAt: new Date().toISOString(),
  });

  return { id: created.id };
}

export async function deleteVideo(videoId: string) {
  await deleteDoc(doc(getDb(), "videos", videoId));
}

export async function updateVideo(videoId: string, input: CreateVideoInput) {
  const tag = input.tag.trim().toUpperCase();
  const youtubeUrl = input.youtubeUrl.trim();

  if (!tag) {
    throw new Error("Video tag is required.");
  }

  if (!isYouTubeUrl(youtubeUrl)) {
    throw new Error("Please provide a valid YouTube URL.");
  }

  await updateDoc(doc(getDb(), "videos", videoId), {
    tag,
    youtubeUrl,
  });
}
