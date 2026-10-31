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
                <p>{chapter.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="row width-narrower pagemain">
          <div className="column xl-12">
            <h2 className="u-add-bottom">Experience</h2>
            {data.experience.map((job) => (
              <div className="experience-item" key={job.company}>
                <h3 className="experience-item__title">{job.title} · {job.company}</h3>
                <p className="experience-item__meta">{job.period} · {job.location}</p>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h2 className="u-add-bottom">Education</h2>
            <ul>
              {data.education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

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
              I work end to end: understand the customer&apos;s problem, connect the AI to their real systems, and keep
              it running. At Satva Solutions I build MCP servers for accounting and e-commerce platforms and deploy them
              with Docker.
            </p>
          </div>
        </div>
      </section>

      <CtaSection />
    </section>
  );
}
