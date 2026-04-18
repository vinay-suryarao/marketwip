type PromptTone = "error" | "success" | "info";

type PromptToastProps = {
  message: string;
  tone?: PromptTone;
};

const toneClasses: Record<PromptTone, string> = {
  error: "border-[#f2b0b8] bg-[#fff2f4] text-[#7d2031]",
  success: "border-[#9fd9c1] bg-[#eefcf5] text-[#1e6849]",
  info: "border-[#a8d9ff] bg-[#eef7ff] text-[#17497e]",
};

export default function PromptToast({ message, tone = "info" }: PromptToastProps) {
  return (
    <div
      className={`fixed right-4 top-4 z-100 w-[min(92vw,420px)] rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${toneClasses[tone]}`}
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold leading-6">{message}</p>
    </div>
  );
}
