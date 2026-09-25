import Link from "next/link";

const VARIANT_CLASSES = {
  primary:
    "bg-primary text-primary-foreground hover:bg-foreground/90 border border-primary",
  outline:
    "bg-transparent text-foreground border border-border hover:border-foreground",
  light:
    "bg-white text-foreground border border-white hover:bg-white/90",
  "outline-light":
    "bg-transparent text-white border border-white/30 hover:border-white",
};

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
