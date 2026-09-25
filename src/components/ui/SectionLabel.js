export function SectionLabel({ children, className = "" }) {
  return (
    <p
      className={`text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground ${className}`}
    >
      {children}
    </p>
  );
}
