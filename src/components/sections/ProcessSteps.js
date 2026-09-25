"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { processSteps } from "@/lib/process-steps";

export function ProcessSteps({
  label = "How It Works",
  heading = "From first call to final walkthrough.",
}) {
  const containerRef = useRef(null);
  const badgeRefs = useRef([]);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    function updateActiveIndex() {
      const viewportCenter = window.innerHeight / 2;
      let newActiveIndex = -1;

      badgeRefs.current.forEach((badge, i) => {
        if (!badge) return;
        const rect = badge.getBoundingClientRect();
        if (rect.top + rect.height / 2 <= viewportCenter) {
          newActiveIndex = i;
        }
      });

      setActiveIndex(newActiveIndex);
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveIndex();
          ticking = false;
        });
        ticking = true;
      }
    }

    updateActiveIndex();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>{label}</SectionLabel>
        <StaggerText
          text={heading}
          className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
        />

        <div ref={containerRef} className="relative mt-16">
          {!prefersReducedMotion && (
            <div className="absolute top-2 left-4.75 h-[calc(100%-16px)] w-px bg-border">
              <motion.div
                style={{ scaleY: lineScale }}
                className="h-full w-full origin-top bg-foreground"
              />
            </div>
          )}

          <div className="space-y-12 sm:space-y-16">
            {processSteps.map((step, index) => {
              const isActive = !prefersReducedMotion && index <= activeIndex;

              return (
                <Reveal key={step.number} delay={index * 0.05}>
                  <div className="flex gap-6">
                    <span
                      ref={(el) => {
                        badgeRefs.current[index] = el;
                      }}
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-sm transition-colors duration-500 ${
                        isActive
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-surface-elevated text-foreground"
                      }`}
                    >
                      <motion.span
                        animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {step.number}
                      </motion.span>
                    </span>
                    <div>
                      <h3
                        className={`font-display text-xl uppercase tracking-tight transition-colors duration-500 ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
