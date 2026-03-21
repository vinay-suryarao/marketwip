import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", ...props }: Props) {
  return (
    <button
      className={`rounded-xl bg-[#4353FF] px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(67,83,255,0.4)] transition-all hover:bg-[#5C6EFF] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 ${className}`}
      {...props}
    />
  );
}
