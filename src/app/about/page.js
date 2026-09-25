import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { CTABand } from "@/components/sections/CTABand";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "About",
  description:
    "Learn about Black Stone Basement Development Ltd, a Calgary-area home services company with 5+ years of experience in carpet cleaning, drywall, roofing, and siding.",
};

const VALUES = [
  {
    title: "One point of contact",
    description:
      "A single project lead manages every job on site — no runaround between crew members.",
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

const TEAM = [
  {
    name: "Marcus Webb",
    role: "Founder & Project Lead",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80",
  },
  {
    name: "Dana Okafor",
    role: "Operations Coordinator",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
  },
  {
    name: "Ray Petrov",
    role: "Site Supervisor",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
  },
  {
    name: "Lena Fischer",
    role: "Client Coordinator",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-border py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
          <div>
            <SectionLabel>About Black Stone</SectionLabel>
            <StaggerText
              text="We restore spaces, not just surfaces."
              className="mt-5 font-display text-5xl uppercase leading-[0.98] tracking-tight sm:text-6xl lg:text-[5rem]"
            />
            <p className="mt-7 max-w-lg text-muted-foreground">
              A Calgary-area home services company run by one dedicated team —
              from first walkthrough to final inspection. No crew
              hand-offs, no surprise line items, no guessing where your
              project stands.
            </p>
          </div>

          <Reveal
            delay={0.1}
            className="relative aspect-4/5 overflow-hidden rounded-2xl lg:rounded-3xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1200&q=80"
              alt="Freshly cleaned carpet in a bright living space"
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
              src="https://images.unsplash.com/photo-1632759145351-1d592919f522?w=1200&q=80"
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
              their homes. From carpet cleaning and post-renovation cleanup to
              drywall, roofing, and siding, every job is run by a dedicated
              team that manages scheduling and quality control from start to
              finish.
            </p>
            <p className="mt-4 max-w-prose text-muted-foreground">
              We believe getting work done on your home should feel simple,
              not stressful — detailed quotes with no surprises, regular
              updates during the job, and a final walkthrough before we call
              it done.
            </p>

            <blockquote className="mt-7 border-l-2 border-accent pl-5 font-display text-lg leading-[1.4] normal-case tracking-normal">
              &ldquo;The best compliment we get is a client who calls us
              again for the next job.&rdquo;
              <span className="mt-2.5 block font-sans text-xs uppercase tracking-[0.1em] text-muted-foreground">
                — {siteConfig.name}
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
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80)",
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

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>The Team</SectionLabel>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl">
            Who you&apos;ll work with.
          </h2>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:grid-cols-4 sm:gap-5">
            {TEAM.map((member, index) => (
              <Reveal
                key={member.name}
                delay={Math.min(index * 0.05, 0.2)}
                className="relative aspect-3/4 overflow-hidden rounded-lg"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-sm font-medium text-white">
                    {member.name}
                  </p>
                  <p className="text-xs text-white/70">{member.role}</p>
                </div>
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
