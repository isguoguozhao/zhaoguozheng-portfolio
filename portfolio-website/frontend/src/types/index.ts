export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  role: string;
  duration: string;
  achievements: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface Experience {
  id: string;
  type: 'education' | 'work' | 'project';
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  social: {
    github?: string;
    linkedin?: string;
    wechat?: string;
  };
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}
