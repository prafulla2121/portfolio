import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CtaSection } from "../components/CtaSection";
import type { PortfolioData } from "../types/portfolio";

const PAGE_SIZE = 9;

export function ProjectsPage() {
  const data = useOutletContext<PortfolioData>();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.projects.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const projects = data.projects.slice(start, start + PAGE_SIZE);

  return (
    <section id="content" className="s-content">
      <section className="s-pageheader pageheader">
        <div className="row">
          <div className="column xl-12">
            <h1 className="page-title">
              <span className="page-title__small-type text-pretitle">My Projects</span>
              Recent Projects
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
                    <p>
                      {project.description}{" "}
                      <a href={project.liveUrl ?? project.repoUrl} target="_blank" rel="noreferrer">
                        Explore Project
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row navigation pagination">
          <div className="column xl-12">
            <nav className="pgn">
              <ul>
                <li>
                  <button className="pgn__prev" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                    Prev
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <li key={pageNumber}>
                    {pageNumber === page ? (
                      <span className="pgn__num current">{pageNumber}</span>
                    ) : (
                      <button className="pgn__num" onClick={() => setPage(pageNumber)}>
                        {pageNumber}
                      </button>
                    )}
                  </li>
                ))}
                <li>
                  <button className="pgn__next" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <CtaSection showLead={false} />
    </section>
  );
}
