"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services-data";

const SLIDE_SLUGS = ["carpet-cleaning", "roofing", "siding"];

const SLIDES = SLIDE_SLUGS.map((slug) => services.find((service) => service.slug === slug)).filter(
  Boolean
);

const AUTOPLAY_MS = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef(null);

  const goTo = useCallback((nextIndex) => {
    setIndex(((nextIndex % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    timerRef.current = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timerRef.current);
  }, [goNext, isPaused, prefersReducedMotion]);

  const slide = SLIDES[index];

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative min-h-screen w-full bg-foreground">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.slug}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0.01 : 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={slide.heroImage}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-1 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.slug}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -16 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <SectionLabel className="text-white/80">Featured Service</SectionLabel>
                <h1 className="mt-4 max-w-3xl font-display text-[clamp(3.5rem,13vw,8rem)] uppercase leading-[0.92] tracking-tight text-white">
                  {slide.title}
                </h1>
                <p className="mt-6 max-w-lg text-lg text-white/85">
                  {slide.heroDescription}
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button
                    href={`/services/${slide.slug}`}
                    variant="primary"
                    className="w-full justify-center text-center sm:w-auto"
                  >
                    Explore {slide.title}
                  </Button>
                  <Button
                    href="/contact"
                    variant="light"
                    className="w-full justify-center text-center sm:w-auto"
                  >
                    Get a Quote
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        <div
          className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Hero slides"
        >
          {SLIDES.map((item, slideIndex) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={`Show ${item.title} slide`}
              onClick={() => goTo(slideIndex)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                slideIndex === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
