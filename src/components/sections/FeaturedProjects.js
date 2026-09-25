"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { projects } from "@/lib/projects-data";

const CARD_WIDTH_VW = 48;
const CARD_GAP_VW = 3;

export function FeaturedProjects() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const trackWidthVw = projects.length * (CARD_WIDTH_VW + CARD_GAP_VW);
  const travelVw = Math.max(trackWidthVw - 100, 0);

  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${travelVw}vw`]);

  if (prefersReducedMotion) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading />
        </div>
        <div className="mt-12 flex gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8 scrollbar-none">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              className="w-[85vw] shrink-0 sm:w-[48vw]"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${(travelVw / 100 + 1) * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading />
        </div>

        <motion.div
          className="mt-10 flex sm:mt-12"
          style={{
            x,
            gap: `${CARD_GAP_VW}vw`,
            paddingLeft: "max((100vw - 72rem) / 2 + 1rem, 1rem)",
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              className="shrink-0"
              style={{ width: `${CARD_WIDTH_VW}vw` }}
            />
          ))}
          <div className="shrink-0" style={{ width: "1px" }} aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        <SectionLabel>Our Work</SectionLabel>
        <StaggerText
          text="Projects that speak for themselves."
          className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
        />
      </div>
      <div className="hidden sm:block">
        <Button href="/projects" variant="primary">
          View All Projects
        </Button>
      </div>
    </div>
  );
}
