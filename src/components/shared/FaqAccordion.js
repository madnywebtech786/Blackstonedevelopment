"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="border-t border-border">
      {faqs.map((faq, index) => {
        const isOpen = index === openIndex;

        return (
          <div key={faq.question} className="border-b border-border">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="font-display text-base uppercase tracking-tight sm:text-lg">
                {faq.question}
              </span>
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border">
                <Plus
                  size={16}
                  className={`transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${index}`}
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden"
                >
                  <p className="max-w-xl pb-6 text-sm text-muted-foreground">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
