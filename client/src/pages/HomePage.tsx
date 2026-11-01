import { Link, useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import { cardHover, heroItem, heroParent, reveal, staggerItem, staggerOnView } from "../components/Motion";
import { CtaSection } from "../components/CtaSection";
import { SocialIcons } from "../components/SocialIcons";
import type { PortfolioData } from "../types/portfolio";

export function HomePage() {
  const data = useOutletContext<PortfolioData>();

  return (
    <section id="content" className="s-content">
      <section id="intro" className="s-intro">
        <div className="row s-intro__content width-sixteen-col">
          <div className="column lg-12 s-intro__content-inner grid-block">
            <motion.div className="s-intro__content-text" variants={heroParent} initial="hidden" animate="shown">
              <motion.div className="s-intro__content-pretitle text-pretitle" variants={heroItem}>Hello, I&apos;m Prafulla</motion.div>
              <motion.h1 className="s-intro__content-title" variants={heroItem}>
                Forward Deployed /{" "}
                <br />
                Applied AI Engineer
              </motion.h1>
              <motion.p className="s-intro__content-lead" variants={heroItem}>{data.profile.tagline}</motion.p>
            </motion.div>

            <motion.div
              className="s-intro__content-media"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="s-intro__content-media-inner">
                <img src="/images/face-swap7.png" srcSet="/images/face-swap7.png 1x, /images/face-swap7.png 2x" alt={data.profile.name} />
                <div className="lines">
                  <span></span>
                </div>
              </div>
            </motion.div>

            <div className="s-intro__scroll-down">
              <a href="#about">
                <div className="scroll-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#97b34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="7 13 12 18 17 13"></polyline>
                    <line x1="12" y1="18" x2="12" y2="6"></line>
                  </svg>
                </div>
                <span>Scroll for more</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="s-about target-section">
        <div className="row s-about__content width-sixteen-col">
          <div className="column grid-block grid-section-split">
            <img src="/images/geometric_shape.svg" alt="" className="s-about__content-imgbg" />

            <motion.div className="section-header grid-section-split__header" {...reveal}>
              <div className="text-pretitle">About</div>
              <h2 className="text-display-title">AI agents that work with real business systems</h2>
            </motion.div>

            <motion.div className="s-about__content-main grid-section-split__primary" {...reveal}>
              {data.profile.about.map((paragraph) => (
                <p key={paragraph} className="attention-getter">
                  {paragraph}
                </p>
              ))}
            </motion.div>

            <div className="s-about__content-btn grid-section-split__bottom">
              <Link to="/about" className="btn btn--stroke u-fullwidth">
                More About Me
              </Link>
              <SocialIcons profile={data.profile} className="s-about__social social-list" />
            </div>
          </div>
        </div>
      </section>

      <section id="expertise" className="s-expertise">
        <div className="row s-expertise__content width-sixteen-col">
          <div className="column xl-12 grid-block grid-section-split">
            <motion.div className="section-header grid-section-split__header" {...reveal}>
              <div className="text-pretitle">Expertise</div>
              <h2 className="text-display-title">
                My key areas of expertise.
              </h2>
              <div className="s-expertise__content-btn grid-section-split__bottom">
                <Link to="/skills" className="btn btn--stroke u-fullwidth">
                  View All Skills
                </Link>
              </div>
            </motion.div>

            <div className="s-expertise__content-main grid-section-split__primary">
              <motion.div className="grid-list-items list-items show-ctr" {...staggerOnView}>
                {data.skillGroups.slice(0, 4).map((group) => (
                  <motion.div className="grid-list-items__item list-items__item" key={group.title} variants={staggerItem}>
                    <div className="grid-list-items__title list-items__item-header">
                      <h3 className="list-items__item-title">{group.title}</h3>
                    </div>
                    <div className="grid-list-items__text list-items__item-text">
                      <p>{group.items.join(", ")}.</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="s-expertise">
        <div className="row s-expertise__content width-sixteen-col">
          <div className="column xl-12 grid-block grid-section-split">
            <motion.div className="section-header grid-section-split__header" {...reveal}>
              <div className="text-pretitle">Selected Work</div>
              <h2 className="text-display-title">Projects I have built and shipped.</h2>
              <div className="s-expertise__content-btn grid-section-split__bottom">
                <Link to="/projects" className="btn btn--stroke u-fullwidth">
                  View All Projects
                </Link>
              </div>
            </motion.div>

            <div className="s-expertise__content-main grid-section-split__primary">
              <motion.div className="grid-list-items list-items show-ctr" {...staggerOnView}>
                {data.projects.slice(0, 4).map((project) => (
                  <motion.div className="grid-list-items__item list-items__item" key={project.id} variants={staggerItem} {...cardHover}>
                    <div className="grid-list-items__title list-items__item-header">
                      <h3 className="list-items__item-title">
                        <a href={project.repoUrl} target="_blank" rel="noreferrer">
                          {project.title}
                        </a>
                      </h3>
                    </div>
                    <div className="grid-list-items__text list-items__item-text">
                      <p>{project.description}</p>
                      <ul className="tech-tags" aria-label="Tech stack">
                        {project.tech.map((tech) => (
                          <li key={tech}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </section>
  );
}
