import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/animations/Reveal";
import { ProjectGallery } from "@/components/shared/ProjectGallery";

export const metadata = {
  title: "Projects",
  description:
    "Browse completed projects from Black Stone Basement Development Ltd across Calgary, Airdrie, Okotoks, Cochrane, Chestermere, and Strathmore.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
      <Reveal>
        <SectionLabel>Our Work</SectionLabel>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl">
          Project gallery
        </h1>
      </Reveal>

      <div className="mt-16">
        <ProjectGallery />
      </div>
    </div>
  );
}
