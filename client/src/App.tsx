import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { usePortfolioData } from "./hooks/usePortfolioData";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SkillsPage } from "./pages/SkillsPage";

export default function App() {
  const { data, loading, error } = usePortfolioData();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");
    document.documentElement.classList.add("ss-loaded");
    document.body.classList.add("ss-show");
    document.body.classList.toggle("menu-is-open", menuOpen);
  }, [menuOpen]);

  if (loading) {
    return null;
  }

  if (error || !data) {
    return (
      <main style={{ padding: "4rem 2rem" }}>
        <h1>Unable to load portfolio</h1>
        <p>{error ?? "Unknown error."}</p>
      </main>
    );
  }

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
    </Routes>
  );
}
