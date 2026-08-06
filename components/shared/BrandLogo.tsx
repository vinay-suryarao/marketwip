import Image from "next/image";

type Props = {
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className = "h-10 w-auto object-contain",
  priority = false,
}: Props) {
  return (
    <div className="inline-flex items-center">
      <Image
        src="/mwiplogo.png"
        alt="Market W.I.P"
        width={800}
        height={200}
        priority={priority}
        unoptimized
        className={className}
      />
    </div>
  );
}