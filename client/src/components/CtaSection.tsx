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
            <h2 className="text-display-title">Ready to bring your ideas to life? Let&apos;s create something amazing together.</h2>
            {showLead ? (
              <p className="lead">
                Whether it&apos;s a website, a software solution, or a modern AI product, I&apos;m here to help you turn your
                vision into reality. Let&apos;s collaborate and make it happen with precision, creativity, and purpose.
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
