"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav({ isScrolled }) {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  const panelTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          isScrolled
            ? "border-border bg-surface-elevated text-foreground"
            : "border-white/40 bg-white/10 text-white backdrop-blur-sm"
        }`}
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
              onClick={close}
              className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={panelTransition}
              className="fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-sm flex-col overflow-hidden border-l border-border bg-surface-elevated shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 pt-6">
                <Logo onClick={close} />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-200 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center px-6" aria-label="Primary">
                <ul className="flex flex-col">
                  {NAV_LINKS.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0.01 : 0.45,
                        delay: prefersReducedMotion ? 0 : 0.15 + index * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="border-b border-border last:border-b-0"
                    >
                      <Link
                        href={link.href}
                        onClick={close}
                        className="group flex items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        <span className="h-px w-0 bg-foreground transition-all duration-300 ease-out group-hover:w-5" />
                        <span className="font-display text-3xl uppercase tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-1">
                          {link.label}
                        </span>
                        <ArrowUpRight
                          size={20}
                          className="ml-auto text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.45,
                  delay: prefersReducedMotion ? 0 : 0.15 + NAV_LINKS.length * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="border-t border-border px-6 py-6"
              >
                <a
                  href={siteConfig.phoneHref}
                  className="font-display text-xl tracking-tight hover:text-accent"
                >
                  {siteConfig.phone}
                </a>
                <p className="mt-1 text-sm text-muted-foreground">
                  {siteConfig.serviceAreas.slice(0, 3).join(" · ")} &amp; area
                </p>
                <Button href="/contact" variant="primary" onClick={close} className="mt-5 w-full">
                  Get a Quote
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
