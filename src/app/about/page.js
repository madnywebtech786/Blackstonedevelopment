import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { CTABand } from "@/components/sections/CTABand";
import { siteConfig } from "@/lib/site-config";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "About",
  description:
    "Learn about Black Stone Basement Development Ltd, a Calgary basement renovation company with 5+ years experience in basement development, kitchen remodeling, carpet cleaning, drywall, roofing, and siding.",
  alternates: {
    canonical: "/about",
  },
};

const VALUES = [
  {
    title: "One point of contact",
    description:
      "A single project lead manages every job on site, with no runaround between crew members.",
  },
  {
    title: "Fixed, detailed quotes",
    description:
      "What's quoted is what's billed. Change orders are approved before any work begins.",
  },
  {
    title: "Built for how you live",
    description:
      "We minimize disruption during the job and plan around your household's routine.",
  },
  {
    title: "Licensed & insured",
    description:
      "Every job is fully licensed and insured for residential work in Alberta.",
  },
  {
    title: "Permit handling included",
    description:
      "Where a job requires permits or inspections, we handle it as part of the project.",
  },
  {
    title: "Final walkthrough, always",
    description:
      "Nothing is considered finished until we've walked the space with you and signed off together.",
  },
];

const STATS = [
  { value: siteConfig.stats.yearsInBusiness, suffix: "+", label: "Years Active" },
  { value: siteConfig.stats.projectsCompleted, suffix: "+", label: "Projects Completed" },
  { value: siteConfig.stats.satisfactionPercent, suffix: "%", label: "Client Satisfaction" },
  { value: siteConfig.serviceAreas.length, suffix: "", label: "Communities Served" },
];

export default function AboutPage() {
  const jsonLd = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-border py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
          <div>
            <SectionLabel>About Black Stone</SectionLabel>
            <StaggerText
              text="We restore spaces, not just surfaces."
              className="mt-5 font-display text-5xl uppercase leading-[0.98] tracking-tight sm:text-6xl lg:text-[5rem]"
            />
            <p className="mt-7 max-w-lg text-muted-foreground">
              A Calgary basement renovation company run by one dedicated team,
              from first walkthrough to final inspection. No crew
              hand offs, no surprise line items, no guessing where your
              project stands.
            </p>
          </div>

          <Reveal
            delay={0.1}
            className="relative aspect-4/5 overflow-hidden rounded-2xl lg:rounded-3xl"
          >
            <Image
              src="/images/services/basement-development.webp"
              alt="Finished basement development project"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="relative aspect-4/5 overflow-hidden rounded-2xl">
            <Image
              src="/images/services/roofing.webp"
              alt="Crew working on a roofing project on site"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="mt-3.5 font-display text-2xl uppercase leading-[1.1] tracking-tight sm:text-3xl">
              5+ years of work done right.
            </h2>
            <p className="mt-5 max-w-prose text-muted-foreground">
              {siteConfig.name} has spent over 5 years helping homeowners
              across {siteConfig.serviceAreas.join(", ")} restore and protect
              their homes. From basement development and renovations to
              carpet cleaning, drywall, roofing, and siding, every job is run
              by a dedicated team that manages scheduling and quality control
              from start to finish.
            </p>
            <p className="mt-4 max-w-prose text-muted-foreground">
              We believe getting work done on your home should feel simple,
              not stressful, with detailed quotes, no surprises, regular
              updates during the job, and a final walkthrough before we ever
              call it done.
            </p>

            <blockquote className="mt-7 border-l-2 border-accent pl-5 font-display text-lg leading-[1.4] normal-case tracking-normal">
              &ldquo;The best compliment we get is a client who calls us
              again for the next job.&rdquo;
              <span className="mt-2.5 block font-sans text-xs uppercase tracking-[0.1em] text-muted-foreground">
                {siteConfig.name}
              </span>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>How We Work</SectionLabel>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl">
            What you can expect.
          </h2>

          <div className="mt-12 grid grid-cols-1 border-t border-l border-border sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, index) => (
              <Reveal
                key={value.title}
                delay={Math.min(index * 0.05, 0.3)}
                className="group border-r border-b border-border p-7 transition-colors duration-300 hover:bg-foreground"
              >
                <span className="font-display text-xs font-semibold text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-lg uppercase tracking-tight transition-colors duration-300 group-hover:text-background">
                  {value.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-background/70">
                  {value.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative flex min-h-125 items-center bg-cover bg-center bg-fixed sm:min-h-150"
        style={{
          backgroundImage: "url(/images/services/siding.webp)",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 text-center sm:grid-cols-4 sm:gap-6">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.1}>
                <p className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.1em] text-white/90 sm:text-sm">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ServiceAreaSection />
      <CTABand />
    </div>
  );
}
