import { useEffect } from "react";
import { Link, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
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
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" }
];

export function Layout({ data, menuOpen, onToggleMenu, onCloseMenu }: LayoutProps) {
  const { profile } = data;
  const { pathname } = useLocation();
  const outlet = useOutlet(data);

  // close the mobile menu after navigating
  useEffect(() => onCloseMenu(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* Page transition: the old page fades out (short), the new one settles in. AnimatePresence keeps the old element while it exits. */}
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>

      <footer className="s-footer">
        <div className="row s-footer__content">
          <div className="column xl-6 lg-6 md-12 s-footer__block s-footer__about">
            <h3>About Prafulla</h3>
            <p>{profile.summary}</p>
          </div>

          <div className="column xl-3 lg-6 md-12 s-footer__block s-footer__site-links">
            <h3>Site Links</h3>
            <ul className="link-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/skills">Skills</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="column xl-3 lg-6 md-12 tab-12 s-footer__block s-footer__newsletter">
            <h3>Contact</h3>
            <p>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <br />
              {profile.location}
            </p>
          </div>
        </div>

        <div className="row s-footer__bottom">
          <div className="column xl-6 lg-12">
            <SocialIcons profile={profile} className="s-footer__social social-list" />
          </div>
          <div className="column xl-6 lg-12">
            <p className="ss-copyright">
              <span>© {new Date().getFullYear()} Prafulla Purohit</span>
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
