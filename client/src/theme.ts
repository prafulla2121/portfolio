import type { Settings } from "../../shared/content";

// L offsets of each template shade from its base colour (public/css/styles.css :root). With the default hexes
// these reproduce the template values exactly, e.g. color-1 #EA9010 = hsl(35 87% 49%) -> lightest 96%.
const SHADES = {
  1: { "": 0, lightest: 47, lighter: 20, light: 10, dark: -10, darker: -20, darkest: -39 },
  2: { "": 0, lightest: 33, lighter: 20, light: 10, dark: -8, darker: -20 },
  3: { "": 0, light: 5, dark: -10, darker: -20 }
} as const;

const DEFAULT_FONTS = ["Roboto Flex", "DM Serif Display"];

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, Math.round(l * 100)];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [Math.round((h * 60 + 360) % 360), Math.round(s * 100), Math.round(l * 100)];
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!content) return el?.remove();
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Push theme colours, fonts and SEO meta from the settings into the live document. */
export function applySettings(settings: Settings) {
  const root = document.documentElement.style;
  const { theme } = settings;
  ([1, 2, 3] as const).forEach((n) => {
    const [h, s, l] = hexToHsl(theme[`color${n}`]);
    for (const [shade, offset] of Object.entries(SHADES[n])) {
      const light = Math.min(100, Math.max(0, l + offset));
      root.setProperty(`--color-${n}${shade ? `-${shade}` : ""}`, `hsla(${h}, ${s}%, ${light}%, 1)`);
    }
  });
  root.setProperty("--font-1", `"${theme.bodyFont}", sans-serif`);
  root.setProperty("--font-2", `"${theme.displayFont}", serif`);

  // styles.css already imports the two default fonts; load only the others.
  const extra = [theme.bodyFont, theme.displayFont].filter((f) => !DEFAULT_FONTS.includes(f));
  let link = document.getElementById("theme-fonts") as HTMLLinkElement | null;
  if (extra.length) {
    if (!link) {
      link = document.createElement("link");
      link.id = "theme-fonts";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    const families = extra.map((f) => `family=${f.replace(/ /g, "+")}:wght@400;700`).join("&");
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  } else link?.remove();

  document.title = settings.siteTitle;
  setMeta("name", "description", settings.metaDescription);
  setMeta("property", "og:image", settings.ogImage ? new URL(settings.ogImage, location.origin).href : "");
}
