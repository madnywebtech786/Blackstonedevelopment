import Link from "next/link";

const SIZE_CLASSES = {
  sm: "text-sm sm:text-base",
  md: "text-base sm:text-lg",
  lg: "text-xl sm:text-2xl",
};

export function Logo({ size = "md", light = false, className = "", ...props }) {
  const dim = light ? "text-white/55" : "text-muted-foreground/70";
  const rule = light ? "bg-white/40" : "bg-accent";

  return (
    <Link
      href="/"
      className={`group inline-flex flex-col leading-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${className}`}
      {...props}
    >
      <span
        className={`font-display uppercase tracking-tight whitespace-nowrap ${SIZE_CLASSES[size]}`}
      >
        Black Stone
      </span>
      <span className="mt-1.5 flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-px w-3 shrink-0 transition-all duration-300 group-hover:w-6 ${rule}`}
        />
        <span
          className={`text-[0.55em] font-medium tracking-[0.15em] uppercase whitespace-nowrap ${dim}`}
        >
          Basement Development
        </span>
      </span>
    </Link>
  );
}
