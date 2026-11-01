import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { Content, Page, ProjectItem, Section, TextItem } from "../../../shared/content";
import { ContactForm } from "./ContactForm";
import { cardHover, sectionMotion, type SectionMotion } from "./Motion";
import { Button, SmartLink } from "./SmartLink";
import { SocialIcons } from "./SocialIcons";

type Of<T extends Section["type"]> = Extract<Section, { type: T }>;
interface Props<T extends Section["type"]> {
  s: Of<T>;
  m: SectionMotion;
  doc: Content;
}

const visible = <T extends { visible: boolean }>(items: T[]) => items.filter((item) => item.visible);
const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const linkOr = (href: string, text: string) => (href ? <SmartLink href={href}>{text}</SmartLink> : text);

/** Hero, about, CTA and the home-style skills/projects (with a button) are full-width template sections;
 *  everything else is a block inside one shared s-pagecontent wrapper, like the old inner pages. */
const isStandalone = (s: Section) =>
  s.type === "hero" || s.type === "about" || s.type === "cta" || ((s.type === "skills" || s.type === "projects") && !!s.buttonLabel);

export function PageView({ page, doc }: { page: Page; doc: Content }) {
  const sections = visible(page.sections);
  const animate = doc.settings.animations.enabled;
  const blocks: ReactNode[] = [];
  let inner: ReactNode[] = [];
  const flush = () => {
    if (inner.length) blocks.push(<section key={`content-${blocks.length}`} className="s-pagecontent pagecontent">{inner}</section>);
    inner = [];
  };

  sections.forEach((s, i) => {
    const m = sectionMotion(animate ? s.animation : "none", s.type === "hero");
    const node = <SectionView key={s.id} s={s} m={m} doc={doc} nextId={sections[i + 1]?.id} />;
    if (isStandalone(s)) {
      flush();
      blocks.push(node);
    } else inner.push(node);
  });
  flush();

  return (
    <section id="content" className="s-content">
      {page.slug ? (
        <section className="s-pageheader pageheader">
          <div className="row">
            <div className="column xl-12">
              <h1 className="page-title">
                {page.pretitle ? <span className="page-title__small-type text-pretitle">{page.pretitle}</span> : null}
                {page.title}
              </h1>
            </div>
          </div>
        </section>
      ) : null}
      {blocks}
    </section>
  );
}

function SectionView({ s, m, doc, nextId }: { s: Section; m: SectionMotion; doc: Content; nextId?: string }) {
  switch (s.type) {
    case "hero":
      return <Hero s={s} m={m} doc={doc} nextId={nextId} />;
    case "about":
      return <About s={s} m={m} doc={doc} />;
    case "skills":
      return s.buttonLabel ? <SkillsHome s={s} m={m} doc={doc} /> : <SkillsGrid s={s} m={m} doc={doc} />;
    case "projects":
      return <Projects s={s} m={m} doc={doc} />;
    case "experience":
      return <Experience s={s} m={m} doc={doc} />;
    case "list":
      return <List s={s} m={m} doc={doc} />;
    case "text":
      return <Text s={s} m={m} doc={doc} />;
    case "contact":
      return <Contact s={s} m={m} doc={doc} />;
    case "cta":
      return <Cta s={s} m={m} doc={doc} />;
  }
}

function Hero({ s, m, doc, nextId }: Props<"hero"> & { nextId?: string }) {
  return (
    <section id={s.id} className="s-intro">
      <div className="row s-intro__content width-sixteen-col">
        <div className="column lg-12 s-intro__content-inner grid-block">
          <motion.div className="s-intro__content-text" {...m.list}>
            {s.pretitle ? <motion.div className="s-intro__content-pretitle text-pretitle" {...m.item}>{s.pretitle}</motion.div> : null}
            <motion.h1 className="s-intro__content-title" {...m.item}>
              {s.title.split("|").map((part, i) => (
                <span key={i}>
                  {i > 0 ? <br /> : null}
                  {part.trim()}
                </span>
              ))}
            </motion.h1>
            {s.lead ? <motion.p className="s-intro__content-lead" {...m.item}>{s.lead}</motion.p> : null}
          </motion.div>

          {s.image ? (
            <motion.div className="s-intro__content-media" {...m.block}>
              <div className="s-intro__content-media-inner">
                <img src={s.image} alt={doc.settings.name} />
                <div className="lines">
                  <span></span>
                </div>
              </div>
            </motion.div>
          ) : null}

          {nextId && s.scrollLabel ? (
            <div className="s-intro__scroll-down">
              <a href={`#${nextId}`}>
                <div className="scroll-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#97b34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="7 13 12 18 17 13"></polyline>
                    <line x1="12" y1="18" x2="12" y2="6"></line>
                  </svg>
                </div>
                <span>{s.scrollLabel}</span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function About({ s, m, doc }: Props<"about">) {
  return (
    <section id={s.id} className="s-about target-section">
      <div className="row s-about__content width-sixteen-col">
        <div className="column grid-block grid-section-split">
          {s.image ? <img src={s.image} alt="" aria-hidden="true" className="s-about__content-imgbg" /> : null}

          <motion.div className="section-header grid-section-split__header" {...m.block}>
            {s.pretitle ? <div className="text-pretitle">{s.pretitle}</div> : null}
            <h2 className="text-display-title">{s.title}</h2>
          </motion.div>

          <motion.div className="s-about__content-main grid-section-split__primary" {...m.block}>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="attention-getter">
                {p}
              </p>
            ))}
          </motion.div>

          <div className="s-about__content-btn grid-section-split__bottom">
            <Button label={s.buttonLabel} href={s.buttonLink} className="btn btn--stroke u-fullwidth" />
            {s.showSocial ? <SocialIcons social={doc.settings.social} className="s-about__social social-list" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Home-page split layout: header + button on one side, a list of items on the other. */
function Split({ s, m, children }: { s: Of<"skills"> | Of<"projects">; m: SectionMotion; children: ReactNode }) {
  return (
    <section id={s.id} className="s-expertise">
      <div className="row s-expertise__content width-sixteen-col">
        <div className="column xl-12 grid-block grid-section-split">
          <motion.div className="section-header grid-section-split__header" {...m.block}>
            {s.pretitle ? <div className="text-pretitle">{s.pretitle}</div> : null}
            <h2 className="text-display-title">{s.title}</h2>
            <div className="s-expertise__content-btn grid-section-split__bottom">
              <Button label={s.buttonLabel} href={s.buttonLink} className="btn btn--stroke u-fullwidth" />
            </div>
          </motion.div>

          <div className="s-expertise__content-main grid-section-split__primary">
            <motion.div className="grid-list-items list-items show-ctr" {...m.list}>
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsHome({ s, m }: Props<"skills">) {
  return (
    <Split s={s} m={m}>
      {visible(s.groups).map((group) => (
        <motion.div className="grid-list-items__item list-items__item" key={group.id} {...m.item}>
          <div className="grid-list-items__title list-items__item-header">
            <h3 className="list-items__item-title">{group.title}</h3>
          </div>
          <div className="grid-list-items__text list-items__item-text">
            <p>{group.items.join(", ")}.</p>
          </div>
        </motion.div>
      ))}
    </Split>
  );
}

/** Inner-page intro row: display title on the left, lead on the right. */
function Intro({ title, lead }: { title: string; lead?: ReactNode }) {
  if (!title && !lead) return null;
  return (
    <div className="row pageintro">
      <div className="column xl-6 lg-12">{title ? <h2 className="text-display-title">{title}</h2> : null}</div>
      <div className="column xl-6 lg-12 u-flexitem-x-right">{lead}</div>
    </div>
  );
}

function SkillsGrid({ s, m }: Props<"skills">) {
  return (
    <div id={s.id}>
      <Intro title={s.title} lead={s.lead ? <p className="lead">{s.lead}</p> : null} />
      <div className="row">
        <div className="column xl-12 grid-block">
          <motion.div className="grid-full grid-list-items list-items show-ctr" {...m.list}>
            {visible(s.groups).map((group) => (
              <motion.div className="grid-list-items__item list-items__item" key={group.id} {...m.item}>
                <div className="list-items__item-header">
                  <h3 className="list-items__item-title">{group.title}</h3>
                </div>
                <div className="list-items__item-text">
                  <ul className="list-services">
                    {group.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return tags.length ? (
    <ul className="tech-tags" aria-label="Tech stack">
      {tags.map((tag, i) => (
        <li key={i}>{tag}</li>
      ))}
    </ul>
  ) : null;
}

const Thumb = ({ src, alt }: { src: string; alt: string }) =>
  src ? <img className="card-img" src={src} alt={alt} loading="lazy" decoding="async" /> : null;

function Projects({ s, m, doc }: Props<"projects">) {
  // An empty list borrows the first projects section that has items (the home "featured" block).
  const source = s.items.length
    ? s.items
    : (doc.pages.flatMap((p) => p.sections).find((x): x is Of<"projects"> => x.type === "projects" && x.items.length > 0)?.items ?? []);
  const shown = visible(source);
  const items = s.limit > 0 ? shown.slice(0, s.limit) : shown;
  const mainLink = (p: ProjectItem) => p.liveUrl || p.repoUrl;
  const mainLabel = (p: ProjectItem) => (p.liveUrl ? "Live demo" : "View code on GitHub");

  if (s.buttonLabel) {
    return (
      <Split s={s} m={m}>
        {items.map((p) => (
          <motion.div className="grid-list-items__item list-items__item" key={p.id} {...m.item} {...cardHover}>
            <Thumb src={p.image} alt={p.title} />
            <div className="grid-list-items__title list-items__item-header">
              <h3 className="list-items__item-title">{linkOr(p.repoUrl || p.liveUrl, p.title)}</h3>
            </div>
            <div className="grid-list-items__text list-items__item-text">
              <p>{p.description}</p>
              <Tags tags={p.tech} />
            </div>
          </motion.div>
        ))}
      </Split>
    );
  }

  return (
    <div id={s.id}>
      <Intro title={s.title} />
      <div className="row">
        <div className="column xl-12 grid-block">
          <motion.div className="grid-full grid-list-items" {...m.list}>
            {items.map((p) => (
              <motion.div className="grid-list-items__item blog-card" key={p.id} {...m.item} {...cardHover}>
                <Thumb src={p.image} alt={p.title} />
                <div className="blog-card__header">
                  {p.category ? <div className="blog-card__cat-links">{linkOr(p.repoUrl, p.category)}</div> : null}
                  <h3 className="blog-card__title">{linkOr(p.repoUrl, p.title)}</h3>
                </div>
                <div className="blog-card__text">
                  <p>{p.description}</p>
                  <Tags tags={p.tech} />
                  {mainLink(p) ? <SmartLink href={mainLink(p)}>{mainLabel(p)} →</SmartLink> : null}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/** Narrow content row used by experience, lists and text. */
function Main({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div id={id} className="row width-narrower pagemain">
      <div className="column xl-12">{children}</div>
    </div>
  );
}

function Experience({ s, m }: Props<"experience">) {
  const items = visible(s.items);
  const sameCompany = (a?: { company: string }, b?: { company: string }) =>
    !!a && !!b && a.company.trim().toLowerCase() === b.company.trim().toLowerCase();
  return (
    <Main id={s.id}>
      {s.title ? <motion.h2 className="u-add-bottom" {...m.block}>{s.title}</motion.h2> : null}
      <motion.div {...m.list}>
        {items.map((job, i) => {
          const meta = [job.period, job.location].filter(Boolean).join(" · ");
          return (
            <motion.div className="experience-item" key={job.id} {...m.item}>
              <h3 className="experience-item__title">
                {job.title} · {job.company}
              </h3>
              {meta ? <p className="experience-item__meta">{meta}</p> : null}
              {/* newest first: a role followed by an older role at the same company was a promotion */}
              {sameCompany(job, items[i + 1]) ? <p className="experience-item__promoted">Promoted</p> : null}
              {job.points.length ? (
                <ul>
                  {job.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </motion.div>
          );
        })}
      </motion.div>
    </Main>
  );
}

function ItemBody({ item }: { item: TextItem }) {
  return (
    <>
      <Thumb src={item.image} alt={item.title} />
      {item.text ? <p>{item.text}</p> : null}
      <Tags tags={item.tags} />
    </>
  );
}

function List({ s, m }: Props<"list">) {
  const items = visible(s.items);

  if (s.layout === "chapters") {
    return (
      <div id={s.id} className="row pageintro">
        <motion.div className="column xl-6 lg-12" {...m.block}>
          <h2 className="text-display-title">
            {s.pretitle || s.title}
            {s.image ? <img src={s.image} alt="" loading="lazy" decoding="async" /> : null}
          </h2>
        </motion.div>
        <motion.div className="column xl-6 lg-12 u-flexitem-x-right" {...m.list}>
          {s.pretitle && s.title ? <h2>{s.title}</h2> : null}
          {s.lead ? <p className="lead">{s.lead}</p> : null}
          {items.map((item) => (
            <motion.div key={item.id} {...m.item}>
              {item.title ? <h6 className="list-items__item-small-title">{linkOr(item.link, item.title)}</h6> : null}
              <ItemBody item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <Main id={s.id}>
      {s.title ? <motion.h2 className="u-add-bottom" {...m.block}>{s.title}</motion.h2> : null}
      {s.lead ? <p className="lead">{s.lead}</p> : null}
      {s.layout === "bullets" ? (
        <motion.ul {...m.list}>
          {items.map((item) => (
            <motion.li key={item.id} {...m.item}>
              {item.title ? <strong>{linkOr(item.link, item.title)}</strong> : null}
              {item.title && item.text ? <br /> : null}
              {item.text}
              <Tags tags={item.tags} />
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.div className="grid-list-items list-items" {...m.list}>
          {items.map((item) => (
            <motion.div className="grid-list-items__item list-items__item u-remove-bottom" key={item.id} {...m.item}>
              <div className="list-items__item-header">
                <h6 className="list-items__item-small-title">{linkOr(item.link, item.title)}</h6>
              </div>
              <ItemBody item={item} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </Main>
  );
}

function Text({ s, m }: Props<"text">) {
  return (
    <Main id={s.id}>
      <motion.div {...m.block}>
        {s.pretitle ? <div className="text-pretitle">{s.pretitle}</div> : null}
        {s.title ? <h2>{s.title}</h2> : null}
        {paragraphs(s.body).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {s.image ? (
          <figure>
            <img src={s.image} alt={s.title} loading="lazy" decoding="async" />
          </figure>
        ) : null}
      </motion.div>
    </Main>
  );
}

function Contact({ s, m, doc }: Props<"contact">) {
  const { email } = doc.settings;
  const social = visible(doc.settings.social);
  return (
    <div id={s.id}>
      <Intro title={s.title} lead={s.text ? <p className="lead">{s.text}</p> : null} />
      {s.image ? (
        <div className="row pagemedia">
          <motion.div className="column xl-12" {...m.block}>
            <figure className="page-media">
              <img src={s.image} alt="" loading="lazy" decoding="async" />
            </figure>
          </motion.div>
        </div>
      ) : null}
      <div className="row width-narrower pagemain">
        <motion.div className="column xl-12" {...m.block}>
          <div className="row">
            <div className="column xl-6 md-12 contact-cta">
              {s.showForm ? (
                <ContactForm email={s.showEmail ? email : ""} />
              ) : s.showEmail && email ? (
                <a href={`mailto:${email}`} className="btn btn--primary u-fullwidth contact-btn">
                  Send Me An Email
                </a>
              ) : null}
            </div>

            <div className="column xl-5 md-12 u-flexitem-x-right">
              {s.showSocial && social.length ? (
                <div className="contact-block">
                  <h6>Follow On Social</h6>
                  <ul className="contact-list">
                    {social.map((item) => (
                      <li key={item.id}>
                        <SmartLink href={item.url}>{item.label}</SmartLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {s.showEmail && email ? (
                <div className="contact-block">
                  <h6>Email</h6>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Cta({ s, m }: Props<"cta">) {
  return (
    <section id={s.id} className="s-cta">
      <div className="row row-x-center text-center">
        <motion.div className="column xl-8 lg-12" {...m.block}>
          <div className="s-cta__content">
            {s.pretitle ? <div className="text-pretitle">{s.pretitle}</div> : null}
            <h2 className="text-display-title">{s.title}</h2>
            {s.lead ? <p className="lead">{s.lead}</p> : null}
            <Button label={s.buttonLabel} href={s.buttonLink} className="btn btn--primary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
