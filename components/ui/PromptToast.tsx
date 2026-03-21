type PromptTone = "error" | "success" | "info";

type PromptToastProps = {
  message: string;
  tone?: PromptTone;
};

const toneClasses: Record<PromptTone, string> = {
  error: "border-[#FF5B79]/50 bg-[#3A1021]/90 text-[#FFD3DD]",
  success: "border-[#34E0A1]/50 bg-[#0E3329]/90 text-[#C7FFE9]",
  info: "border-[#00F0FF]/40 bg-[#0C2840]/90 text-[#C7F8FF]",
};

export default function PromptToast({ message, tone = "info" }: PromptToastProps) {
  return (
    <div
      className={`fixed right-4 top-4 z-[100] w-[min(92vw,420px)] rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${toneClasses[tone]}`}
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold leading-6">{message}</p>
    </div>
  );
}
