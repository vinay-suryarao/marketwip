import Image from "next/image";

type Props = {
  className?: string;
  textClassName?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className = "h-16 w-auto",
  textClassName = "text-2xl",
  priority = false,
}: Props) {
  return (
    <div className="inline-flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="Market W.I.P"
        width={640}
        height={481}
        priority={priority}
        unoptimized
        className={className}
      />

      <span className={`font-display font-extrabold tracking-tight whitespace-nowrap text-white ${textClassName}`}>
        Market W.I.P
      </span>
    </div>
  );
}