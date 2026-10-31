import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { portfolioData as data } from "./data";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SkillsPage } from "./pages/SkillsPage";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    </Routes>
  );
}
