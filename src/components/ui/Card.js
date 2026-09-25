export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface-elevated ${className}`}
    >
      {children}
    </div>
  );
}
