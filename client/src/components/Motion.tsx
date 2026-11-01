import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

// Shared motion presets. Only opacity and transform are animated; MotionConfig reducedMotion="user"
// (main.tsx) drops the transforms for people who ask for reduced motion.
const ease = [0.16, 1, 0.3, 1] as const;

/** Scroll reveal: fades and rises once when the block enters the viewport. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** The same reveal as props, for elements that must stay direct children of a CSS grid. */
export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  transition: { duration: 0.6, ease }
} as const;

/** Parent for a list whose children (staggerItem) appear one after another. */
export const staggerParent: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08 } }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
};

/** Props for a list container that staggers in once on scroll. */
export const staggerOnView = {
  variants: staggerParent,
  initial: "hidden",
  whileInView: "shown",
  viewport: { once: true, margin: "0px 0px -10% 0px" }
} as const;

/** Card hover: a small lift. Pointer only; keyboard focus gets the template's focus ring. */
export const cardHover = {
  whileHover: { y: -6 },
  transition: { duration: 0.2, ease: "easeOut" }
} as const;

/** Hero entrance: each child rises in sequence on first load. */
export const heroParent: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease } }
};
