import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

const SIZE_CLASSES = {
  sm: "h-9 sm:h-10",
  md: "h-11 sm:h-12",
  lg: "h-14 sm:h-16",
};

export function Logo({ size = "md", className = "", ...props }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${className}`}
      {...props}
    >
      <Image
        src="/images/logo.png"
        alt={siteConfig.name}
        width={740}
        height={337}
        priority
        className={`w-auto object-contain ${SIZE_CLASSES[size]}`}
      />
    </Link>
  );
}
