import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { services, getServiceBySlug } from "@/lib/services-data";
import { getProjectsByCategory } from "@/lib/projects-data";
import { siteConfig } from "@/lib/site-config";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { StaggerText } from "@/components/animations/StaggerText";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import {
  getServiceSchema,
  getFaqSchema,
  getBreadcrumbSchema,
} from "@/lib/schema";

const TRUST_BADGES = [
  "Licensed & insured",
  "Written fixed-scope quotes",
  "Permits handled for you",
  "One project lead, start to finish",
];

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: `${service.summary} Serving ${siteConfig.serviceAreas.join(", ")}.`,
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: service.summary,
      images: [service.heroImage],
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedProjects = getProjectsByCategory(service.slug).slice(0, 3);

  const jsonLd = [
    getServiceSchema(service),
    getFaqSchema(service.faqs),
    getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.title, path: `/services/${service.slug}` },
    ]),
  ];

  return (
    <div>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative flex h-[60vh] min-h-100 w-full items-end overflow-hidden">
        <Image
          src={service.heroImage}
          alt={service.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
          <SectionLabel className="text-white/75">Service</SectionLabel>
          <h1 className="mt-3 font-display text-4xl uppercase tracking-tight text-white sm:text-6xl">
            {service.title}
          </h1>
        </div>
      </section>

      {/* Overview + scope of work, paired with a sticky quote card */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <Reveal>
              <SectionLabel>Overview</SectionLabel>
              <p className="mt-4 max-w-2xl text-2xl leading-snug tracking-tight sm:text-3xl">
                {service.heroDescription ?? service.summary}
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <p className="font-display text-sm uppercase tracking-tight text-muted-foreground">
                Scope of Work
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6">
                {TRUST_BADGES.map((badge) => (
                  <span key={badge} className="text-xs text-muted-foreground">
                    {badge}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.05} className="h-fit lg:sticky lg:top-28">
            <aside className="rounded-2xl bg-foreground p-8 text-background">
              <p className="font-display text-xl uppercase tracking-tight">
                Ready to get started?
              </p>
              <p className="mt-3 text-sm text-background/70">
                Get a detailed quote for your {service.title.toLowerCase()}{" "}
                project, serving {siteConfig.serviceAreas[0]} and area.
              </p>
              <Button href="/contact" variant="light" className="mt-6 w-full">
                Request a Quote
              </Button>
              <a
                href={siteConfig.phoneHref}
                className="mt-4 block text-center font-display text-lg tracking-tight text-background transition-colors hover:text-accent"
              >
                {siteConfig.phone}
              </a>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Process — the same scroll-choreographed component used on the homepage */}
      <div className="border-t border-border bg-surface">
        <ProcessSteps
          label="Process"
          heading={`How your ${service.title.toLowerCase()} project runs.`}
        />
      </div>

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>Our Work</SectionLabel>
                <StaggerText
                  text="Related projects."
                  className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
                />
              </div>
              <div className="hidden sm:block">
                <Button href="/projects" variant="primary">
                  View All Projects
                </Button>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project, index) => (
                <Reveal key={project.slug} delay={Math.min(index * 0.08, 0.2)}>
                  <ProjectCard project={project} className="h-90 sm:h-100" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <SectionLabel>Common Questions</SectionLabel>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal delay={0.05} className="mt-10">
            <FaqAccordion faqs={service.faqs} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
