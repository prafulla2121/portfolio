import { Link, Outlet } from "react-router-dom";
import type { PortfolioData } from "../types/portfolio";
import { SocialIcons } from "./SocialIcons";

interface LayoutProps {
  data: PortfolioData;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

const navItems = [
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Project" },
  { to: "/contact", label: "Contact" }
];

export function Layout({ data, menuOpen, onToggleMenu, onCloseMenu }: LayoutProps) {
  const { profile } = data;

  return (
    <div id="page" className="s-pagewrap">
      <header className="s-header">
        <div className="row s-header__inner width-sixteen-col">
          <div className="s-header__block">
            <div className="s-header__logo">
              <Link className="logo" to="/" onClick={onCloseMenu}>
                <img src="/images/logo.svg" alt="Homepage" />
              </Link>
            </div>

            <a
              className={`s-header__menu-toggle ${menuOpen ? "is-clicked" : ""}`}
              href="#0"
              onClick={(event) => {
                event.preventDefault();
                onToggleMenu();
              }}
            >
              <span>Menu</span>
            </a>
          </div>

          <nav className="s-header__nav">
            <ul className="s-header__menu-links">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={onCloseMenu}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="s-header__contact">
              <Link to="/contact" className="btn btn--primary s-header__contact-btn" onClick={onCloseMenu}>
                Let's Work Together
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <Outlet context={data} />

      <footer className="s-footer">
        <div className="row s-footer__content">
          <div className="column xl-6 lg-6 md-12 s-footer__block s-footer__about">
            <h3>About Prafulla</h3>
            <p>
              {profile.summary} I am actively building my skills in web development, machine learning, and modern AI
              systems while creating practical full-stack applications.
            </p>
          </div>

          <div className="column xl-3 lg-6 md-12 s-footer__block s-footer__site-links">
            <h3>Site Links</h3>
            <ul className="link-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/skills">Skills</Link></li>
              <li><Link to="/projects">project</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="column xl-3 lg-6 md-12 tab-12 s-footer__block s-footer__newsletter">
            <h3>Newsletter</h3>
            <p>
              Stay updated with the latest news on web development, machine learning, AI/ML, and project updates.
              Subscribe to stay connected and informed about my journey and the tech world.
            </p>

            <div className="subscribe-form">
              <form className="mc-form">
                <input
                  type="email"
                  className="u-fullwidth text-center"
                  placeholder="Your Email Address"
                  readOnly
                />
                <input type="submit" value="Subscribe" className="btn btn--primary btn--small u-fullwidth" />
                <div className="mc-status"></div>
              </form>
            </div>
          </div>
        </div>

        <div className="row s-footer__bottom">
          <div className="column xl-6 lg-12">
            <SocialIcons profile={profile} className="s-footer__social social-list" />
          </div>
          <div className="column xl-6 lg-12">
            <p className="ss-copyright">
              <span>© Copyright Prafulla 2026</span>
            </p>
          </div>

          <div className="ss-go-top">
            <a title="Back to Top" href="#top">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 11 12 6 7 11"></polyline>
                <line x1="12" y1="18" x2="12" y2="6"></line>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
