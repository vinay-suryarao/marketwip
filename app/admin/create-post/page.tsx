"use client";

import AdminPostForm from "@/components/admin/AdminPostForm";
import AdminGate from "@/components/auth/AdminGate";
import PromptToast from "@/components/ui/PromptToast";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";
import { publishAdminNews } from "@/lib/services/adminPublishing";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  const handleCreatePost = async (formData: FormData) => {
    try {
      clearPrompt();
      const title = formData.get("title") as string;
      const content = formData.get("content") as string;
      const stockTag = formData.get("stockTag") as string;
      const category = formData.get("category") as string;
      const imageUrl = formData.get("imageUrl") as string;

      const result = await publishAdminNews({
        title,
        content,
        stockTag,
        category,
        imageUrl,
      });

      showPrompt(`Post published. Matched users: ${result.targetedUsers}. Emails sent: ${result.emailsSent}.`, "success");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1200);
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to publish post. Please try again."), "error");
    }
  };

  return (
    <AdminGate>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="relative overflow-hidden rounded-2xl border border-[#1A2552] bg-[#0A102E] p-5 shadow-2xl sm:rounded-[2rem] sm:p-8">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-[#00F0FF] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
          
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#1A2552] pb-5 relative z-10">
            <div>
              <h1 className="text-3xl font-extrabold font-display text-white">Create News Post</h1>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-[#8B95A5] max-w-xl">
                Fill all fields, type any stock tag, choose category, and publish. The post appears in the feed instantly.
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="rounded-xl border border-[#1A2552] bg-[#060B19]/50 px-5 py-2.5 text-sm font-bold tracking-wide text-[#8B95A5] transition hover:bg-[#1A2552] hover:text-white"
            >
              Back to Dashboard
            </Link>
          </div>

          <AdminPostForm onSubmit={handleCreatePost} submitButtonText="Publish Post" />
        </div>

        {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}
      </main>
    </AdminGate>
  );
}
