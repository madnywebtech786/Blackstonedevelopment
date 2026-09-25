"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { testimonials } from "@/lib/testimonials-data";

const AUTOPLAY_MS = 5500;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef(null);

  const goTo = useCallback((nextIndex) => {
    setIndex(((nextIndex % testimonials.length) + testimonials.length) % testimonials.length);
  }, []);

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    timerRef.current = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timerRef.current);
  }, [goNext, isPaused, prefersReducedMotion]);

  const testimonial = testimonials[index];

  if (prefersReducedMotion) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading />
          <div className="mt-12 flex flex-col gap-10">
            {testimonials.map((item) => (
              <blockquote key={item.author} className="border-l border-border pl-6">
                <p className="font-display text-xl leading-snug tracking-tight sm:text-2xl">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-4 text-sm text-muted-foreground">
                  {item.author} — {item.location}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading />

        <div
          className="mt-12 flex flex-col gap-5 sm:mt-16 sm:grid sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div
            className="flex flex-row gap-5 sm:flex-col sm:gap-5 sm:pt-1"
            role="tablist"
            aria-label="Client testimonials"
          >
            {testimonials.map((item, itemIndex) => (
              <button
                key={item.author}
                type="button"
                role="tab"
                aria-selected={itemIndex === index}
                aria-label={`Show testimonial from ${item.author}`}
                onClick={() => goTo(itemIndex)}
                className="group flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span
                  className={`h-0.5 w-6 transition-colors duration-300 sm:h-6 sm:w-0.5 ${
                    itemIndex === index
                      ? "bg-foreground"
                      : "bg-border group-hover:bg-muted-foreground"
                  }`}
                />
                <span
                  className={`font-display text-xs transition-colors duration-300 ${
                    itemIndex === index
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  0{itemIndex + 1}
                </span>
              </button>
            ))}
          </div>

          <div className="relative min-h-104 overflow-hidden rounded-lg border border-border bg-surface-elevated px-6 py-10 sm:min-h-88 sm:px-14 sm:py-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full min-h-88 flex-col justify-center sm:min-h-72"
              >
                <p className="font-display text-2xl leading-snug tracking-tight sm:text-3xl lg:text-4xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 sm:mt-10">
                  <div className="text-sm">
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-accent">
                    {testimonial.serviceLabel}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <div className="max-w-2xl">
      <SectionLabel>Client Words</SectionLabel>
      <StaggerText
        text="Trusted across Calgary and area."
        className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
      />
      <Reveal delay={0.15}>
        <p className="mt-5 text-base text-muted-foreground">
          We measure a project by whether the people living with it every day are
          still happy with it years later — these are their words, not ours.
        </p>
      </Reveal>
    </div>
  );
}
