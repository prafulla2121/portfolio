import { useOutletContext } from "react-router-dom";
import type { PortfolioData } from "../types/portfolio";

export function ContactPage() {
  const data = useOutletContext<PortfolioData>();

  return (
    <section id="content" className="s-content">
      <section className="s-pageheader pageheader">
        <div className="row">
          <div className="column xl-12">
            <h1 className="page-title">
              <span className="page-title__small-type text-pretitle">Contact</span>
              Get In Touch
            </h1>
          </div>
        </div>
      </section>

      <section className="s-pagecontent pagecontent">
        <div className="row pageintro">
          <div className="column xl-6 lg-12">
            <h2 className="text-display-title">Let&apos;s Create Something Extraordinary Together.</h2>
          </div>
          <div className="column xl-6 lg-12 u-flexitem-x-right">
            <p className="lead" style={{ textAlign: "justify" }}>
              Every great story begins with a spark of connection. Reach out, and let&apos;s transform ideas into reality,
              crafting experiences that resonate and solutions that inspire.
            </p>
          </div>
        </div>

        <div className="row pagemedia">
          <div className="column xl-12">
            <figure className="page-media">
              <img
                src="/contact-images/contact-1200.jpg"
                srcSet="/contact-images/contact-2400.jpg 2400w, /contact-images/contact-1200.jpg 1200w, /contact-images/contact-600.jpg 600w"
                sizes="(max-width: 2400px) 100vw, 2400px"
                alt="Contact"
              />
            </figure>
          </div>
        </div>

        <div className="row width-narrower pagemain">
          <div className="column xl-12">
            <h2>Let&apos;s Work Together</h2>

            <div className="row">
              <div className="column xl-6 md-12 contact-cta">
                <p>{data.profile.summary}</p>
                <a href={`mailto:${data.profile.email}`} className="btn btn--primary u-fullwidth contact-btn">
                  Send Me An Email
                </a>
              </div>

              <div className="column xl-5 md-12 u-flexitem-x-right">
                <div className="contact-block">
                  <h6>Follow On Social</h6>
                  <ul className="contact-list">
                    <li><a href={data.profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
                    <li><a href={data.profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
                    <li><a href={data.profile.twitter} target="_blank" rel="noreferrer">X / Twitter</a></li>
                    <li><a href={data.profile.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
                  </ul>
                </div>

                <div className="contact-block">
                  <h6>Email</h6>
                  <a href={`mailto:${data.profile.email}`}>{data.profile.email}</a>
                </div>

                <div className="contact-block">
                  <h6>Phone</h6>
                  <ul className="contact-list">
                    <li><a href={`tel:${data.profile.phone.replace(/\s+/g, "")}`}>{data.profile.phone}</a></li>
                    <li><a href={`tel:${data.profile.altPhone.replace(/\s+/g, "")}`}>{data.profile.altPhone}</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
