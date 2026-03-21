"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createVideo, deleteVideo, updateVideo } from "@/lib/services/videoService";
import { useVideos } from "@/hooks/useVideos";
import AdminVideoForm from "@/components/admin/AdminVideoForm";
import PromptToast from "@/components/ui/PromptToast";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";

export default function AdminVideosPage() {
  const { videos, isLoading } = useVideos();
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  const editingVideo = useMemo(
    () => videos.find((video) => video.id === editingVideoId) ?? null,
    [editingVideoId, videos],
  );

  const handleCreate = async (payload: { tag: string; youtubeUrl: string }) => {
    clearPrompt();
    try {
      if (editingVideoId) {
        await updateVideo(editingVideoId, payload);
        setEditingVideoId(null);
        showPrompt("Video updated successfully.", "success");
        return;
      }
      await createVideo(payload);
      showPrompt("Video added successfully.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Unable to save video. Please try again."), "error");
    }
  };

  const handleEditStart = (videoId: string) => {
    setEditingVideoId(videoId);
  };

  const handleCancelEdit = () => {
    setEditingVideoId(null);
  };

  const handleDelete = async (videoId: string, tag: string) => {
    const ok = window.confirm(`Delete video tag "${tag}"?`);
    if (!ok) {
      return;
    }
    clearPrompt();
    try {
      await deleteVideo(videoId);
      showPrompt("Video deleted successfully.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Unable to delete video. Please try again."), "error");
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10 md:px-8">
      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

      <section className="rounded-[2rem] border border-[#1A2552] bg-[#0A102E] p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#00F0FF] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#1A2552] pb-5 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00F0FF]">Video Publishing</h1>
            <p className="mt-2 text-[15px] font-medium text-[#8B95A5] max-w-xl">
              Add YouTube links with tags. Users will see the tag and a watch button only.
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="rounded-xl border border-[#1A2552] bg-[#060B19]/50 px-5 py-2.5 text-sm font-bold tracking-wide text-[#8B95A5] transition hover:bg-[#1A2552] hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>

        <AdminVideoForm
          onSubmit={handleCreate}
          initialData={editingVideo}
          submitLabel={editingVideo ? "Update Video" : "Add Video"}
          onCancelEdit={handleCancelEdit}
        />
      </section>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#1A2552] bg-[#0A102E] shadow-2xl relative">
        <div className="border-b border-[#1A2552] bg-[#060B19]/50 px-7 py-5">
          <h2 className="text-xl font-bold font-display text-white">Manage Videos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#0A102E]">
            <thead className="bg-[#060B19]/50 backdrop-blur-md border-b border-[#1A2552]">
              <tr>
                <th className="px-7 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-[#8B95A5]">Tag</th>
                <th className="px-7 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-[#8B95A5]">Date</th>
                <th className="px-7 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-[#8B95A5]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-[15px]">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center font-medium text-[#8B95A5]">
                    Loading videos...
                  </td>
                </tr>
              ) : videos.length > 0 ? (
                videos.map((video) => (
                  <tr key={video.id} className="border-b border-[#1A2552] transition hover:bg-[#1A2552]/40">
                    <td className="px-7 py-5 font-bold tracking-wide text-[#00F0FF]">{video.tag}</td>
                    <td className="px-7 py-5 text-[#8B95A5]">{new Date(video.createdAt).toLocaleDateString()}</td>
                    <td className="px-7 py-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleEditStart(video.id)}
                        className="mr-3 rounded-lg border border-[#1A2552] bg-[#060B19] px-4 py-2 text-xs font-bold text-[#00F0FF] transition hover:bg-[#1A2552]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(video.id, video.tag)}
                        className="rounded-lg bg-[#FF5B79]/10 border border-[#FF5B79]/50 px-4 py-2 text-xs font-bold text-[#FF5B79] transition hover:bg-[#FF5B79] hover:text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-10 text-center font-medium text-[#8B95A5]">
                    No videos posted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
