import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={`w-full rounded-xl border border-[#1A2552] bg-[#0A102E] px-4 py-3 text-sm text-white placeholder-white/40 outline-none ring-[#00F0FF]/20 transition focus:border-[#00F0FF] focus:ring-4 ${className}`}
      {...props}
    />
  );
}
