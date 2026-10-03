import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServiceIndexRow } from "@/components/shared/ServiceIndexRow";
import { Reveal } from "@/components/animations/Reveal";
import { services } from "@/lib/services-data";
import { getBreadcrumbSchema } from "@/lib/schema";

const TITLE = "Services";
const DESCRIPTION =
  "Explore all services offered by Black Stone Basement Development Ltd, from basement development and carpet cleaning to drywall, roofing, and siding across Calgary and area.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/services",
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ServicesPage() {
  const jsonLd = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Reveal>
        <SectionLabel>All Services</SectionLabel>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl">
          Our services
        </h1>
      </Reveal>

      <div className="mt-16 border-t border-border sm:mt-20">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={Math.min(index * 0.04, 0.3)}>
            <ServiceIndexRow service={service} index={index} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
