import { useOutletContext } from "react-router-dom";
import { CtaSection } from "../components/CtaSection";
import type { PortfolioData } from "../types/portfolio";

export function ProjectsPage() {
  const data = useOutletContext<PortfolioData>();
  const projects = data.projects;

  return (
    <section id="content" className="s-content">
      <section className="s-pageheader pageheader">
        <div className="row">
          <div className="column xl-12">
            <h1 className="page-title">
              <span className="page-title__small-type text-pretitle">My Projects</span>
              Selected Work
            </h1>
          </div>
        </div>
      </section>

      <section className="s-pagecontent pagecontent">
        <div className="row">
          <div className="column xl-12 grid-block">
            <div className="grid-full grid-list-items">
              {projects.map((project) => (
                <div className="grid-list-items__item blog-card" key={project.title}>
                  <div className="blog-card__header">
                    <div className="blog-card__cat-links">
                      <a href={project.repoUrl} target="_blank" rel="noreferrer">
                        {project.category}
                      </a>
                    </div>
                    <h3 className="blog-card__title">
                      <a href={project.repoUrl} target="_blank" rel="noreferrer">
                        {project.title}
                      </a>
                    </h3>
                  </div>
                  <div className="blog-card__text">
                    <p>{project.description}</p>
                    <ul className="tech-tags" aria-label="Tech stack">
                      {project.tech.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                    <a href={project.liveUrl ?? project.repoUrl} target="_blank" rel="noreferrer">
                      {project.liveUrl ? "Live demo" : "View code on GitHub"} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      <CtaSection showLead={false} />
    </section>
  );
}
