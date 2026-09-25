"use client";

import { motion, useReducedMotion } from "motion/react";

export function StaggerText({ text, className = "", as: Tag = "h2" }) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag] ?? motion.h2;

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}
