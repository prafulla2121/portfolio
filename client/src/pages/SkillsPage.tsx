import { useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import { staggerItem, staggerOnView } from "../components/Motion";
import { CtaSection } from "../components/CtaSection";
import type { PortfolioData } from "../types/portfolio";

export function SkillsPage() {
  const data = useOutletContext<PortfolioData>();
  return (
    <section id="content" className="s-content">
      <section className="s-pageheader pageheader">
        <div className="row">
          <div className="column xl-12">
            <h1 className="page-title">
              <span className="page-title__small-type text-pretitle">Skills</span>
              What I Work With
            </h1>
          </div>
        </div>
      </section>

      <section className="s-pagecontent pagecontent">
        <div className="row pageintro">
          <div className="column xl-6 lg-12">
            <h2 className="text-display-title">Applied AI, from API to agent</h2>
          </div>
          <div className="column xl-6 lg-12 u-flexitem-x-right">
            <p className="lead">
              Tools I have used in real projects: MCP servers, RAG pipelines, agent frameworks, full-stack apps and
              computer vision models.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="column xl-12 grid-block">
            <motion.div className="grid-full grid-list-items list-items show-ctr" {...staggerOnView}>
              {data.skillGroups.map((group) => (
                <motion.div className="grid-list-items__item list-items__item" key={group.title} variants={staggerItem}>
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
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <CtaSection showLead={false} />
    </section>
  );
}
