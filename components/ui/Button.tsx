import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", ...props }: Props) {
  return (
    <button
      className={`rounded-lg border border-[#f1c75f] bg-[#e9b742] px-6 py-3 text-sm font-bold text-[#13204a] shadow-[0_12px_24px_rgba(0,0,0,0.25)] transition-all hover:bg-[#f1c75f] hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 ${className}`}
      {...props}
    />
  );
}
