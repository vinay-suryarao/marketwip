"use client";

import { FormEvent, useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PromptToast from "@/components/ui/PromptToast";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";
import type { MarketVideo } from "@/types/video";

type Props = {
  onSubmit: (payload: { tag: string; youtubeUrl: string }) => Promise<void>;
  initialData?: MarketVideo | null;
  submitLabel?: string;
  onCancelEdit?: () => void;
};

export default function AdminVideoForm({
  onSubmit,
  initialData = null,
  submitLabel = "Add Video",
  onCancelEdit,
}: Props) {
  const [tag, setTag] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag);
      setYoutubeUrl(initialData.youtubeUrl);
      return;
    }
    setTag("");
    setYoutubeUrl("");
  }, [initialData]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearPrompt();
    setIsSubmitting(true);

    try {
      await onSubmit({
        tag,
        youtubeUrl,
      });
      if (!initialData) {
        setTag("");
        setYoutubeUrl("");
      }
    } catch (nextError) {
      showPrompt(toFriendlyAppErrorMessage(nextError, "Unable to save video. Please try again."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] border border-[#1A2552] bg-[#060B19]/50 p-6 md:grid-cols-[1fr_1.3fr_auto] md:items-end shadow-xl backdrop-blur-md">
      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#00F0FF]">Video Tag</label>
        <Input
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          placeholder="Example: RELIANCE Q4"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#00F0FF]">YouTube Link</label>
        <Input
          value={youtubeUrl}
          onChange={(event) => setYoutubeUrl(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting} className="h-[48px] px-6">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {initialData && onCancelEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="h-[48px] rounded-xl border border-[#1A2552] bg-[#0A102E] px-6 text-sm font-bold text-[#8B95A5] transition hover:bg-[#1A2552] hover:text-white"
          >
            Cancel
          </button>
        ) : null}
      </div>

      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}
    </form>
  );
}
