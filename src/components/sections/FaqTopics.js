"use client";

import { useEffect, useRef, useState } from "react";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { Reveal } from "@/components/animations/Reveal";

export function FaqTopics({ sections }) {
  const sectionRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function updateActiveIndex() {
      const scanLine = 160;
      let closestIndex = 0;

      sectionRefs.current.forEach((section, i) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= scanLine) closestIndex = i;
      });

      setActiveIndex(closestIndex);
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToSection(index) {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
      <nav
        aria-label="FAQ topics"
        className="hidden lg:block"
      >
        <ul className="sticky top-28 space-y-1">
          {sections.map((section, i) => (
            <li key={section.slug}>
              <button
                type="button"
                onClick={() => scrollToSection(i)}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  i === activeIndex
                    ? "bg-surface text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 divide-y divide-border border-t border-border lg:border-t-0 lg:divide-y-0">
        {sections.map((section, i) => (
          <section
            key={section.slug}
            id={section.slug}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="scroll-mt-28 py-10 first:pt-0 lg:py-14 lg:first:py-0"
          >
            <Reveal>
              <h2 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
                {section.title}
              </h2>
            </Reveal>
            <Reveal delay={0.05} className="mt-6">
              <FaqAccordion faqs={section.faqs} />
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
