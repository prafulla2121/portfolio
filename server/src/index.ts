import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fallbackProjects, featuredRepoMetadata, portfolioData } from "./data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3001;
const rootDir = path.resolve(__dirname, "..", "..");
const publicDir = path.join(rootDir, "public");
const clientDistDir = path.join(rootDir, "dist", "client");

app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));
app.use(express.static(clientDistDir));

async function getGitHubProjects() {
  try {
    const response = await fetch("https://api.github.com/users/prafulla2121/repos?per_page=100&sort=updated", {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "prafulla-portfolio"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos = (await response.json()) as Array<{
      name: string;
      html_url: string;
      homepage: string | null;
      description: string | null;
      fork: boolean;
    }>;

    const featuredOrder = Object.keys(featuredRepoMetadata);
    const preferredProjects = repos
      .filter((repo) => !repo.fork && featuredOrder.includes(repo.name))
      .map((repo) => {
        const metadata = featuredRepoMetadata[repo.name];
        return {
          title: metadata.title,
          category: metadata.category,
          description: metadata.description || repo.description || "Featured GitHub project.",
          tech: metadata.tech,
          repoUrl: repo.html_url,
          liveUrl: metadata.liveUrl ?? repo.homepage ?? undefined,
          imageUrl: metadata.imageUrl
        };
      })
      .sort((left, right) => featuredOrder.indexOf(left.repoUrl.split("/").pop() ?? "") - featuredOrder.indexOf(right.repoUrl.split("/").pop() ?? ""));

    const genericProjects = repos
      .filter((repo) => !repo.fork && !featuredOrder.includes(repo.name) && repo.name !== "prafulla2121")
      .slice(0, 8)
      .map((repo) => ({
        title: repo.name.replace(/[-_]/g, " "),
        category: "GitHub Project",
        description: repo.description ?? "Project from my GitHub profile showcasing hands-on development work.",
        tech: ["GitHub", "Development"],
        repoUrl: repo.html_url,
        liveUrl: repo.homepage ?? undefined
      }));

    const liveProjects = [...preferredProjects, ...genericProjects];

    return liveProjects.length > 0 ? liveProjects : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

app.get("/api/portfolio", (_req, res) => {
  void getGitHubProjects().then((projects) => {
    res.json({
      ...portfolioData,
      projects
    });
  });
});

app.get("/api/projects", (_req, res) => {
  void getGitHubProjects().then((projects) => {
    res.json(projects);
  });
});

app.get("/api/contact", (_req, res) => {
  res.json({
    email: portfolioData.profile.email,
    phone: portfolioData.profile.phone,
    altPhone: portfolioData.profile.altPhone,
    github: portfolioData.profile.github,
    linkedin: portfolioData.profile.linkedin
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Portfolio server running on http://localhost:${port}`);
});
