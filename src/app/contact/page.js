import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { ContactSection } from "@/components/sections/ContactSection";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Black Stone Basement Development Ltd for a free quote on basement development, drywall, roofing, or siding around Calgary today.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const jsonLd = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 pt-32 pb-4 text-center sm:px-6 sm:pt-40 lg:px-8">
        <Reveal>
          <SectionLabel>Get In Touch</SectionLabel>
          <StaggerText
            text="Let's talk about your project."
            className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl"
          />
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Share a few details about what you&apos;re planning and we&apos;ll
            follow up within one business day with next steps.
          </p>
        </Reveal>
      </div>

      <ContactSection />
    </div>
  );
}
