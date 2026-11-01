import type { Content } from "./content.ts";

// Seed content (what "Reset to seed" restores). Facts come from CAREER-INTELLIGENCE/00_MASTER_PROFILE/linkedin_profile.md,
// 01_RESUME_MASTER/master.yaml, the public GitHub repos, and the owner's own words on the old live site
// (values, story, interests). No phone number on purpose.
export const seed: Content = {
  version: 1,
  updatedAt: "",
  settings: {
    siteTitle: "Prafulla Purohit | Forward Deployed / Applied AI Engineer",
    metaDescription: "Prafulla Purohit, AI/ML Developer: MCP servers, RAG pipelines and AI agents that work with real accounting and e-commerce systems.",
    ogImage: "",
    logo: "/images/logo.svg",
    name: "Prafulla Purohit",
    email: "prafulpurohit917@gmail.com",
    location: "Morbi, Gujarat, India",
    footerAbout:
      "AI/ML Developer at Satva Solutions. I build MCP servers, RAG pipelines and AI agents that work with real accounting and e-commerce data. Outside work I write and read philosophy.",
    headerButtonLabel: "Let's Work Together",
    headerButtonLink: "/contact",
    nav: [
      { id: "about", label: "About", link: "/about", visible: true },
      { id: "skills", label: "Skills", link: "/skills", visible: true },
      { id: "projects", label: "Projects", link: "/projects", visible: true },
      { id: "contact", label: "Contact", link: "/contact", visible: true }
    ],
    social: [
      { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/prafulla-purohit-79aa5623b/", visible: true },
      { id: "github", label: "GitHub", url: "https://github.com/prafulla2121", visible: true },
      { id: "twitter", label: "X / Twitter", url: "https://x.com/21Prafulla", visible: true },
      { id: "instagram", label: "Instagram", url: "https://www.instagram.com/your_prafull/profilecard/?igsh=dXNibGlpZXB3dDZ6", visible: true }
    ],
    theme: { color1: "#EA9010", color2: "#343D35", color3: "#FEF5E4", bodyFont: "Roboto Flex", displayFont: "DM Serif Display" },
    animations: { enabled: true, loader: "fade" }
  },
  pages: [
    {
      id: "home",
      slug: "",
      title: "Home",
      pretitle: "",
      visible: true,
      sections: [
        {
          id: "hero",
          type: "hero",
          visible: true,
          animation: "slide",
          pretitle: "Hello, I'm Prafulla",
          title: "Forward Deployed / Applied AI Engineer",
          lead: "I build AI that works inside real businesses, not only in demos: MCP servers, RAG pipelines and AI agents.",
          image: "/images/face-swap7.png",
          scrollLabel: "Scroll for more"
        },
        {
          id: "about",
          type: "about",
          visible: true,
          animation: "fade",
          pretitle: "About",
          title: "AI agents that work with real business systems",
          paragraphs: [
            "I joined Satva Solutions as an intern in January 2026 and was promoted to AI/ML Developer in June. I build and deploy MCP (Model Context Protocol) servers that let AI agents read live data from Xero, QuickBooks Online, Shopify and Linnworks, running in Docker behind an MCP gateway with OAuth and read-only guard rails.",
            "I also build RAG pipelines: an invoice and bill extraction pipeline at work, and DocuMind, my open-source RAG system with hybrid search, reranking, an eval suite and its own MCP server."
          ],
          image: "/images/geometric_shape.svg",
          buttonLabel: "More About Me",
          buttonLink: "/about",
          showSocial: true
        },
        {
          id: "expertise",
          type: "skills",
          visible: true,
          animation: "stagger",
          pretitle: "Expertise",
          title: "My key areas of expertise.",
          lead: "",
          buttonLabel: "View All Skills",
          buttonLink: "/skills",
          groups: [
            { id: "genai", visible: true, title: "MCP servers & AI agents", items: ["Model Context Protocol servers for Xero, QuickBooks Online, Shopify and Linnworks", "LangGraph and LangChain workflows", "A multi-agent delivery framework on Claude Code"] },
            { id: "rag", visible: true, title: "RAG & retrieval", items: ["Hybrid search (BM25 + vectors) and rerankers", "OCR and LLM-based structured extraction", "Eval suites: hit rate, MRR, LLM-as-judge"] },
            { id: "ops", visible: true, title: "Deployment & LLMOps", items: ["Docker and Docker Compose", "Obot MCP gateway with OAuth", "Langfuse tracing", "n8n automations"] },
            { id: "fullstack", visible: true, title: "Full-stack", items: ["Python, FastAPI, Flask", "TypeScript, React, Next.js", "PostgreSQL, MongoDB, Firebase"] }
          ]
        },
        {
          id: "featured",
          type: "projects",
          visible: true,
          animation: "stagger",
          pretitle: "Selected Work",
          title: "Projects I have built and shipped.",
          limit: 4,
          buttonLabel: "View All Projects",
          buttonLink: "/projects",
          items: []
        },
        { id: "cta", type: "cta", visible: true, animation: "scale", pretitle: "", title: "Need AI that works with your real data?", lead: "MCP servers, RAG pipelines and AI agents: built, deployed and kept running.", buttonLabel: "Let's Work Together", buttonLink: "/contact" }
      ]
    },
    {
      id: "about",
      slug: "about",
      title: "Hi, I'm Prafulla",
      pretitle: "About",
      visible: true,
      sections: [
        {
          id: "story",
          type: "list",
          layout: "chapters",
          visible: true,
          animation: "fade",
          pretitle: "",
          title: "How I Got Here",
          lead: "",
          items: [
            { id: "tenth", visible: true, title: "10th", text: "My school years were not easy. My family faced money problems and a lot of pressure. I knew education was my way forward, stayed focused, and finished 10th grade at Swami Vivekanand School, Maharashtra, with 89.40%.", link: "", image: "", tags: [] },
            { id: "twelfth", visible: true, title: "12th (PCMB)", text: "I chose Science with Maths (PCMB). I balanced studies with family responsibilities and scored 89%. This is where I learned perseverance, discipline and hard work.", link: "", image: "", tags: [] },
            { id: "engineering", visible: true, title: "Engineering (IT)", text: "I studied B.Tech in Information Technology at Marwadi University because I love building things with technology. Today I work on applied AI: MCP servers, RAG systems and AI agents.", link: "", image: "", tags: [] }
          ]
        },
        {
          id: "experience",
          type: "experience",
          visible: true,
          animation: "slide",
          pretitle: "",
          title: "Experience",
          items: [
            {
              id: "satva-developer",
              visible: true,
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
              visible: true,
              title: "AI/ML Engineer Intern",
              company: "Satva Solutions",
              period: "Jan 2026 – Jun 2026",
              location: "Ahmedabad, Gujarat",
              points: [
                "Built a RAG pipeline for invoices and bills: OCR, parsing, chunking, embeddings, cached OCR and LLM-based structured extraction.",
                "Completed full-stack SaaS training (React, Next.js, Node.js, Express, PostgreSQL, Docker) and shipped features on live products. Promoted to Developer in June 2026."
              ]
            },
            {
              id: "tss-intern",
              visible: true,
              title: "AI/ML Intern",
              company: "TSS Ltd",
              period: "Jan 2025 – Jun 2025",
              location: "Rajkot, Gujarat",
              points: [
                "Built face detection and identification with MTCNN, FaceNet embeddings and cosine-similarity matching (TensorFlow/Keras, OpenCV).",
                "Trained and evaluated models with data augmentation, k-fold cross-validation and confusion-matrix analysis (scikit-learn).",
                "Built Scrapy pipelines to collect, clean and structure web datasets."
              ]
            }
          ]
        },
        {
          id: "education",
          type: "list",
          layout: "bullets",
          visible: true,
          animation: "fade",
          pretitle: "",
          title: "Education",
          lead: "",
          items: [
            { id: "btech", visible: true, title: "B.Tech in Information Technology, Marwadi University", text: "2022 – 2026. CGPA 8.38 / 10.", link: "", image: "", tags: [] },
            { id: "hsc", visible: true, title: "Higher Secondary (Class 12), R.C. Patel, Shirpur", text: "2021. 89%.", link: "", image: "", tags: [] },
            { id: "ssc", visible: true, title: "Matriculation (Class 10), Swami Vivekanand, Shirpur", text: "2020. 89.40%.", link: "", image: "", tags: [] }
          ]
        },
        {
          id: "certifications",
          type: "list",
          layout: "bullets",
          visible: true,
          animation: "fade",
          pretitle: "",
          title: "Certifications",
          lead: "",
          items: [
            { id: "python-ds", visible: true, title: "Python for Data Science", text: "", link: "", image: "", tags: [] },
            { id: "oracle", visible: true, title: "Oracle: Java Programming, Database Management Systems", text: "", link: "", image: "", tags: [] },
            { id: "linux", visible: true, title: "NDG Linux Essentials", text: "", link: "", image: "", tags: [] },
            { id: "cisco", visible: true, title: "Cisco Networking Basics", text: "", link: "", image: "", tags: [] },
            { id: "infosys", visible: true, title: "Infosys Springboard: C#, Software Testing", text: "", link: "", image: "", tags: [] }
          ]
        },
        {
          id: "achievements",
          type: "list",
          layout: "bullets",
          visible: true,
          animation: "fade",
          pretitle: "",
          title: "Achievements & Activities",
          lead: "",
          items: [
            { id: "hackathons", visible: true, title: "Hackathons", text: "Hack The Mountain 2024; Intellify Hackathon 2023 (Marwadi University).", link: "", image: "", tags: [] },
            { id: "clubs", visible: true, title: "Clubs and events", text: "Member, Robotics & IoT Club; attendee, TEDx Marwadi University 2024.", link: "", image: "", tags: [] },
            { id: "languages", visible: true, title: "Languages", text: "English, Hindi, Gujarati, Marathi.", link: "", image: "", tags: [] },
            { id: "interests", visible: true, title: "Beyond code", text: "I write and read philosophy, and enjoy story writing and poetry.", link: "", image: "", tags: [] }
          ]
        },
        {
          id: "values",
          type: "list",
          layout: "cards",
          visible: true,
          animation: "stagger",
          pretitle: "",
          title: "My Values & Beliefs",
          lead: "",
          items: [
            { id: "innovation", visible: true, title: "Innovation", text: "Creative problem-solving that makes a real difference: start from the real problem and the real data.", link: "", image: "", tags: [] },
            { id: "resilience", visible: true, title: "Resilience", text: "Life has thrown many challenges my way, from financial difficulties to academic stress. I have learned to bounce back stronger each time.", link: "", image: "", tags: [] },
            { id: "growth", visible: true, title: "Growth", text: "AI tools change fast. I keep learning by building and shipping.", link: "", image: "", tags: [] },
            { id: "empathy", visible: true, title: "Empathy", text: "Solutions should solve the technical problem and also help the people who use them.", link: "", image: "", tags: [] }
          ]
        },
        { id: "cta", type: "cta", visible: true, animation: "scale", pretitle: "", title: "Need AI that works with your real data?", lead: "MCP servers, RAG pipelines and AI agents: built, deployed and kept running.", buttonLabel: "Let's Work Together", buttonLink: "/contact" }
      ]
    },
    {
      id: "skills",
      slug: "skills",
      title: "Applied AI, from API to agent",
      pretitle: "Skills",
      visible: true,
      sections: [
        {
          id: "skills",
          type: "skills",
          visible: true,
          animation: "stagger",
          pretitle: "",
          title: "What I work with",
          lead: "Tools I use to connect AI agents to real systems, from the model API to the deployed server.",
          buttonLabel: "",
          buttonLink: "",
          groups: [
            { id: "genai", visible: true, title: "GenAI & Agents", items: ["MCP servers", "LangChain", "LangGraph", "RAG", "Embeddings", "Hybrid search", "Rerankers", "Prompt engineering", "LLM-based extraction", "Claude API", "OpenAI API", "Gemini / Genkit", "Ollama", "Claude Code"] },
            { id: "llmops", visible: true, title: "LLMOps & Automation", items: ["Langfuse (tracing)", "Docker", "Docker Compose", "Obot MCP gateway", "n8n", "GitHub Actions", "Linux"] },
            { id: "backend", visible: true, title: "Backend & APIs", items: ["Python", "FastAPI", "Flask", "Node.js", "Express", "REST APIs", "OAuth 2.0", "Scrapy"] },
            { id: "frontend", visible: true, title: "Frontend", items: ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "shadcn/ui", "Streamlit"] },
            { id: "ml", visible: true, title: "ML & Computer Vision", items: ["PyTorch", "TensorFlow / Keras", "scikit-learn", "OpenCV", "YOLOv8", "FaceNet", "Hugging Face", "NLP (TextBlob, VADER)"] },
            { id: "data", visible: true, title: "Databases & Languages", items: ["PostgreSQL", "MongoDB", "Firebase Firestore", "FAISS", "ChromaDB", "SQL", "Java", "C#"] }
          ]
        },
        { id: "cta", type: "cta", visible: true, animation: "scale", pretitle: "", title: "Need AI that works with your real data?", lead: "", buttonLabel: "Let's Work Together", buttonLink: "/contact" }
      ]
    },
    {
      id: "projects",
      slug: "projects",
      title: "Selected Work",
      pretitle: "My Projects",
      visible: true,
      sections: [
        {
          id: "all-projects",
          type: "projects",
          visible: true,
          animation: "stagger",
          pretitle: "",
          title: "",
          limit: 0,
          buttonLabel: "",
          buttonLink: "",
          items: [
            { id: "documind", visible: true, title: "DocuMind RAG", category: "RAG System", description: "Chat with your documents. Hybrid retrieval (BM25 + vector search), a reranker, query transformation and context compression, with one provider layer for Claude, OpenAI, Gemini and Ollama. An eval suite (golden Q&A set, hit rate / MRR, LLM-as-judge) runs in CI without API keys and caught 2 real bugs. Also exposed as an MCP server with ingest, query and list tools.", tech: ["Python", "FastAPI", "React", "MCP", "BM25", "Docker"], repoUrl: "https://github.com/prafulla2121/documind-rag", liveUrl: "", image: "" },
            { id: "careerwise", visible: true, title: "CareerWise AI", category: "Full-Stack GenAI", description: "AI career guidance platform: resume analyzer with ATS-style scoring, career test, AI career chat, cover letters, resume builder with PDF export and reports. Google, email and guest sign-in with role-based Firestore rules.", tech: ["Next.js", "TypeScript", "Firebase", "Genkit", "Gemini", "Zod"], repoUrl: "https://github.com/prafulla2121/CareerWise-AI", liveUrl: "", image: "" },
            { id: "agentflow", visible: true, title: "AgentFlow", category: "Multi-Agent Prototype", description: "LangGraph multi-agent prototype: a supervisor routes each task to a research, summarizer or code agent that share state, served through FastAPI and packaged with Docker.", tech: ["Python", "LangGraph", "FastAPI", "Docker"], repoUrl: "https://github.com/prafulla2121/agentflow", liveUrl: "", image: "" },
            { id: "isl", visible: true, title: "Indian Sign Language Detection", category: "Computer Vision", description: "Detects 32 Indian Sign Language signs with a fine-tuned YOLOv8n model (mAP@50 0.99 on validation) and a Streamlit app for images and webcam.", tech: ["Python", "YOLOv8", "OpenCV", "Streamlit"], repoUrl: "https://github.com/prafulla2121/Indian-Sign-Language-Detection", liveUrl: "", image: "" },
            { id: "whatsapp", visible: true, title: "WhatsApp Chat Analyzer", category: "NLP", description: "Analyzes WhatsApp chat exports: user activity, trends and sentiment analysis (TextBlob / VADER) with charts. Deployed on Streamlit Cloud.", tech: ["Python", "TextBlob", "VADER", "Streamlit"], repoUrl: "https://github.com/prafulla2121/whatsapp_chat_predict", liveUrl: "", image: "" },
            { id: "coin-counter", visible: true, title: "Indian Coin Counter", category: "Computer Vision", description: "Detects and counts Indian coins from a camera or an upload using a Roboflow object-detection model, and totals their value. Flask app.", tech: ["Python", "Flask", "Roboflow"], repoUrl: "https://github.com/prafulla2121/indian-coin-detection", liveUrl: "", image: "" },
            { id: "servicewalla", visible: true, title: "ServiceWalla", category: "Full-Stack Web", description: "Service marketplace with customer and worker dashboards, service discovery and a multi-step booking flow.", tech: ["TypeScript", "Firebase Auth"], repoUrl: "https://github.com/prafulla2121/ServiseWalla-1", liveUrl: "", image: "" },
            { id: "university-news", visible: true, title: "University News", category: "Web App", description: "University news portal for articles, events and announcements.", tech: ["React", "TypeScript", "Vite", "Tailwind CSS"], repoUrl: "https://github.com/prafulla2121/University-News", liveUrl: "", image: "" },
            { id: "bus-fleet", visible: true, title: "Bus Fleet Management", category: "Web App", description: "Logs trips, buses, routes and passengers, with a summary dashboard.", tech: ["React", "TypeScript", "Vite", "Supabase", "Tailwind CSS"], repoUrl: "https://github.com/prafulla2121/Bus-fleet-managemant", liveUrl: "", image: "" },
            { id: "move-the-dancing", visible: true, title: "Move The Dancing", category: "Java Web App", description: "Dance academy website with login, registration and session management, built on Java Servlets and JSP with MySQL over JDBC.", tech: ["Java", "JSP", "Servlets", "JDBC", "MySQL"], repoUrl: "https://github.com/prafulla2121/move-the-dancing-website-with-jdbc-", liveUrl: "", image: "" },
            { id: "scrapy", visible: true, title: "Scrapy Practice", category: "Web Scraping", description: "Practice spiders for Scrapy: basic spiders, CrawlSpider link following, a job-listings scraper, and JSON / CSV exports.", tech: ["Python", "Scrapy"], repoUrl: "https://github.com/prafulla2121/scrapy", liveUrl: "", image: "" }
          ]
        },
        { id: "cta", type: "cta", visible: true, animation: "scale", pretitle: "", title: "Ready to build something with AI agents?", lead: "", buttonLabel: "Let's Work Together", buttonLink: "/contact" }
      ]
    },
    {
      id: "contact",
      slug: "contact",
      title: "Get In Touch",
      pretitle: "Contact",
      visible: true,
      sections: [
        {
          id: "contact",
          type: "contact",
          visible: true,
          animation: "fade",
          pretitle: "",
          title: "Have an AI integration to build? Let's talk.",
          text: "I help teams connect AI agents to their real systems: MCP servers, RAG over company documents, and agent workflows. Send a message below or email me.",
          showForm: true,
          showEmail: true,
          showSocial: true
        }
      ]
    }
  ]
};
