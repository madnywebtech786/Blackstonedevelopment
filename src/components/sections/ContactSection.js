import { Reveal } from "@/components/animations/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactForm } from "@/components/shared/ContactForm";
import { siteConfig } from "@/lib/site-config";

export function ContactSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-14 sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 300px at 15% 0%, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent 60%), radial-gradient(600px 300px at 85% 100%, rgba(255,255,255,0.06), transparent 60%)",
              }}
            />

            <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
              <div className="lg:col-span-2">
                <SectionLabel className="text-white/55">Let&apos;s Talk</SectionLabel>
                <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
                  Ready to get started?
                </h2>
                <p className="mt-5 max-w-sm text-white/70">
                  Tell us about your project and we&apos;ll get back to you
                  within one business day.
                </p>

                <div className="mt-10 space-y-5 border-t border-white/10 pt-8 text-sm">
                  <div>
                    <SectionLabel className="text-white/40">Phone</SectionLabel>
                    <a
                      href={siteConfig.phoneHref}
                      className="mt-1 block font-display text-lg tracking-tight text-white hover:text-accent"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                  <div>
                    <SectionLabel className="text-white/40">Email</SectionLabel>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="mt-1 block text-white hover:text-accent"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                  <div>
                    <SectionLabel className="text-white/40">Service Areas</SectionLabel>
                    <p className="mt-1 text-white/70">
                      {siteConfig.serviceAreas.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <ContactForm />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
