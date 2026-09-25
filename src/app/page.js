import { Hero } from "@/components/sections/Hero";
import { TrustStats } from "@/components/sections/TrustStats";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
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
