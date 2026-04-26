export const featuredRepoMetadata: Record<
  string,
  {
    title: string;
    category: string;
    description: string;
    tech: string[];
    liveUrl?: string;
    imageUrl?: string;
  }
> = {
  "CareerWise-AI": {
    title: "CareerWise AI",
    category: "Full Stack GenAI Platform",
    description:
      "AI-powered career platform with resume analysis, interview prep, guided career workflows, and a polished full-stack experience.",
    tech: ["TypeScript", "Next.js", "AI APIs", "PostgreSQL", "AWS S3"],
    imageUrl: "/images/HOME.jpg",
    liveUrl:
      "https://career-wise-ai-git-v-46ca24-prafulpurohit917-gmailcoms-projects.vercel.app/?_vercel_share=1UhUHtw9rwBURwiarfoJAkijRT5bqVSQ"
  },
  agentflow: {
    title: "AgentFlow",
    category: "Agentic AI Platform",
    description:
      "Multi-agent orchestration platform with research, summarization, and code-generation agents using graph-based stateful workflows.",
    tech: ["Python", "LangGraph", "Claude API", "FastAPI", "Docker", "GCP Cloud Run"],
    imageUrl: "/service-images/browser.webp"
  },
  "documind-rag": {
    title: "DocuMind",
    category: "RAG Application",
    description:
      "Document question-answering system with PDF ingestion, embedding pipelines, vector search, citations, and conversation memory.",
    tech: ["Python", "LangChain", "FAISS", "Hugging Face", "FastAPI", "Streamlit"],
    imageUrl: "/service-images/machine-learning-23-911028.webp"
  },
  sentimentscope: {
    title: "SentimentScope",
    category: "NLP API",
    description:
      "Sentiment analysis API with transformer-based classification, Dockerized inference, and CI/CD-ready deployment workflow.",
    tech: ["Python", "BERT", "FastAPI", "Docker", "GitHub Actions"],
    imageUrl: "/service-images/test-data-generation-electric-blue-business-process-database-management-system-computer-configuration.jpg"
  },
  "indian-coin-detection": {
    title: "Indian Coin Detection",
    category: "Computer Vision",
    description:
      "Machine learning project for detecting and classifying Indian coins with a web-based interface and image-processing workflow.",
    tech: ["Python", "Flask", "OpenCV", "Scikit-learn"],
    imageUrl: "/service-images/OIP.jpeg"
  },
  whatsapp_chat_predict: {
    title: "WhatsApp Chat Analyzer",
    category: "NLP Dashboard",
    description:
      "Chat analytics project for extracting sentiment, trends, and conversational insights from exported WhatsApp chat data.",
    tech: ["Python", "NLP", "Streamlit", "Scikit-learn"],
    imageUrl: "/service-images/machine-learning-23-911028.webp"
  },
  "Indian-Sign-Language-Detection": {
    title: "Indian Sign Language Detection",
    category: "AI & Computer Vision",
    description:
      "Vision-based sign language recognition project focused on gesture understanding and practical accessibility use cases.",
    tech: ["Python", "Computer Vision", "ML"],
    imageUrl: "/service-images/backend-development-line-icon-vector.jpg"
  },
  SkillShareApp: {
    title: "SkillShareApp",
    category: "Application Development",
    description:
      "Skill-sharing application concept built around user interaction, collaboration, and structured learning workflows.",
    tech: ["App Development", "Frontend", "Backend"],
    imageUrl: "/service-images/browser.webp"
  },
  "University-News": {
    title: "University News",
    category: "Web Platform",
    description:
      "News and content platform idea designed to publish university-related updates in a structured web experience.",
    tech: ["Web Development", "Content Management"],
    imageUrl: "/images/image.png"
  },
  servicewalla: {
    title: "ServiceWalla",
    category: "Service Marketplace",
    description:
      "Service discovery and marketplace-style application focused on connecting users with practical local services.",
    tech: ["Web Development", "Node.js", "Frontend"],
    imageUrl: "/service-images/browser.webp"
  }
};

export const fallbackProjects = [
  {
    title: "CareerWise AI",
    category: "Full Stack GenAI Platform",
    description:
      "AI-powered career platform with resume analysis, interview prep, guided career workflows, and a polished full-stack experience.",
    tech: ["TypeScript", "Next.js", "AI APIs", "PostgreSQL", "AWS S3"],
    imageUrl: "/images/HOME.jpg",
    repoUrl: "https://github.com/prafulla2121/CareerWise-AI",
    liveUrl:
      "https://career-wise-ai-git-v-46ca24-prafulpurohit917-gmailcoms-projects.vercel.app/?_vercel_share=1UhUHtw9rwBURwiarfoJAkijRT5bqVSQ"
  },
  {
    title: "AgentFlow",
    category: "Agentic AI Platform",
    description:
      "Multi-agent orchestration platform with research, summarization, and code-generation agents using graph-based stateful workflows.",
    tech: ["Python", "LangGraph", "Claude API", "FastAPI", "Docker", "GCP Cloud Run"],
    imageUrl: "/service-images/browser.webp",
    repoUrl: "https://github.com/prafulla2121/agentflow"
  },
  {
    title: "DocuMind",
    category: "RAG Application",
    description:
      "Document question-answering system with PDF ingestion, embedding pipelines, vector search, citations, and conversation memory.",
    tech: ["Python", "LangChain", "FAISS", "Hugging Face", "FastAPI", "Streamlit"],
    imageUrl: "/service-images/machine-learning-23-911028.webp",
    repoUrl: "https://github.com/prafulla2121/documind-rag"
  },
  {
    title: "SentimentScope",
    category: "NLP API",
    description:
      "Sentiment analysis API with transformer-based classification, Dockerized inference, and CI/CD-ready deployment workflow.",
    tech: ["Python", "BERT", "FastAPI", "Docker", "GitHub Actions"],
    imageUrl: "/service-images/test-data-generation-electric-blue-business-process-database-management-system-computer-configuration.jpg",
    repoUrl: "https://github.com/prafulla2121/sentimentscope"
  },
  {
    title: "Indian Coin Detection",
    category: "Computer Vision",
    description:
      "Machine learning project for detecting and classifying Indian coins with a web-based interface and image-processing workflow.",
    tech: ["Python", "Flask", "OpenCV", "Scikit-learn"],
    imageUrl: "/service-images/OIP.jpeg",
    repoUrl: "https://github.com/prafulla2121/indian-coin-detection"
  },
  {
    title: "WhatsApp Chat Analyzer",
    category: "NLP Dashboard",
    description:
      "Chat analytics project for extracting sentiment, trends, and conversational insights from exported WhatsApp chat data.",
    tech: ["Python", "NLP", "Streamlit", "Scikit-learn"],
    imageUrl: "/service-images/machine-learning-23-911028.webp",
    repoUrl: "https://github.com/prafulla2121/whatsapp_chat_predict"
  },
  {
    title: "Indian Sign Language Detection",
    category: "AI & Computer Vision",
    description:
      "Vision-based sign language recognition project focused on gesture understanding and practical accessibility use cases.",
    tech: ["Python", "Computer Vision", "ML"],
    imageUrl: "/service-images/backend-development-line-icon-vector.jpg",
    repoUrl: "https://github.com/prafulla2121/Indian-Sign-Language-Detection"
  },
  {
    title: "SkillShareApp",
    category: "Application Development",
    description:
      "Skill-sharing application concept built around user interaction, collaboration, and structured learning workflows.",
    tech: ["App Development", "Frontend", "Backend"],
    imageUrl: "/service-images/browser.webp",
    repoUrl: "https://github.com/prafulla2121/SkillShareApp"
  },
  {
    title: "University News",
    category: "Web Platform",
    description:
      "News and content platform idea designed to publish university-related updates in a structured web experience.",
    tech: ["Web Development", "Content Management"],
    imageUrl: "/images/image.png",
    repoUrl: "https://github.com/prafulla2121/University-News"
  },
  {
    title: "ServiceWalla",
    category: "Service Marketplace",
    description:
      "Service discovery and marketplace-style application focused on connecting users with practical local services.",
    tech: ["Web Development", "Node.js", "Frontend"],
    imageUrl: "/service-images/browser.webp",
    repoUrl: "https://github.com/prafulla2121/servicewalla"
  }
] as const;

export const portfolioData = {
  profile: {
    name: "Prafulla Purohit",
    role: "AI/ML Developer & Full Stack Engineer",
    tagline:
      "Building production-grade GenAI products, RAG systems, and modern web applications with React, Node.js, and cloud-native tooling.",
    location: "Morbi, Gujarat, India",
    email: "prafulpurohit917@gmail.com",
    phone: "+91 9545813921",
    altPhone: "+91 9373431121",
    github: "https://github.com/prafulla2121",
    linkedin: "https://www.linkedin.com/in/prafulla-purohit-79aa5623b/",
    twitter: "https://x.com/21Prafulla",
    instagram: "https://www.instagram.com/your_prafull/profilecard/?igsh=dXNibGlpZXB3dDZ6",
    summary:
      "Final-year B.Tech IT student with hands-on experience delivering end-to-end AI/ML and GenAI applications using LLMs, agentic workflows, RAG pipelines, and full-stack engineering.",
    about: [
      "I build AI-first digital products that connect strong engineering fundamentals with practical user value. My work spans LLM integrations, RAG systems, agent orchestration, full-stack product development, and cloud deployment.",
      "My recent experience includes building production-oriented AI tools with LangChain, LangGraph, Hugging Face, OpenAI-compatible APIs, and TypeScript-based frontend stacks. I care about clean UX, reliable backend systems, and shipping usable products end to end.",
      "I am especially focused on modern AI/ML areas like prompt engineering, retrieval-augmented generation, vector search, model-serving workflows, MLOps-friendly deployment, and scalable API design."
    ]
  },
  experience: [
    {
      title: "Python & Web Scraping Intern",
      company: "TSS",
      period: "Feb 2025 - Apr 2025",
      location: "Rajkot, Gujarat",
      points: [
        "Built Scrapy-based web scraping pipelines to collect, clean, and structure large datasets for downstream ML use.",
        "Reduced data cleaning overhead by about 40% through reusable pipeline modules and validation steps.",
        "Worked on Python automation, data quality assurance, and production-grade content engineering workflows."
      ]
    }
  ],
  education: [
    "B.Tech in Information Technology, Marwadi University (2022-2026) - CGPA 8.76",
    "Higher Secondary, R.C. Patel, Shirpur (2020-2021) - 89%",
    "Matriculation, Swami Vivekanand, Shirpur (2019-2020) - 89.40%"
  ],
  aboutStory: {
    title: "How I Got Here",
    chapters: [
      {
        heading: "10 TH",
        text:
          "My educational journey has been far from easy. Growing up, I faced numerous challenges, particularly financial struggles and family pressure. However, I was determined to push through and make the best of my circumstances. I completed my 10th grade from Swami Vivekanand School, Maharashtra, with an impressive 89.40%. Despite the hurdles I faced at home, I knew that education was my way out, and I remained focused on achieving academic success."
      },
      {
        heading: "12 TH (PCMB)",
        text:
          "In my 12th grade, I chose the Science stream with a focus on MATHS (PCMB), which was a significant challenge given the pressure I was under. Not only did I have to juggle my studies with family responsibilities, but financial instability added to the weight. Nonetheless, I managed to score 89% in my 12th exams, which was a remarkable achievement considering the struggles I had to face. It was during this period that I learned the true meaning of perseverance, discipline, and hard work."
      },
      {
        heading: "ENGINEERING (IT)",
        text:
          "After completing my school education, I decided to pursue a BTech in Information Technology. This decision was driven by my passion for technology and my desire to contribute to the ever-growing field of digital innovation. While the journey was challenging, each setback taught me invaluable lessons that have helped shape the person I am today. Despite the odds, I stayed determined to forge a path that would lead to a brighter future, both for myself and for my family."
      }
    ]
  },
  skillGroups: [
    {
      title: "Languages",
      items: ["Python", "JavaScript", "TypeScript", "Java", "C/C++", "SQL"]
    },
    {
      title: "Frontend & Full Stack",
      items: ["React", "Next.js", "Node.js", "Express", "REST APIs", "Responsive UI"]
    },
    {
      title: "AI/ML Frameworks",
      items: ["Scikit-learn", "TensorFlow", "PyTorch", "Hugging Face Transformers", "LangChain", "LangGraph", "LlamaIndex"]
    },
    {
      title: "GenAI & LLM Engineering",
      items: ["OpenAI API", "Claude API", "RAG Pipelines", "Agentic AI", "Prompt Engineering", "FAISS", "ChromaDB", "Pinecone", "LoRA Fine-tuning"]
    },
    {
      title: "Cloud, MLOps & Deployment",
      items: ["AWS EC2", "AWS S3", "AWS Lambda", "GCP Cloud Run", "Docker", "GitHub Actions", "FastAPI", "Flask", "Streamlit", "CI/CD"]
    },
    {
      title: "Databases & Tooling",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Vector Databases", "Git", "GitHub", "Linux", "Jupyter", "VS Code", "Kaggle"]
    }
  ],
  projects: fallbackProjects,
  highlights: [
    "Production-grade AI/ML application development",
    "RAG pipelines with retrieval grounding and citations",
    "Agentic workflow design with multi-agent orchestration",
    "Full-stack engineering with React, TypeScript, Node.js, and APIs",
    "Cloud deployment across AWS, GCP, and Hugging Face Spaces",
    "Strong foundation in modern AI tooling and MLOps-ready delivery"
  ],
  values: [
    {
      title: "Innovation",
      text: "I like building practical systems that apply modern AI meaningfully instead of treating it as a buzzword."
    },
    {
      title: "Reliability",
      text: "From backend APIs to model pipelines, I focus on solutions that are maintainable, traceable, and ready for real usage."
    },
    {
      title: "Growth",
      text: "I stay close to fast-moving AI/ML tooling and keep improving through open-source learning, experimentation, and shipping."
    },
    {
      title: "Impact",
      text: "The goal is always to create products that save time, improve decisions, and make advanced technology genuinely useful."
    }
  ]
};

export type PortfolioData = typeof portfolioData;
