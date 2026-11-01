// React Bits effects, wired to the CMS presets in settings.animations. Every effect falls back to the plain
// template markup: when the admin switches it (or all animations) off, under prefers-reduced-motion, and if
// the effect itself throws.
import { Component, createContext, lazy, Suspense, useContext, type CSSProperties, type ReactNode } from "react";
import { motion, type MotionProps } from "motion/react";
import type { Settings } from "../../../shared/content";
import { seed } from "../../../shared/seed";
import { cardHover } from "./Motion";
import BlurText from "./reactbits/BlurText";
import ClickSpark from "./reactbits/ClickSpark";
import GradientText from "./reactbits/GradientText";
import Magnet from "./reactbits/Magnet";
import ShinyText from "./reactbits/ShinyText";
import SpotlightCard from "./reactbits/SpotlightCard";

// WebGL background: its own chunk, fetched only when the preset is on.
const DotGrid = lazy(() => import("./reactbits/DotGrid"));

type Anim = Settings["animations"];
export type Fx = { on: boolean; theme: Settings["theme"] } & Pick<Anim, "heroText" | "accent" | "card" | "button" | "background">;

const OFF = { heroText: "none", accent: "none", card: "none", button: "none", background: "none" } as const;

/** on = animations enabled and no reduced-motion request; with on=false every preset reads "none". */
export function resolveFx(anim: Anim, theme: Settings["theme"], reduce: boolean): Fx {
  const on = anim.enabled && !reduce;
  return on ? { on, theme, heroText: anim.heroText, accent: anim.accent, card: anim.card, button: anim.button, background: anim.background } : { on, theme, ...OFF };
}

const FxContext = createContext<Fx>({ on: false, theme: seed.settings.theme, ...OFF });
export const FxProvider = FxContext.Provider;
export const useFx = (): Fx => useContext(FxContext);

/** If an effect throws, show the plain content instead of a blank spot. */
class Safe extends Component<{ plain: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.plain : this.props.children;
  }
}

/** Hero title line with the BlurText word reveal (used when heroText is "blur"). */
export function HeroWords({ text }: { text: string }) {
  return (
    <Safe plain={<span style={{ display: "block" }}>{text}</span>}>
      <BlurText text={text} trigger="load" animateBy="words" delay={90} direction="top" />
    </Safe>
  );
}

/** One accent: the hero small text, in the theme's light colour with a main-colour shine or gradient. */
export function Accent({ children }: { children: string }) {
  const { accent, theme } = useFx();
  if (accent === "none") return <>{children}</>;
  const fancy =
    accent === "shiny" ? (
      <ShinyText text={children} color={theme.color3} shineColor={theme.color1} speed={3} delay={2} />
    ) : (
      <GradientText colors={["var(--color-3)", "var(--color-1)", "var(--color-3)"]} animationSpeed={6}>
        {children}
      </GradientText>
    );
  return <Safe plain={children}>{fancy}</Safe>;
}

const SPOTLIGHT_VARS = { "--spotlight-card-surface": "transparent", "--spotlight-card-border": "transparent", "--spotlight-card-shadow": "none" } as CSSProperties;

/** A project card: the grid item keeps its template class and reveal; the effect sits inside it. */
export function CardFx({ className, item, children }: { className: string; item: MotionProps; children: ReactNode }) {
  const { card } = useFx();
  const body =
    card === "spotlight" ? (
      <Safe plain={children}>
        <SpotlightCard className="card-fx" spotlightColor="var(--color-1)" intensity={0.18} spotlightSize={320} style={SPOTLIGHT_VARS}>
          {children}
        </SpotlightCard>
      </Safe>
    ) : (
      children
    );
  return (
    <motion.div className={className} {...item} {...(card === "lift" ? cardHover : {})}>
      {body}
    </motion.div>
  );
}

/** A template button with Magnet pull or ClickSpark burst. full = the button spans its column (u-fullwidth). */
export function ButtonFx({ full, children }: { full: boolean; children: ReactNode }) {
  const { button, theme } = useFx();
  if (button === "none") return <>{children}</>;
  const box: CSSProperties = { display: full ? "block" : "inline-block", width: full ? "100%" : "auto", height: "auto" };
  const fancy =
    button === "magnet" ? (
      <Magnet padding={60} magnetStrength={4} maxOffset={12} wrapperClassName="btn-fx" style={box}>
        {children}
      </Magnet>
    ) : (
      <ClickSpark className="btn-fx" sparkColor={theme.color1} sparkSize={10} sparkRadius={20} sparkCount={8} style={box}>
        {children}
      </ClickSpark>
    );
  return <Safe plain={children}>{fancy}</Safe>;
}

/** Interactive dot field behind the hero, in the theme's light and main colours. */
export function HeroBackground() {
  const { background, theme } = useFx();
  if (background !== "dots") return null;
  return (
    <Safe plain={null}>
      <Suspense fallback={null}>
        <DotGrid className="hero-bg" baseColor={theme.color3} activeColor={theme.color1} opacity={0.18} dotSize={3} gap={28} proximity={120} clickShock={false} />
      </Suspense>
    </Safe>
  );
}
