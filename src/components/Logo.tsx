import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 64, className = "" }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Omnisearch Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
