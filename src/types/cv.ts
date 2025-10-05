export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

export interface CVData {
  personalDetails: PersonalDetails;
  professionalSummary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  template: 'modern' | 'classic';
  settings?: {
    themeColor?: string; // e.g. 'blue', 'emerald'
    fontFamily?: 'system' | 'serif' | 'mono';
    density?: 'compact' | 'comfortable' | 'spacious';
  };
}

export const defaultCVData: CVData = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    website: '',
  },
  professionalSummary: '',
  workExperience: [],
  education: [],
  skills: [],
  template: 'modern',
  settings: {
    themeColor: 'blue',
    fontFamily: 'system',
    density: 'comfortable',
  },
};
