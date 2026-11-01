import { useEffect } from "react";
import { Link, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Settings } from "../../../shared/content";
import { SmartLink } from "./SmartLink";
import { SocialIcons } from "./SocialIcons";

interface LayoutProps {
  settings: Settings;
  /** false until the content request settles (or 1.2 s pass); drives the loader overlay */
  ready: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

export function Layout({ settings, ready, menuOpen, onToggleMenu, onCloseMenu }: LayoutProps) {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();
  const nav = settings.nav.filter((item) => item.visible);
  const loader = settings.animations.loader;

  // close the mobile menu after navigating
  useEffect(() => onCloseMenu(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="page" className="s-pagewrap">
      <AnimatePresence>
        {!ready && loader !== "none" ? (
          <motion.div
            key="loader"
            className="site-loader"
            aria-hidden="true"
            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.4 } }}
          >
            {loader === "spinner" ? <span className="site-loader__spinner" /> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header className="s-header">
        <div className="row s-header__inner width-sixteen-col">
          <div className="s-header__block">
            <div className="s-header__logo">
              <Link className="logo" to="/" onClick={onCloseMenu}>
                <img src={settings.logo || "/images/logo.svg"} alt={`${settings.name}, home`} />
              </Link>
            </div>

            <a
              className={`s-header__menu-toggle ${menuOpen ? "is-clicked" : ""}`}
              href="#0"
              aria-expanded={menuOpen}
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
              {nav.map((item) => (
                <li key={item.id}>
                  <SmartLink href={item.link} onClick={onCloseMenu}>
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>

            {settings.headerButtonLabel && settings.headerButtonLink ? (
              <div className="s-header__contact">
                <SmartLink href={settings.headerButtonLink} className="btn btn--primary s-header__contact-btn" onClick={onCloseMenu}>
                  {settings.headerButtonLabel}
                </SmartLink>
              </div>
            ) : null}
          </nav>
        </div>
      </header>

      {/* Page transition: the old page fades out (short), the new one settles in. */}
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
            <h3>About {settings.name.split(" ")[0]}</h3>
            {settings.footerAbout ? <p>{settings.footerAbout}</p> : null}
          </div>

          <div className="column xl-3 lg-6 md-12 s-footer__block s-footer__site-links">
            <h3>Site Links</h3>
            <ul className="link-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              {nav.map((item) => (
                <li key={item.id}>
                  <SmartLink href={item.link}>{item.label}</SmartLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="column xl-3 lg-6 md-12 tab-12 s-footer__block s-footer__newsletter">
            <h3>Contact</h3>
            <p>
              {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
              {settings.email && settings.location ? <br /> : null}
              {settings.location}
            </p>
          </div>
        </div>

        <div className="row s-footer__bottom">
          <div className="column xl-6 lg-12">
            <SocialIcons social={settings.social} className="s-footer__social social-list" />
          </div>
          <div className="column xl-6 lg-12">
            <p className="ss-copyright">
              <span>© {new Date().getFullYear()} {settings.name}</span>
            </p>
          </div>

          <div className="ss-go-top">
            <a title="Back to Top" href="#top">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

