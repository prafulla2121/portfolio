import type { PortfolioData } from "./types/portfolio";

// Static data: the site is a plain static build (Netlify), no API server.
export const portfolioData: PortfolioData = {
  profile: {
    name: "Prafulla Purohit",
    role: "Forward Deployed / Applied AI Engineer",
    tagline:
      "I connect AI agents to real business systems — MCP servers, RAG pipelines and agent workflows that ship.",
    location: "Morbi, Gujarat, India",
    email: "prafulpurohit917@gmail.com",
    github: "https://github.com/prafulla2121",
    linkedin: "https://www.linkedin.com/in/prafulla-purohit-79aa5623b/",
    twitter: "https://x.com/21Prafulla",
    instagram: "https://www.instagram.com/your_prafull/profilecard/?igsh=dXNibGlpZXB3dDZ6",
    summary:
      "Applied AI engineer and final-year B.Tech IT student. I build MCP servers, RAG pipelines and AI agents that work with real accounting and e-commerce data.",
    about: [
      "I work as an AI/ML Developer at Satva Solutions in Ahmedabad. My main job is to connect AI agents to business systems: I build Model Context Protocol (MCP) servers for accounting and e-commerce platforms and deploy them with Docker through the Obot MCP gateway.",
      "I also build retrieval systems. My project DocuMind uses hybrid search (vectors + BM25), a cross-encoder reranker and query rewriting, and can answer with Anthropic, OpenAI, Gemini or a local Ollama model.",
      "I like work close to the customer: understand the real problem, build the integration, and make sure it runs reliably."
    ]
  },
  experience: [
    {
      title: "AI/ML Developer",
      company: "Satva Solutions",
      period: "Jun 2026 – Present (Intern Jan – Jun 2026)",
      location: "Ahmedabad, Gujarat",
      points: [
        "Build MCP servers that give AI agents access to Xero, QuickBooks Online, Shopify and Linnworks APIs, including a 60-tool read-only Linnworks server.",
        "Deploy MCP servers with Docker through the Obot MCP gateway.",
        "Build a RAG + OCR pipeline for reading invoices.",
        "Automate workflows with n8n and work on a multi-agent framework built on Claude Code.",
        "Ship full-stack features for SaaS products."
      ]
    },
    {
      title: "AI/ML Intern",
      company: "TSS Ltd",
      period: "Jan 2025 – Jun 2025",
      location: "Rajkot, Gujarat",
      points: [
        "Worked on face recognition with CNN / FaceNet models.",
        "Built Scrapy pipelines to collect and clean data."
      ]
    }
  ],
  education: [
    "B.Tech in Information Technology, Marwadi University (2022–2026) — CGPA 8.38",
    "Higher Secondary, R.C. Patel, Shirpur (2020–2021) — 89%",
    "Matriculation, Swami Vivekanand, Shirpur (2019–2020) — 89.40%"
  ],
  aboutStory: {
    title: "How I Got Here",
    chapters: [
      {
        heading: "10th",
        text:
          "My school years were not easy. My family faced money problems and a lot of pressure. I knew education was my way forward, stayed focused, and finished 10th grade at Swami Vivekanand School, Maharashtra, with 89.40%."
      },
      {
        heading: "12th (PCMB)",
        text:
          "I chose Science with Maths (PCMB). I balanced studies with family responsibilities and scored 89%. This is where I learned discipline and hard work."
      },
      {
        heading: "Engineering (IT)",
        text:
          "I joined B.Tech in Information Technology at Marwadi University because I love building things with technology. Today I work on applied AI: MCP servers, RAG systems and AI agents."
      }
    ]
  },
  skillGroups: [
    {
      title: "GenAI & Agents",
      items: ["Model Context Protocol (MCP)", "Claude API", "OpenAI API", "Gemini / Genkit", "Ollama", "LangGraph", "LangChain", "RAG", "Prompt engineering"]
    },
    {
      title: "Retrieval",
      items: ["Hybrid search (vector + BM25)", "Cross-encoder reranking", "Qdrant", "FAISS", "sentence-transformers", "OCR pipelines"]
    },
    {
      title: "Backend & Integrations",
      items: ["Python", "FastAPI", "Node.js", "REST APIs", "Xero / QuickBooks / Shopify / Linnworks APIs", "n8n"]
    },
    {
      title: "Frontend",
      items: ["TypeScript", "React", "Next.js", "Vite", "Tailwind CSS"]
    },
    {
      title: "ML & Computer Vision",
      items: ["PyTorch", "YOLOv8", "OpenCV", "CNN / FaceNet", "Scikit-learn", "Streamlit"]
    },
    {
      title: "Data, DevOps & Tools",
      items: ["Docker", "Obot MCP gateway", "PostgreSQL", "Redis", "Firebase", "Git", "Linux", "Scrapy"]
    }
  ],
  projects: [
    {
      title: "DocuMind RAG",
      category: "RAG Application",
      description:
        "Chat with your documents (PDF, DOCX, web pages, YouTube). Hybrid vector + BM25 search, cross-encoder reranking, query rewriting and streaming answers with sources. Works with Anthropic, OpenAI, Gemini or Ollama.",
      tech: ["Python", "FastAPI", "React", "Qdrant", "BM25"],
      repoUrl: "https://github.com/prafulla2121/documind-rag"
    },
    {
      title: "CareerWise AI",
      category: "Full-Stack GenAI",
      description:
        "AI career platform: resume scoring, a 35-question career test, AI career chat, an AI resume builder and a personalised career report.",
      tech: ["Next.js", "TypeScript", "Firebase", "Genkit", "Gemini"],
      repoUrl: "https://github.com/prafulla2121/CareerWise-AI"
    },
    {
      title: "AgentFlow",
      category: "Agent Prototype",
      description:
        "LangGraph multi-agent prototype. A supervisor sends each task to a research, summarizer or code agent, served through FastAPI.",
      tech: ["Python", "LangGraph", "Claude", "FastAPI"],
      repoUrl: "https://github.com/prafulla2121/agentflow"
    },
    {
      title: "Indian Sign Language Detection",
      category: "Computer Vision",
      description:
        "Detects Indian sign language gestures from images and webcam with a trained YOLOv8 model and a Streamlit app.",
      tech: ["Python", "YOLOv8", "OpenCV", "Streamlit"],
      repoUrl: "https://github.com/prafulla2121/Indian-Sign-Language-Detection"
    }
  ],
  values: [
    {
      title: "Customer first",
      text: "Start from the real problem and the real data, then pick the simplest tool that solves it."
    },
    {
      title: "Reliability",
      text: "Read-only by default, clear errors, and systems that keep working after the demo."
    },
    {
      title: "Honesty",
      text: "Say what works, what does not, and what is still a prototype."
    },
    {
      title: "Growth",
      text: "AI tools change fast. I keep learning by building and shipping."
    }
  ]
};
