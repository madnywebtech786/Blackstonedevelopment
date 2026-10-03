import { Hero } from "@/components/sections/Hero";
import { TrustStats } from "@/components/sections/TrustStats";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactSection } from "@/components/sections/ContactSection";
import { getWebsiteSchema, getReviewSchema } from "@/lib/schema";
import { testimonials } from "@/lib/testimonials-data";

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const jsonLd = [getWebsiteSchema(), ...getReviewSchema(testimonials)];

  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Hero />
      <TrustStats />
      <ServicesPreview />
      <FeaturedProjects />
      <ServiceAreaSection />
      <ProcessSteps />
      <Testimonials />
      <ContactSection />
    </>
  );
}
