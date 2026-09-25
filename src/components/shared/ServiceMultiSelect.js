"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { services } from "@/lib/services-data";

export function ServiceMultiSelect({
  id,
  name = "services",
  selected,
  onSelectedChange,
  hasError = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function toggleService(title) {
    onSelectedChange(
      selected.includes(title)
        ? selected.filter((item) => item !== title)
        : [...selected, title]
    );
  }

  function removeService(event, title) {
    event.stopPropagation();
    onSelectedChange(selected.filter((item) => item !== title));
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={selected.join(", ")} />

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={hasError}
        className={`flex min-h-12 w-full flex-wrap items-center gap-1.5 rounded-md border bg-white/5 px-3 py-2.5 text-left text-sm text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 ${
          hasError ? "border-red-400/70" : "border-white/15"
        }`}
      >
        {selected.length === 0 ? (
          <span className="px-1 text-white/40">Select services</span>
        ) : (
          selected.map((title) => (
            <span
              key={title}
              className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 py-0.5 pl-2.5 pr-1 text-[11px] font-medium text-white"
            >
              {title}
              <span
                role="button"
                tabIndex={0}
                aria-label={`Remove ${title}`}
                onClick={(event) => removeService(event, title)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    removeService(event, title);
                  }
                }}
                className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-white/70 hover:bg-white/15 hover:text-white"
              >
                <X size={10} />
              </span>
            </span>
          ))
        )}

        <ChevronDown
          size={16}
          className={`ml-auto shrink-0 text-white/50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            aria-multiselectable="true"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-72 overflow-y-auto rounded-md border border-white/15 bg-[#1a1c21] p-1.5 shadow-xl"
          >
            {services.map((service) => {
              const isSelected = selected.includes(service.title);

              return (
                <li key={service.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggleService(service.title)}
                    className="flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-sm text-white/90 transition-colors hover:bg-white/10"
                  >
                    {service.title}
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                        isSelected
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-white/20 text-transparent"
                      }`}
                    >
                      <Check size={13} />
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
