"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerText } from "@/components/animations/StaggerText";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services-data";

const FEATURED_SLUGS = [
  "carpet-cleaning",
  "renovation-cleaning",
  "drywall",
  "roofing",
  "siding",
  "kitchen-remodeling",
];

export function ServicesPreview() {
  const featured = FEATURED_SLUGS.map((slug) =>
    services.find((service) => service.slug === slug)
  ).filter(Boolean);

  const rowRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    function updateActiveIndex() {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
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

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div>
          <SectionLabel>What We Do</SectionLabel>
          <StaggerText
            text="Services, done right."
            className="mt-4 font-display text-3xl uppercase tracking-tight sm:text-4xl"
          />
        </div>

        {/* Desktop: sticky pinned image + scroll-active list */}
        <div className="relative mt-16 hidden lg:grid lg:grid-cols-2 lg:gap-16">
          <div className="sticky top-24 h-[60vh] self-start">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              {featured.map((service, i) => (
                <motion.div
                  key={service.slug}
                  className="absolute inset-0"
                  animate={{ opacity: i === activeIndex ? 1 : 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
                >
                  <Image
                    src={service.heroImage}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            {featured.map((service, i) => (
              <div
                key={service.slug}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="flex min-h-[60vh] flex-col justify-center border-b border-border"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className={`font-display uppercase tracking-tight transition-all duration-300 ${
                    i === activeIndex
                      ? "text-4xl text-foreground"
                      : "text-2xl text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {service.title}
                </Link>
                <p
                  className={`mt-3 max-w-sm text-sm text-muted-foreground transition-opacity duration-300 ${
                    i === activeIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {service.summary}
                </p>
                <Button
                  href={`/services/${service.slug}`}
                  variant="primary"
                  className={`mt-6 w-fit transition-all duration-300 ${
                    i === activeIndex
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-1 opacity-0"
                  }`}
                >
                  View Service
                  <ArrowUpRight size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/tablet: full-bleed stacked image panels, fade/scale in on scroll */}
        <div className="mt-12 flex flex-col gap-4 lg:hidden">
          {featured.map((service, index) => (
            <Reveal key={service.slug} delay={(index % 3) * 0.06}>
              <Link
                href={`/services/${service.slug}`}
                className="group relative block h-[70vh] min-h-105 overflow-hidden rounded-lg"
              >
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-active:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <div>
                    <h3 className="font-display text-3xl uppercase tracking-tight text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-white/85">{service.summary}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center lg:mt-16">
          <Button href="/services" variant="primary">
            View All Services
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
