import { useOutletContext } from "react-router-dom";
import { CtaSection } from "../components/CtaSection";
import type { PortfolioData } from "../types/portfolio";

export function AboutPage() {
  const data = useOutletContext<PortfolioData>();

  return (
    <section id="content" className="s-content">
      <section className="s-pageheader pageheader">
        <div className="row">
          <div className="column xl-12">
            <h1 className="page-title">
              <span className="page-title__small-type text-pretitle">About</span>
              Hi, I&apos;m Prafulla
            </h1>
          </div>
        </div>
      </section>

      <section className="s-pagecontent pagecontent">
        <div className="row pageintro">
          <div className="column xl-6 lg-12">
            <h2 className="text-display-title">
              A Glimpse into Who I Am
              <img src="/about-images/image (1).png" alt="About Prafulla" />
            </h2>
          </div>
          <div className="column xl-6 lg-12 u-flexitem-x-right">
            <h2>{data.aboutStory.title}</h2>
            {data.aboutStory.chapters.map((chapter) => (
              <div key={chapter.heading}>
                <h6 className="list-items__item-small-title">{chapter.heading}</h6>
                <p style={{ textAlign: "justify" }}>{chapter.text}</p>
              </div>
            ))}
          </div>
        </div>

     

        <div className="row width-narrower pagemain">
          <div className="column xl-12" style={{ textAlign: "justify" }}>
            <h2 className="u-add-bottom">My Values &amp; Beliefs</h2>

            <div className="grid-list-items list-items">
              {data.values.map((value) => (
                <div className="grid-list-items__item list-items__item u-remove-bottom" key={value.title}>
                  <div className="list-items__item-header">
                    <h6 className="list-items__item-small-title">{value.title}</h6>
                  </div>
                  <p>{value.text}</p>
                </div>
              ))}
            </div>

            <h2>Why Work With Me</h2>
            <p>
              I bring together AI/ML implementation, backend problem-solving, and frontend delivery in one workflow.
              My experience includes working as a Python &amp; Web Scraping Intern at TSS in Rajkot, where I built
              reusable data collection pipelines and improved ML-ready data quality.
            </p>

            <p>
              My focus is on modern AI engineering: retrieval systems, agentic workflows, cloud deployment, scalable
              APIs, and interfaces that make advanced tooling easier to use.
            </p>
          </div>
        </div>
      </section>

      <CtaSection />
    </section>
  );
}
