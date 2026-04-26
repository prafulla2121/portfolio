import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CtaSection } from "../components/CtaSection";
import type { PortfolioData } from "../types/portfolio";

const skillSlides = [
  {
    title: "Web Design",
    mastery: "90%",
    icon: "/images/vision.svg",
    text:
      "Mastery in HTML5 and CSS3, specializing in crafting responsive and visually appealing designs. My expertise ensures cross-browser compatibility and adherence to modern UI/UX principles. Proficiency: 90%."
  },
  {
    title: "Frontend Development",
    mastery: "85%",
    icon: "/images/flash.svg",
    text:
      "Extensive experience with JavaScript, including frameworks like React.js, to build dynamic, interactive web applications. Focused on optimizing performance and enhancing user engagement. Proficiency: 85%."
  },
  {
    title: "Backend Development",
    mastery: "80%",
    icon: "/images/chain.svg",
    text:
      "Skilled in developing backend solutions using Node.js, Express.js, and Python APIs. My focus is on building secure, scalable APIs and server-side logic. Proficiency: 80%."
  },
  {
    title: "Database Management",
    mastery: "85%",
    icon: "/images/terra.svg",
    text:
      "Expertise in MySQL, PostgreSQL, MongoDB, and vector databases, focusing on performance optimization, structured design, and secure data handling. Proficiency: 85%."
  }
];

export function SkillsPage() {
  const data = useOutletContext<PortfolioData>();
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleSlides = skillSlides.slice(activeIndex, activeIndex + 3);

  return (
    <section id="content" className="s-content">
      <section className="s-pageheader pageheader">
        <div className="row">
          <div className="column xl-12">
            <h1 className="page-title">
              <span className="page-title__small-type text-pretitle">Skills</span>
              A Fusion of Technology and Creativity
            </h1>
          </div>
        </div>
      </section>

      <section className="s-pagecontent pagecontent">
        <div className="row pageintro">
          <div className="column xl-6 lg-12">
            <h2 className="text-display-title">Meet Prafulla - Innovator, Creator, and Visionary</h2>
          </div>
          <div className="column xl-6 lg-12 u-flexitem-x-right">
            <p className="lead">
              <img src="/service-images/face-swap75.png" srcSet="/service-images/face-swap75.png 1x, /service-images/face-swap75.png 2x" alt="Skills" />
            </p>
          </div>
        </div>

        <div className="row">
          <div className="column xl-12 grid-block">
            <div className="grid-full grid-list-items list-items show-ctr">
              {data.skillGroups.map((group) => (
                <div className="grid-list-items__item list-items__item" key={group.title}>
                  <div className="list-items__item-header">
                    <h3 className="list-items__item-title">{group.title}</h3>
                  </div>
                  <div className="list-items__item-text">
                    <ul className="list-services">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="s-testimonials">
        <div className="s-testimonials__header row row-x-center text-center">
          <div className="column xl-8 lg-12">
            <p className="text-pretitle">My Skills</p>
            <h3>Expertise Across Multiple Domains</h3>
          </div>
        </div>

        <div className="row s-testimonials__content" style={{ textAlign: "justify" }}>
          <div className="column xl-12 testimonials">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "4rem" }}>
              {visibleSlides.map((slide) => (
                <div key={slide.title}>
                  <p>{slide.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", marginTop: "2.4rem" }}>
                    <img src={slide.icon} alt={slide.title} style={{ width: "64px", height: "64px", objectFit: "contain" }} />
                    <div>
                      <h5 style={{ margin: 0 }}>{slide.title}</h5>
                      <p style={{ margin: "0.4rem 0 0", color: "#7f8080" }}>Mastery: {slide.mastery}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "1.4rem", marginTop: "4rem" }}>
              {skillSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(Math.min(index, skillSlides.length - 3))}
                  aria-label={`Go to skills slide ${index + 1}`}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    border: "none",
                    background: index === activeIndex ? "#181818" : "#a3a5a5",
                    padding: 0
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaSection showLead={false} />
    </section>
  );
}
