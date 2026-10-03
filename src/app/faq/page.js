import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { FaqTopics } from "@/components/sections/FaqTopics";
import { CTABand } from "@/components/sections/CTABand";
import { faqTopics } from "@/lib/faq-data";
import { services } from "@/lib/services-data";
import { getFaqSchema, getBreadcrumbSchema } from "@/lib/schema";

const TITLE = "FAQ";
const DESCRIPTION =
  "Answers to common questions about hiring Black Stone Basement Development Ltd, including service areas, free quotes, timelines, and each service we offer.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/faq",
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function FaqPage() {
  const serviceFaqs = services
    .filter((service) => service.faqs?.length)
    .flatMap((service) => service.faqs);

  const sections = [
    ...faqTopics,
    {
      slug: "by-service",
      title: "By Service",
      faqs: serviceFaqs,
    },
  ];

  const jsonLd = [
    getFaqSchema(sections.flatMap((section) => section.faqs)),
    getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "FAQ", path: "/faq" },
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

      <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
        <Reveal>
          <SectionLabel>FAQ</SectionLabel>
          <StaggerText
            text="Frequently asked questions."
            className="mt-4 max-w-2xl font-display text-4xl uppercase tracking-tight sm:text-5xl"
          />
          <p className="mt-5 max-w-xl text-muted-foreground">
            Answers organized by topic, plus questions specific to each
            service we offer.
          </p>
        </Reveal>

        <div className="mt-16 lg:mt-20">
          <FaqTopics sections={sections} />
        </div>
      </div>

      <CTABand />
    </div>
  );
}
