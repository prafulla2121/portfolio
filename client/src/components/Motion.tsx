import type { MotionProps, Variants } from "motion/react";
import type { Animation } from "../../../shared/content";

// Only opacity, transform and (blur) filter are animated. PageView passes "none" under reduced motion
// or when the admin switches animations off, so nothing moves then.
const ease = [0.16, 1, 0.3, 1] as const;
const viewport = { once: true, margin: "0px 0px -10% 0px" } as const;

const from = {
  fade: { opacity: 0 },
  slide: { opacity: 0, y: 40 },
  scale: { opacity: 0, scale: 0.95 },
  stagger: { opacity: 0, y: 24 },
  // blur-in reveal, after React Bits FadeContent (that one needs GSAP; motion is already here)
  blur: { opacity: 0, filter: "blur(10px)" }
};
const to = {
  fade: { opacity: 1 },
  slide: { opacity: 1, y: 0 },
  scale: { opacity: 1, scale: 1 },
  stagger: { opacity: 1, y: 0 },
  blur: { opacity: 1, filter: "blur(0px)" }
};

export interface SectionMotion {
  /** one element that animates on its own (a header, an image, a whole block) */
  block: MotionProps;
  /** a list container; with "stagger" its children rise one after another */
  list: MotionProps;
  /** each child of `list` */
  item: MotionProps;
}

const still: SectionMotion = { block: {}, list: {}, item: {} };

/** Motion props for a section. Hero passes onLoad (plays at once); everything else reveals once on scroll. */
export function sectionMotion(preset: Animation, onLoad = false): SectionMotion {
  if (preset === "none") return still;
  const trigger = onLoad ? { animate: "shown" } : { whileInView: "shown", viewport };
  const variants: Variants = { hidden: from[preset], shown: { ...to[preset], transition: { duration: 0.6, ease } } };
  const block: MotionProps = { initial: "hidden", ...trigger, variants };
  if (preset !== "stagger") return { block, list: block, item: {} };
  const parent: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.08, delayChildren: onLoad ? 0.1 : 0 } } };
  return { block, list: { initial: "hidden", ...trigger, variants: parent }, item: { variants } };
}

/** Card hover: a small lift. Pointer only; keyboard focus keeps the template focus ring. */
export const cardHover: MotionProps = { whileHover: { y: -6 }, transition: { duration: 0.2, ease: "easeOut" } };
