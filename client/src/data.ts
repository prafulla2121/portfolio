import type { PortfolioData } from "./types/portfolio";

// Seed content. Facts come from CAREER-INTELLIGENCE/00_MASTER_PROFILE/linkedin_profile.md,
// 01_RESUME_MASTER/master.yaml and the public GitHub repos (descriptions + READMEs).
// The live site loads /api/content (Netlify Blobs, edited in /admin) and falls back to this file.
export const portfolioData: PortfolioData = {
  profile: {
    name: "Prafulla Purohit",
    role: "Forward Deployed / Applied AI Engineer",
    tagline: "I build AI that works inside real businesses, not only in demos: MCP servers, RAG pipelines and AI agents.",
    location: "Morbi, Gujarat, India",
    email: "prafulpurohit917@gmail.com",
    github: "https://github.com/prafulla2121",
    linkedin: "https://www.linkedin.com/in/prafulla-purohit-79aa5623b/",
    twitter: "https://x.com/21Prafulla",
    instagram: "https://www.instagram.com/your_prafull/profilecard/?igsh=dXNibGlpZXB3dDZ6",
    summary:
      "AI/ML Developer at Satva Solutions. I build MCP servers, RAG pipelines and AI agents that work with real accounting and e-commerce data.",
    about: [
      "I joined Satva Solutions as an intern in January 2026 and was promoted to AI/ML Developer in June. I build and deploy MCP (Model Context Protocol) servers that let AI agents read live data from Xero, QuickBooks Online, Shopify and Linnworks. They run in Docker behind an MCP gateway with OAuth and read-only guard rails, so business users can ask questions of their own systems safely.",
      "I also build RAG pipelines: an invoice and bill extraction pipeline at work, and DocuMind, my open-source RAG system with hybrid search, reranking, an eval suite and its own MCP server.",
      "Around that: a multi-agent software-delivery framework built on Claude Code, LangGraph workflows, and n8n automations such as a Twilio-to-Pipedrive CRM sync, with Langfuse for LLM tracing."
    ]
  },
  experience: [
    {
      id: "satva-developer",
      title: "AI/ML Developer",
      company: "Satva Solutions",
      period: "Jun 2026 – Present",
      location: "Ahmedabad, Gujarat",
      points: [
        "Built and shipped MCP servers that let AI agents read data from Xero, QuickBooks Online, Shopify and Linnworks (60-tool read-only server).",
        "Deployed them with Docker Compose behind the Obot MCP gateway with OAuth, read-only guard rails and per-user isolation.",
        "Contributed to an internal multi-agent software-delivery framework built on Claude Code (agent roles, task routing, review and QA loops).",
        "Built n8n automations (Twilio to Pipedrive CRM sync with de-duplication) and used Langfuse to trace LLM calls.",
        "Prepared internal AI training material and sessions for colleagues."
      ]
    },
    {
      id: "satva-intern",
      title: "AI/ML Engineer Intern",
      company: "Satva Solutions",
      period: "Jan 2026 – Jun 2026",
      location: "Ahmedabad, Gujarat",
      points: [
        "Built a RAG pipeline for invoices and bills: OCR, parsing, chunking, embeddings, cached OCR and LLM-based structured extraction.",
        "Completed full-stack SaaS training (React, Next.js, Node.js, PostgreSQL, Docker) and shipped features on live products. Promoted to Developer in June 2026."
      ]
    },
    {
      id: "tss-intern",
      title: "AI/ML Intern",
      company: "TSS Ltd",
      period: "Jan 2025 – Jun 2025",
      location: "Rajkot, Gujarat",
      points: [
        "Built face detection and identification with MTCNN, FaceNet embeddings and cosine-similarity matching (TensorFlow/Keras, OpenCV).",
        "Built Scrapy pipelines to collect and structure web datasets."
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
      items: ["MCP servers", "LangChain", "LangGraph", "RAG", "Embeddings", "Hybrid search", "Rerankers", "Prompt engineering", "LLM-based extraction", "Claude API", "OpenAI API", "Gemini / Genkit", "Ollama", "Claude Code"]
    },
    {
      title: "LLMOps & Automation",
      items: ["Langfuse (tracing)", "Docker", "Docker Compose", "Obot MCP gateway", "n8n", "GitHub Actions", "Linux"]
    },
    {
      title: "Backend & APIs",
      items: ["Python", "FastAPI", "Flask", "Node.js", "Express", "REST APIs", "OAuth 2.0", "Scrapy"]
    },
    {
      title: "Frontend",
      items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "shadcn/ui", "Streamlit"]
    },
    {
      title: "ML & Computer Vision",
      items: ["PyTorch", "TensorFlow / Keras", "scikit-learn", "OpenCV", "YOLOv8", "FaceNet", "Hugging Face", "NLP (TextBlob, VADER)"]
    },
    {
      title: "Data & Languages",
      items: ["PostgreSQL", "MongoDB", "Firebase Firestore", "FAISS", "ChromaDB", "SQL", "JavaScript", "Java", "C#"]
    }
  ],
  projects: [
    {
      id: "documind",
      title: "DocuMind RAG",
      category: "RAG System",
      description:
        "Chat with your documents. Hybrid retrieval (BM25 + vector search), a reranker, query transformation and context compression, with a pluggable provider layer for Claude, OpenAI, Gemini and Ollama. An eval suite (golden Q&A set, hit rate / MRR, LLM-as-judge) runs in CI without API keys and caught 2 real bugs. Also exposed as an MCP server with ingest, query and list tools.",
      tech: ["Python", "FastAPI", "React", "MCP", "BM25", "Docker"],
      repoUrl: "https://github.com/prafulla2121/documind-rag"
    },
    {
      id: "careerwise",
      title: "CareerWise AI",
      category: "Full-Stack GenAI",
      description:
        "AI career guidance platform: resume analyzer with ATS-style scoring, career test, AI career chat, resume builder with PDF export and reports. Google, email and guest sign-in with role-based Firestore rules.",
      tech: ["Next.js", "TypeScript", "Firebase", "Genkit", "Gemini", "Zod"],
      repoUrl: "https://github.com/prafulla2121/CareerWise-AI"
    },
    {
      id: "agentflow",
      title: "AgentFlow",
      category: "Multi-Agent Prototype",
      description:
        "LangGraph multi-agent prototype: a supervisor routes each task to a research, summarizer or code agent that share state, served through FastAPI and packaged with Docker.",
      tech: ["Python", "LangGraph", "FastAPI", "Docker"],
      repoUrl: "https://github.com/prafulla2121/agentflow"
    },
    {
      id: "isl",
      title: "Indian Sign Language Detection",
      category: "Computer Vision",
      description:
        "Detects 32 Indian Sign Language signs with a fine-tuned YOLOv8n model (mAP@50 0.99 on validation) and a Streamlit app for images and webcam.",
      tech: ["Python", "YOLOv8", "OpenCV", "Streamlit"],
      repoUrl: "https://github.com/prafulla2121/Indian-Sign-Language-Detection"
    },
    {
      id: "whatsapp",
      title: "WhatsApp Chat Analyzer",
      category: "NLP",
      description: "Analyzes WhatsApp chat exports: user activity, trends and sentiment analysis (TextBlob / VADER) with charts. Deployed on Streamlit Cloud.",
      tech: ["Python", "NLP", "TextBlob", "VADER", "Streamlit"],
      repoUrl: "https://github.com/prafulla2121/whatsapp_chat_predict"
    },
    {
      id: "coin-counter",
      title: "Indian Coin Counter",
      category: "Computer Vision",
      description: "Detects and counts Indian coins from a camera or an upload using a Roboflow object-detection model, and totals their value. Flask app.",
      tech: ["Python", "Flask", "Roboflow"],
      repoUrl: "https://github.com/prafulla2121/indian-coin-detection"
    },
    {
      id: "servicewalla",
      title: "ServiceWalla",
      category: "Full-Stack Web",
      description: "Service marketplace with customer and worker dashboards, service discovery and a multi-step booking flow.",
      tech: ["TypeScript", "Firebase Auth"],
      repoUrl: "https://github.com/prafulla2121/ServiseWalla-1"
    },
    {
      id: "university-news",
      title: "University News",
      category: "Web App",
      description: "University news portal for articles, events and announcements.",
      tech: ["React", "TypeScript", "Vite", "Tailwind CSS"],
      repoUrl: "https://github.com/prafulla2121/University-News"
    },
    {
      id: "bus-fleet",
      title: "Bus Fleet Management",
      category: "Web App",
      description: "Logs trips, buses, routes and passengers, with a summary dashboard.",
      tech: ["React", "TypeScript", "Vite", "Supabase", "Tailwind CSS"],
      repoUrl: "https://github.com/prafulla2121/Bus-fleet-managemant"
    },
    {
      id: "move-the-dancing",
      title: "Move The Dancing",
      category: "Java Web App",
      description: "Dance academy website with login, registration and session management, built on Java Servlets and JSP with MySQL over JDBC.",
      tech: ["Java", "JSP", "Servlets", "JDBC", "MySQL"],
      repoUrl: "https://github.com/prafulla2121/move-the-dancing-website-with-jdbc-"
    },
    {
      id: "scrapy",
      title: "Scrapy Practice",
      category: "Web Scraping",
      description: "Practice spiders for Scrapy: basic spiders, CrawlSpider link following, a job-listings scraper, and JSON / CSV exports.",
      tech: ["Python", "Scrapy"],
      repoUrl: "https://github.com/prafulla2121/scrapy"
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
