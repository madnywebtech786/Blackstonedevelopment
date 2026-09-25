import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ProjectCard({ project, className = "", style }) {
  return (
    <Link
      href="/projects"
      className={`group relative block h-[65vh] min-h-100 overflow-hidden rounded-lg sm:h-[75vh] sm:min-h-125 ${className}`}
      style={style}
    >
      <Image
        src={project.afterImage}
        alt={project.title}
        fill
        sizes="(min-width: 640px) 420px, 72vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            {project.city}
          </p>
          <h3 className="mt-2 font-display text-xl uppercase tracking-tight text-white sm:text-3xl">
            {project.title}
          </h3>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-foreground sm:h-11 sm:w-11">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}
