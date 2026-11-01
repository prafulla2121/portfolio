// The one content document behind the whole site. Shared by the Netlify function (validates every write),
// the admin UI (form editor) and the public site (types only; the public bundle never imports zod at runtime).
import { z } from "zod";

const id = z.string().trim().min(1).max(64).regex(/^[a-z0-9-]+$/, "lowercase letters, digits and dashes");
const line = (max = 200) => z.string().trim().max(max);
const req = (max = 200) => z.string().trim().min(1).max(max);
const lines = (max = 30, each = 600) => z.array(z.string().trim().min(1).max(each)).max(max);

// A link is a same-site path ("/about", "#top") or an http(s)/mailto URL. Never javascript: or data:.
export const linkSchema = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^(\/|#)/.test(v) || /^(https?:|mailto:)/i.test(v), "must start with /, #, https://, http:// or mailto:");

// An image is a same-site path (/images/x.png, /api/images/<id>) or an https URL.
export const imageSchema = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^\/[^/]/.test(v) || /^https:\/\//i.test(v), "must be a site path or an https URL");

export const ANIMATIONS = ["none", "fade", "slide", "scale", "stagger"] as const;
export const LOADERS = ["none", "fade", "spinner"] as const;
export const BODY_FONTS = ["Roboto Flex", "Inter", "DM Sans", "Poppins", "Lato"] as const;
export const DISPLAY_FONTS = ["DM Serif Display", "Playfair Display", "Lora", "Merriweather", "Fraunces"] as const;
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "a colour like #EA9010");

const base = {
  id,
  visible: z.boolean().default(true),
  animation: z.enum(ANIMATIONS).default("fade"),
  pretitle: line(80).default(""),
  title: line(200).default("")
};

const itemBase = { id, visible: z.boolean().default(true) };

export const projectItem = z.object({
  ...itemBase,
  title: req(120),
  category: line(80).default(""),
  description: line(1200).default(""),
  tech: lines(20, 60).default([]),
  repoUrl: linkSchema.default(""),
  liveUrl: linkSchema.default(""),
  image: imageSchema.default("")
});

export const experienceItem = z.object({
  ...itemBase,
  title: req(120),
  company: req(120),
  period: line(80).default(""),
  location: line(120).default(""),
  points: lines(15).default([])
});

export const textItem = z.object({
  ...itemBase,
  title: line(160).default(""),
  text: line(1500).default(""),
  link: linkSchema.default(""),
  image: imageSchema.default(""),
  tags: lines(20, 60).default([])
});

export const skillGroup = z.object({ ...itemBase, title: req(120), items: lines(40, 160).default([]) });

export const sectionSchema = z.discriminatedUnion("type", [
  z.object({ ...base, type: z.literal("hero"), lead: line(600).default(""), image: imageSchema.default(""), scrollLabel: line(60).default("Scroll for more") }),
  z.object({
    ...base,
    type: z.literal("about"),
    paragraphs: lines(10, 1500).default([]),
    image: imageSchema.default(""),
    buttonLabel: line(60).default(""),
    buttonLink: linkSchema.default(""),
    showSocial: z.boolean().default(true)
  }),
  z.object({ ...base, type: z.literal("experience"), items: z.array(experienceItem).max(30).default([]) }),
  z.object({ ...base, type: z.literal("projects"), limit: z.number().int().min(0).max(100).default(0), buttonLabel: line(60).default(""), buttonLink: linkSchema.default(""), items: z.array(projectItem).max(60).default([]) }),
  z.object({ ...base, type: z.literal("skills"), lead: line(600).default(""), buttonLabel: line(60).default(""), buttonLink: linkSchema.default(""), groups: z.array(skillGroup).max(30).default([]) }),
  // education, certifications, achievements, values, story chapters and any custom list
  z.object({ ...base, type: z.literal("list"), layout: z.enum(["cards", "bullets", "chapters"]).default("cards"), lead: line(600).default(""), image: imageSchema.default(""), items: z.array(textItem).max(60).default([]) }),
  z.object({ ...base, type: z.literal("text"), body: line(8000).default(""), image: imageSchema.default("") }),
  z.object({ ...base, type: z.literal("contact"), text: line(1500).default(""), image: imageSchema.default(""), showForm: z.boolean().default(true), showEmail: z.boolean().default(true), showSocial: z.boolean().default(true) }),
  z.object({ ...base, type: z.literal("cta"), lead: line(600).default(""), buttonLabel: line(60).default(""), buttonLink: linkSchema.default("") })
]);

export const pageSchema = z.object({
  id,
  // "" is the home page; otherwise a lowercase path segment such as "about" or "talks"
  slug: z.string().trim().max(60).regex(/^([a-z0-9-]*)$/, "lowercase letters, digits and dashes"),
  title: req(120),
  pretitle: line(80).default(""),
  visible: z.boolean().default(true),
  sections: z.array(sectionSchema).max(30).default([])
});

export const navItem = z.object({ id, label: req(40), link: linkSchema.refine((v) => v !== "", "required"), visible: z.boolean().default(true) });
export const socialItem = z.object({ id, label: req(40), url: linkSchema.refine((v) => v !== "", "required"), visible: z.boolean().default(true) });

export const settingsSchema = z.object({
  siteTitle: req(120),
  metaDescription: line(300).default(""),
  ogImage: imageSchema.default(""),
  logo: imageSchema.default("/images/logo.svg"),
  name: req(120),
  email: z.union([z.literal(""), z.email().max(200)]).default(""),
  location: line(120).default(""),
  footerAbout: line(1500).default(""),
  headerButtonLabel: line(60).default(""),
  headerButtonLink: linkSchema.default(""),
  nav: z.array(navItem).max(15).default([]),
  social: z.array(socialItem).max(15).default([]),
  theme: z
    .object({
      color1: hex.default("#EA9010"),
      color2: hex.default("#343D35"),
      color3: hex.default("#FEF5E4"),
      bodyFont: z.enum(BODY_FONTS).default("Roboto Flex"),
      displayFont: z.enum(DISPLAY_FONTS).default("DM Serif Display")
    })
    .default({ color1: "#EA9010", color2: "#343D35", color3: "#FEF5E4", bodyFont: "Roboto Flex", displayFont: "DM Serif Display" }),
  animations: z
    .object({ enabled: z.boolean().default(true), loader: z.enum(LOADERS).default("fade") })
    .default({ enabled: true, loader: "fade" })
});

export const contentSchema = z
  .object({
    version: z.number().int().min(0),
    updatedAt: z.string().max(40).default(""),
    settings: settingsSchema,
    pages: z.array(pageSchema).min(1).max(30)
  })
  .superRefine((doc, ctx) => {
    const slugs = new Set<string>();
    doc.pages.forEach((p, i) => {
      if (slugs.has(p.slug)) ctx.addIssue({ code: "custom", path: ["pages", i, "slug"], message: "two pages share this slug" });
      slugs.add(p.slug);
      const ids = new Set<string>();
      p.sections.forEach((s, j) => {
        if (ids.has(s.id)) ctx.addIssue({ code: "custom", path: ["pages", i, "sections", j, "id"], message: "duplicate section id" });
        ids.add(s.id);
      });
    });
    if (!slugs.has("")) ctx.addIssue({ code: "custom", path: ["pages"], message: "a home page (empty slug) is required" });
  });

export type Content = z.infer<typeof contentSchema>;
export type Settings = Content["settings"];
export type Page = Content["pages"][number];
export type Section = Page["sections"][number];
export type SectionType = Section["type"];
export type ProjectItem = z.infer<typeof projectItem>;
export type ExperienceItem = z.infer<typeof experienceItem>;
export type TextItem = z.infer<typeof textItem>;
export type SkillGroup = z.infer<typeof skillGroup>;
export type Animation = (typeof ANIMATIONS)[number];
