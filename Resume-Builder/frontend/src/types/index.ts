export interface User {
  id: number;
  email: string;
  name: string;
  plan: "free" | "pro";
  downloads_used: number;
  downloads_limit: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  achievements: string[];
}

export interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface Project {
  name: string;
  description: string;
  link: string;
  technologies: string[];
}

export interface ResumeContent {
  personal_info: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: any[];
  languages: any[];
}

export interface Resume {
  id: number;
  user_id: number;
  title: string;
  content: ResumeContent;
  template: "modern" | "minimal" | "professional";
  created_at: string;
  updated_at?: string;
}

export interface Download {
  id: number;
  user_id: number;
  resume_id: number;
  file_format: string;
  created_at: string;
}

export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  created_at: string;
}
