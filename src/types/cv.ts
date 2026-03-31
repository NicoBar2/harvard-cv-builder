export interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  dates: string;
  details?: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  dates: string;
  details: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies?: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  dates?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Volunteering {
  id: string;
  organization: string;
  role: string;
  location?: string;
  dates: string;
  details?: string[];
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  link?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: string;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  education: Education[];
  experience: Experience[];
  projects?: Project[];
  certifications?: Certification[];
  volunteering?: Volunteering[];
  publications?: Publication[];
  skills: {
    languages: string[];
    technical: string[];
    interests: string[];
  };
}
