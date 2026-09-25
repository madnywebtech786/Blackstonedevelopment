import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServiceIndexRow } from "@/components/shared/ServiceIndexRow";
import { Reveal } from "@/components/animations/Reveal";
import { services } from "@/lib/services-data";

export const metadata = {
  title: "Services",
  description:
    "Explore all services offered by Black Stone Basement Development Ltd, from carpet cleaning and renovation cleaning to drywall, roofing, and siding across Calgary and area.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
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
