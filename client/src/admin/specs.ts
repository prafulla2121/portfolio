// The field-spec tables: one small list per section / item type. Edit here to change what the admin shows.
import {
  ANIMATIONS,
  BODY_FONTS,
  DISPLAY_FONTS,
  LOADERS,
  experienceItem,
  navItem,
  projectItem,
  sectionSchema,
  skillGroup,
  socialItem,
  textItem,
  type Page,
  type Section,
  type SectionType
} from "../../../shared/content";
import type { ListSpec, Spec } from "./fields";

const img: Spec = { k: "image", label: "Image", kind: "image" };
const lead: Spec = { k: "lead", label: "Intro text", kind: "long" };
const btn: Spec[] = [
  { k: "buttonLabel", label: "Button text" },
  { k: "buttonLink", label: "Button link", kind: "link" }
];
const check = (k: string, label: string): Spec => ({ k, label, kind: "check" });
const one = (noun: string, title: string, make: (id: string) => unknown): ListSpec["add"] => [{ label: noun, title, make }];

const PROJECTS: ListSpec = {
  noun: "project",
  add: one("project", "New project", (id) => projectItem.parse({ id, title: "New project" })),
  fields: () => [
    { k: "title", label: "Title" },
    { k: "category", label: "Category" },
    { k: "description", label: "Description", kind: "long" },
    { k: "tech", label: "Tech used", kind: "lines" },
    { k: "repoUrl", label: "Code link", kind: "link" },
    { k: "liveUrl", label: "Live link", kind: "link" },
    img
  ]
};
const EXPERIENCE: ListSpec = {
  noun: "role",
  add: one("role", "New role", (id) => experienceItem.parse({ id, title: "New role", company: "Company" })),
  fields: () => [
    { k: "title", label: "Role" },
    { k: "company", label: "Company" },
    { k: "period", label: "Period", hint: "e.g. Jun 2024 – Present" },
    { k: "location", label: "Location" },
    { k: "points", label: "Highlights", kind: "lines" }
  ]
};
const SKILLS: ListSpec = {
  noun: "skill group",
  add: one("skill group", "New group", (id) => skillGroup.parse({ id, title: "New group" })),
  fields: () => [
    { k: "title", label: "Group name" },
    { k: "items", label: "Skills", kind: "lines" }
  ]
};
const TEXT_ITEMS: ListSpec = {
  noun: "item",
  add: one("item", "New item", (id) => textItem.parse({ id, title: "New item" })),
  fields: () => [
    { k: "title", label: "Title" },
    { k: "text", label: "Text", kind: "long" },
    { k: "link", label: "Link", kind: "link" },
    img,
    { k: "tags", label: "Tags", kind: "lines" }
  ]
};
const PARAS: ListSpec = { noun: "paragraph", add: one("paragraph", "p", () => "New paragraph") };

const BY_TYPE: Record<SectionType, Spec[]> = {
  hero: [lead, img, { k: "scrollLabel", label: "Scroll hint text" }],
  about: [{ k: "paragraphs", label: "Paragraphs", kind: "list", list: PARAS }, img, ...btn, check("showSocial", "Show social links")],
  experience: [{ k: "items", label: "Roles", kind: "list", list: EXPERIENCE }],
  projects: [{ k: "limit", label: "How many to show", kind: "number", hint: "0 = all" }, ...btn, { k: "items", label: "Projects", kind: "list", list: PROJECTS }],
  skills: [lead, ...btn, { k: "groups", label: "Skill groups", kind: "list", list: SKILLS }],
  list: [{ k: "layout", label: "Layout", kind: "select", options: ["cards", "bullets", "chapters"] }, lead, img, { k: "items", label: "Items", kind: "list", list: TEXT_ITEMS }],
  text: [{ k: "body", label: "Text", kind: "long" }, img],
  contact: [{ k: "text", label: "Text", kind: "long" }, img, check("showForm", "Show contact form"), check("showEmail", "Show email"), check("showSocial", "Show social links")],
  cta: [lead, ...btn]
};

const COMMON: Spec[] = [
  { k: "title", label: "Title" },
  { k: "pretitle", label: "Small text above the title" },
  { k: "animation", label: "Animation", kind: "select", options: ANIMATIONS }
];

const sec = (label: string, type: SectionType, title: string, extra: object = {}) => ({
  label,
  title,
  make: (id: string) => sectionSchema.parse({ id, type, title, ...extra })
});

export const SECTIONS: ListSpec = {
  noun: "section",
  sub: (s: Section) => s.type,
  fields: (s: Section) => [...COMMON, ...BY_TYPE[s.type]],
  add: [
    sec("Hero (big intro)", "hero", "Hello"),
    sec("About", "about", "About"),
    sec("Experience", "experience", "Experience"),
    sec("Projects", "projects", "Projects"),
    sec("Skills", "skills", "Skills"),
    sec("List: education", "list", "Education", { layout: "cards" }),
    sec("List: certifications", "list", "Certifications", { layout: "cards" }),
    sec("List: achievements", "list", "Achievements", { layout: "bullets" }),
    sec("List: values", "list", "Values", { layout: "cards" }),
    sec("List: story", "list", "Story", { layout: "chapters" }),
    sec("Text", "text", "Text"),
    sec("Contact", "contact", "Contact"),
    sec("Call to action", "cta", "Call to action")
  ]
};

export const PAGES: ListSpec = {
  noun: "page",
  add: [], // pages have their own add form (title + address)
  sub: (p: Page) => `/${p.slug}`,
  canRemove: (p: Page) => p.slug !== "",
  fields: (p: Page) => [
    { k: "title", label: "Page title" },
    { k: "pretitle", label: "Small text above the title" },
    ...(p.slug === "" ? [] : [{ k: "slug", label: "Address", hint: "lowercase letters, digits, dashes; talks → /talks" }]),
    { k: "sections", label: "Sections", kind: "list" as const, list: SECTIONS }
  ]
};

export const NAV: ListSpec = {
  noun: "menu link",
  add: one("menu link", "New link", (id) => navItem.parse({ id, label: "New link", link: "/" })),
  fields: () => [
    { k: "label", label: "Text" },
    { k: "link", label: "Link", kind: "link" }
  ]
};

const SOCIAL: ListSpec = {
  noun: "social link",
  add: one("social link", "New link", (id) => socialItem.parse({ id, label: "New link", url: "https://" })),
  fields: () => [
    { k: "label", label: "Name" },
    { k: "url", label: "Link", kind: "link" }
  ]
};

export const SETTINGS: Spec[] = [
  { k: "siteTitle", label: "Site title (browser tab)" },
  { k: "metaDescription", label: "Short description for search engines", kind: "long" },
  { k: "ogImage", label: "Share image (shown when the site link is shared)", kind: "image" },
  { k: "logo", label: "Logo", kind: "image" },
  { k: "name", label: "Your name" },
  { k: "email", label: "Email" },
  { k: "location", label: "Location" },
  { k: "footerAbout", label: "Footer text", kind: "long" },
  { k: "headerButtonLabel", label: "Header button text" },
  { k: "headerButtonLink", label: "Header button link", kind: "link" },
  { k: "social", label: "Social links", kind: "list", list: SOCIAL }
];

export const THEME: Spec[] = [
  { k: "color1", label: "Main colour", kind: "color" },
  { k: "color2", label: "Dark colour", kind: "color" },
  { k: "color3", label: "Light colour", kind: "color" },
  { k: "bodyFont", label: "Body font", kind: "select", options: BODY_FONTS },
  { k: "displayFont", label: "Heading font", kind: "select", options: DISPLAY_FONTS }
];

export const ANIM: Spec[] = [check("enabled", "Animations on"), { k: "loader", label: "Page loader", kind: "select", options: LOADERS }];
