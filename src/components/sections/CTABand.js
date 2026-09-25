import { Reveal } from "@/components/animations/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export function CTABand() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-center sm:px-12 sm:py-20">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 300px at 15% 0%, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent 60%), radial-gradient(600px 300px at 85% 100%, rgba(255,255,255,0.06), transparent 60%)",
              }}
            />

            <div className="relative mx-auto max-w-2xl">
              <SectionLabel className="text-white/55">Let&apos;s Talk</SectionLabel>
              <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-5 max-w-md text-white/70">
                Tell us about your project and we&apos;ll get back to you within one business day.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Button href="/contact" variant="light">
                  Get a Quote
                </Button>
                <Button href={siteConfig.phoneHref} variant="outline-light">
                  Call {siteConfig.phone}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
