import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MotionConfig, useReducedMotion } from "motion/react";
import type { Content } from "../../shared/content";
import { seed } from "../../shared/seed";
import { FxProvider, resolveFx } from "./components/Fx";
import { Layout } from "./components/Layout";
import { PageView } from "./components/PageView";
import { applySettings } from "./theme";

const AdminPage = lazy(() => import("./pages/AdminPage"));

/** Never hold the page longer than this for the API; after it, the seed shows and the API doc swaps in later. */
const LOADER_MAX_MS = 1200;

/** The server validates every write; this only guards against a wrong or partial response shape. */
function toContent(remote: unknown): Content | null {
  const doc = remote as Partial<Content> | null;
  if (!doc || !Array.isArray(doc.pages) || !doc.pages.length || typeof doc.settings !== "object" || !doc.settings) return null;
  const s = doc.settings;
  return {
    ...seed,
    ...doc,
    pages: doc.pages,
    settings: {
      ...seed.settings,
      ...s,
      theme: { ...seed.settings.theme, ...s.theme },
      animations: { ...seed.settings.animations, ...s.animations }
    }
  };
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [doc, setDoc] = useState<Content>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    const timer = window.setTimeout(() => setReady(true), LOADER_MAX_MS);
    fetch("/api/content")
      .then((r) => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : null))
      .then((remote: unknown) => {
        const next = toContent(remote);
        if (live && next) setDoc(next);
      })
      .catch(() => undefined) // offline or plain `vite dev`: keep the seed
      .finally(() => live && setReady(true));
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => applySettings(doc.settings), [doc.settings]);

  useEffect(() => {
    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js", "ss-loaded");
    document.body.classList.add("ss-show");
    document.body.classList.toggle("menu-is-open", menuOpen);
  }, [menuOpen]);

  const pages = doc.pages.filter((p) => p.visible || p.slug === "");
  const reduce = useReducedMotion() ?? false;
  const { animations, theme } = doc.settings;
  const fx = useMemo(() => resolveFx(animations, theme, reduce), [animations, theme, reduce]);

  return (
    // "user": transforms switch off when the OS asks for reduced motion; "always" when the admin turns animations off
    <MotionConfig reducedMotion={doc.settings.animations.enabled ? "user" : "always"}>
      <FxProvider value={fx}>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              settings={doc.settings}
              ready={ready}
              menuOpen={menuOpen}
              onToggleMenu={() => setMenuOpen((current) => !current)}
              onCloseMenu={() => setMenuOpen(false)}
            />
          }
        >
          {pages.map((page) =>
            page.slug === "" ? (
              <Route key={page.id} index element={<PageView page={page} doc={doc} />} />
            ) : (
              <Route key={page.id} path={page.slug} element={<PageView page={page} doc={doc} />} />
            )
          )}
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
      </FxProvider>
    </MotionConfig>
  );
}
