import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={`w-full rounded-lg border border-[#cfdbf3] bg-white px-4 py-3 text-sm text-[#16305f] placeholder-[#8599c1] outline-none ring-[#71d6ff]/20 transition focus:border-[#71d6ff] focus:ring-4 ${className}`}
      {...props}
    />
  );
}
