import { useCallback, useEffect, useState } from "react";

type PromptTone = "error" | "success" | "info";

type PromptState = {
  tone: PromptTone;
  message: string;
} | null;

export function useTimedPrompt(durationMs = 4000) {
  const [prompt, setPrompt] = useState<PromptState>(null);

  useEffect(() => {
    if (!prompt) {
      return;
    }

    const timer = setTimeout(() => {
      setPrompt(null);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, prompt]);

  const clearPrompt = useCallback(() => setPrompt(null), []);

  const showPrompt = useCallback((message: string, tone: PromptTone = "info") => {
    setPrompt({ tone, message });
  }, []);

  return { prompt, showPrompt, clearPrompt };
}
