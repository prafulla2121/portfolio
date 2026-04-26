import { Link, useOutletContext } from "react-router-dom";
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
            <div className="s-intro__content-text">
              <div className="s-intro__content-pretitle text-pretitle">Hello, I&apos;m Prafulla</div>
              <h1 className="s-intro__content-title">
                Full Stack Developer
                <br />
                Crafting semless
                <br />
                web expriences
                <br />
              </h1>
            </div>

            <div className="s-intro__content-media">
              <div className="s-intro__content-media-inner">
                <img src="/images/face-swap7.png" srcSet="/images/face-swap7.png 1x, /images/face-swap7.png 2x" alt={data.profile.name} />
                <div className="lines">
                  <span></span>
                </div>
              </div>
            </div>

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

            <div className="section-header grid-section-split__header">
              <div className="text-pretitle">About</div>
              <h2 className="text-display-title">Empowering Ideas, Building Connections, and Embracing Growth</h2>
            </div>

            <div className="s-about__content-main grid-section-split__primary">
              {data.profile.about.map((paragraph) => (
                <p key={paragraph} className="attention-getter" style={{ textAlign: "justify" }}>
                  {paragraph}
                </p>
              ))}
            </div>

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
            <div className="section-header grid-section-split__header">
              <div className="text-pretitle">Expertise</div>
              <h2 className="text-display-title">
                My key areas of expertise.
                <br />
                <br />
                <img src="/images/Screenshot 2024-12-31 121236.png" srcSet="/images/Screenshot 2024-12-31 121236.png 1x, /images/Screenshot 2024-12-31 121236.png 2x" alt="" />

                <div className="s-expertise__content-btn grid-section-split__bottom">
                  <Link to="/skills" className="btn btn--stroke u-fullwidth">
                    View All Services
                  </Link>
                </div>
              </h2>
            </div>

            <div className="s-expertise__content-main grid-section-split__primary">
              <div className="grid-list-items list-items show-ctr">
                {data.skillGroups.slice(0, 5).map((group) => (
                  <div className="grid-list-items__item list-items__item" key={group.title}>
                    <div className="grid-list-items__title list-items__item-header">
                      <h3 className="list-items__item-title">{group.title}</h3>
                    </div>
                    <div className="grid-list-items__text list-items__item-text" style={{ textAlign: "justify" }}>
                      <p>{group.items.join(", ")}.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </section>
  );
}
