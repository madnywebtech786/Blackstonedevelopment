import { Reveal } from "@/components/animations/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { siteConfig } from "@/lib/site-config";

const STATS = [
  { key: "yearsInBusiness", suffix: "+", label: "Years in Business" },
  { key: "projectsCompleted", suffix: "+", label: "Projects Completed" },
  { key: "satisfactionPercent", suffix: "%", label: "Client Satisfaction" },
];

export function TrustStats() {
  return (
    <section className="border-y border-border bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat, index) => (
            <Reveal key={stat.key} delay={index * 0.1} className="py-6 text-left sm:px-8 sm:py-0 sm:first:pl-0">
              <p className="font-display text-5xl uppercase tracking-tight">
                <AnimatedCounter value={siteConfig.stats[stat.key]} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
