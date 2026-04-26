export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  points: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface ProjectItem {
  title: string;
  category: string;
  description: string;
  tech: string[];
  repoUrl: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface ValueItem {
  title: string;
  text: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    role: string;
    tagline: string;
    location: string;
    email: string;
    phone: string;
    altPhone: string;
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    summary: string;
    about: string[];
  };
  experience: ExperienceItem[];
  education: string[];
  aboutStory: {
    title: string;
    chapters: Array<{
      heading: string;
      text: string;
    }>;
  };
  skillGroups: SkillGroup[];
  projects: ProjectItem[];
  highlights: string[];
  values: ValueItem[];
}
