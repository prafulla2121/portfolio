import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { portfolioData } from "./data";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SkillsPage } from "./pages/SkillsPage";
import type { PortfolioData } from "./types/portfolio";

const AdminPage = lazy(() => import("./pages/AdminPage"));

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Show the bundled data at once, then swap in what the admin saved (Netlify Blobs) if the API answers.
  const [data, setData] = useState<PortfolioData>(portfolioData);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content")
      .then((r) => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : null))
      .then((remote: PortfolioData | null) => {
        if (!cancelled && remote && Array.isArray(remote.projects) && Array.isArray(remote.experience)) setData(remote);
      })
      .catch(() => undefined); // offline or plain `vite dev`: keep the bundled data
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");
    document.documentElement.classList.add("ss-loaded");
    document.body.classList.add("ss-show");
    document.body.classList.toggle("menu-is-open", menuOpen);
  }, [menuOpen]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            data={data}
            menuOpen={menuOpen}
            onToggleMenu={() => setMenuOpen((current) => !current)}
            onCloseMenu={() => setMenuOpen(false)}
          />
        }
      >
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route
        path="/admin"
        element={
          <Suspense fallback={<p className="row">Loading admin…</p>}>
            <AdminPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
