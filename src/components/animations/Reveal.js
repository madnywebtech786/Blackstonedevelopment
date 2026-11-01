"use client";

import { motion, useReducedMotion } from "motion/react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  style,
  as: Tag = "div",
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[Tag] ?? motion.div;

  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
