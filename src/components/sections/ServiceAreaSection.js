import { Reveal } from "@/components/animations/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { siteConfig } from "@/lib/site-config";

export function ServiceAreaSection() {
  const [hub, ...surrounding] = siteConfig.serviceAreas;
  const isOddCount = surrounding.length % 2 === 1;

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>Where We Work</SectionLabel>
        <StaggerText
          text="Proudly serving Calgary and area."
          className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
        />
        <p className="mt-5 max-w-xl text-muted-foreground">
          From downtown Calgary to the surrounding towns, our crews are on
          the road daily, with no travel surcharges or scheduling gaps
          for jobs outside the core.
        </p>

        <Reveal className="mt-12 sm:mt-16">
          <div className="rounded-3xl border border-border bg-surface-elevated p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between rounded-2xl bg-foreground px-6 py-5">
              <span className="font-display text-xl uppercase tracking-tight text-background sm:text-2xl">
                {hub}
              </span>
              <span className="rounded-full bg-background/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
                HQ
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {surrounding.map((area, index) => {
                const isLast = isOddCount && index === surrounding.length - 1;
                return (
                  <div
                    key={area}
                    className={`flex items-center justify-center rounded-2xl border border-border py-4 text-sm font-medium sm:text-base ${
                      isLast ? "col-span-2" : ""
                    }`}
                  >
                    {area}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
