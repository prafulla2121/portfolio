import { Link } from "react-router-dom";

interface CtaSectionProps {
  showLead?: boolean;
}

export function CtaSection({ showLead = true }: CtaSectionProps) {
  return (
    <section id="cta" className="s-cta">
      <div className="row row-x-center text-center">
        <div className="column xl-8 lg-12">
          <div className="s-cta__content">
            <h2 className="text-display-title">Need AI that works with your real data?</h2>
            {showLead ? (
              <p className="lead">
                MCP servers, RAG pipelines and AI agents — built, deployed and kept running.
              </p>
            ) : null}
            <Link to="/contact" className="btn btn--primary">
              Let&apos;s Work Together
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
