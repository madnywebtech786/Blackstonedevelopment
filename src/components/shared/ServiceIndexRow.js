import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function ServiceIndexRow({ service, index }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex items-center justify-between gap-5 border-b border-border py-5 sm:py-6"
    >
      <div className="flex min-w-0 items-baseline gap-4 sm:gap-6">
        <span className="w-7 shrink-0 font-display text-sm font-medium text-muted-foreground/70 transition-colors duration-300 group-hover:text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="truncate font-display text-2xl font-semibold uppercase tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-2.5 sm:text-3xl lg:text-4xl">
          {service.title}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <span className="hidden max-w-56 text-right text-sm text-muted-foreground sm:block">
          {service.summary}
        </span>
        <ArrowUpRight
          size={22}
          className="shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>

      <div className="pointer-events-none absolute right-64 top-1/2 hidden h-24 w-36 -translate-y-1/2 scale-90 overflow-hidden rounded-sm opacity-0 shadow-xl transition-all duration-400 ease-out group-hover:scale-100 group-hover:opacity-100 lg:block">
        <Image
          src={service.heroImage}
          alt=""
          fill
          sizes="144px"
          className="object-cover"
        />
      </div>
    </Link>
  );
}
