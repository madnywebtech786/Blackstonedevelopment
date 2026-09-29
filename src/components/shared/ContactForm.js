"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, MessageSquarePlus, TriangleAlert } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServiceMultiSelect } from "@/components/shared/ServiceMultiSelect";

const INITIAL_STATUS = "idle";
const MIN_SUBMIT_DURATION_MS = 600;

const REQUIRED_FIELDS = {
  name: "Name is required.",
  phone: "Phone is required.",
  address: "Address is required.",
  services: "Select at least one service.",
  message: "Project details are required.",
};

function fieldClasses(hasError) {
  return `mt-1.5 w-full rounded-md border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
    hasError ? "border-red-400/70" : "border-white/15"
  }`;
}

function RequiredMark() {
  return (
    <span className="text-red-400" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-400">
      {message}
    </p>
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ContactForm() {
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const prefersReducedMotion = useReducedMotion();

  function clearFieldError(name) {
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function validate(data) {
    const errors = {};
    for (const [name, message] of Object.entries(REQUIRED_FIELDS)) {
      if (!data[name]?.toString().trim()) errors[name] = message;
    }
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const form = event.currentTarget;
    const data = {
      ...Object.fromEntries(new FormData(form).entries()),
      services: selectedServices.join(", "),
    };

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setStatus("idle");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    const startedAt = Date.now();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_SUBMIT_DURATION_MS) {
        await wait(MIN_SUBMIT_DURATION_MS - elapsed);
      }

      if (!response.ok) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      form.reset();
      setSelectedServices([]);
      setStatus("success");
    } catch (error) {
      setFormError(error.message);
      setStatus("error");
    }
  }

  function handleSendAnother() {
    setStatus("idle");
    setFormError("");
  }

  const isSubmitting = status === "submitting";

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-400/15 text-green-400">
          <CheckCircle2 size={28} />
        </span>
        <SectionLabel className="mt-6 text-white/50">Message Sent</SectionLabel>
        <h3 className="mt-3 font-display text-2xl uppercase tracking-tight text-white sm:text-3xl">
          Thank you, we have it.
        </h3>
        <p className="mt-3 max-w-xs text-sm text-white/70">
          We&apos;ll review your project details and get back to you within
          one business day.
        </p>
        <Button
          type="button"
          variant="outline-light"
          onClick={handleSendAnother}
          className="mt-8"
        >
          <MessageSquarePlus size={16} />
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white">
            Name
            <RequiredMark />
          </label>
          <input
            id="name"
            name="name"
            type="text"
            disabled={isSubmitting}
            onChange={() => clearFieldError("name")}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={fieldClasses(Boolean(fieldErrors.name))}
          />
          <FieldError id="name-error" message={fieldErrors.name} />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white">
            Phone
            <RequiredMark />
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            disabled={isSubmitting}
            onChange={() => clearFieldError("phone")}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            className={fieldClasses(Boolean(fieldErrors.phone))}
          />
          <FieldError id="phone-error" message={fieldErrors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-white">
          Address
          <RequiredMark />
        </label>
        <input
          id="address"
          name="address"
          type="text"
          disabled={isSubmitting}
          onChange={() => clearFieldError("address")}
          aria-invalid={Boolean(fieldErrors.address)}
          aria-describedby={fieldErrors.address ? "address-error" : undefined}
          className={fieldClasses(Boolean(fieldErrors.address))}
        />
        <FieldError id="address-error" message={fieldErrors.address} />
      </div>

      <div>
        <label htmlFor="services" className="block text-sm font-medium text-white">
          Services
          <RequiredMark />
        </label>
        <div className="mt-1.5">
          <ServiceMultiSelect
            id="services"
            name="services"
            selected={selectedServices}
            onSelectedChange={(next) => {
              setSelectedServices(next);
              clearFieldError("services");
            }}
            hasError={Boolean(fieldErrors.services)}
            disabled={isSubmitting}
          />
        </div>
        <FieldError id="services-error" message={fieldErrors.services} />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white">
          Project details
          <RequiredMark />
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          disabled={isSubmitting}
          onChange={() => clearFieldError("message")}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={fieldClasses(Boolean(fieldErrors.message))}
        />
        <FieldError id="message-error" message={fieldErrors.message} />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button
          type="submit"
          variant="light"
          disabled={isSubmitting}
          className={isSubmitting ? "cursor-not-allowed opacity-70" : ""}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isSubmitting ? (
              <motion.span
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Send Message
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        {status === "error" && formError && (
          <p role="alert" className="flex items-center gap-1.5 text-sm text-red-400">
            <TriangleAlert size={16} />
            {formError}
          </p>
        )}
      </div>
    </form>
  );
}
