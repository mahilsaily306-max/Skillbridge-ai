export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'recruiter' | 'admin';
  isVerified: boolean;
  avatar?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  languages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  field: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize: number;
  filePath: string;
  parsedData: ParsedResume;
  atsScore?: AtsScore;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: {
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
  }[];
  education: {
    degree?: string;
    institution?: string;
    year?: string;
  }[];
  projects: {
    name?: string;
    description?: string;
    technologies?: string[];
  }[];
  certifications: string[];
  languages: string[];
  achievements: string[];
}

export interface AtsScore {
  overall: number;
  length: number;
  headings: number;
  keywords: number;
  formatting: number;
  readability: number;
  contact: number;
  actionVerbs: number;
  sections: number;
  suggestions: string[];
}

export interface JobDescription {
  id: string;
  userId: string;
  title: string;
  company?: string;
  rawText: string;
  parsedData: ParsedJob;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedJob {
  title?: string;
  company?: string;
  location?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  experience?: string;
  softSkills: string[];
  tools: string[];
  technologies: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
}

export interface SkillMatchResult {
  resumeId: string;
  jobId: string;
  matchPercentage: number;
  matchingSkills: {
    skill: string;
    category: string;
    importance: 'required' | 'preferred';
  }[];
  missingSkills: {
    skill: string;
    category: string;
    importance: 'required' | 'preferred';
    priority: 'high' | 'medium' | 'low';
  }[];
  additionalSkills: string[];
  skillCategories: string[];
  prioritySkills: string[];
  createdAt: string;
}

export interface LearningResource {
  id: string;
  skill: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  officialDocs?: string;
  freeCourses: { title: string; url: string; platform: string }[];
  practicePlatforms: { name: string; url: string }[];
  miniProjects: { title: string; description: string }[];
  videoTutorials: { title: string; url: string; platform: string }[];
}

export interface LearningRoadmap {
  id: string;
  userId: string;
  jobId: string;
  weeks: LearningWeek[];
  createdAt: string;
}

export interface LearningWeek {
  weekNumber: number;
  title: string;
  skills: {
    name: string;
    resources: LearningResource;
    completed: boolean;
  }[];
}

export interface InterviewQuestion {
  id: string;
  type: 'hr' | 'technical' | 'coding' | 'scenario' | 'behavioral';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  answer?: string;
  category?: string;
  skill?: string;
}

export interface Certificate {
  id: string;
  name: string;
  provider: string;
  url: string;
  free: boolean;
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
}

export interface SalaryInsight {
  role: string;
  country: string;
  city: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  currency: string;
  source: string;
}

export interface Report {
  id: string;
  userId: string;
  resumeId: string;
  jobId?: string;
  matchScore?: number;
  atsScore?: AtsScore;
  missingSkills: string[];
  learningRoadmap?: LearningRoadmap;
  recommendations: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'learning_reminder' | 'resume_reminder' | 'course_recommendation' | 'goal_complete' | 'interview_reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  type: 'ats' | 'professional' | 'modern' | 'minimal' | 'one-page';
  description: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  notes?: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  createdAt: string;
}

export interface Progress {
  userId: string;
  completedSkills: string[];
  totalLearningHours: number;
  resumeVersions: number;
  atsScoreHistory: { date: string; score: number }[];
  matchHistory: { date: string; score: number }[];
  learningStreak: number;
  lastActiveDate: string;
}

export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  dailyUploads: number;
  averageAtsScore: number;
  popularSkills: { skill: string; count: number }[];
  mostMissingSkills: { skill: string; count: number }[];
  resumeImprovementRate: number;
  userRetention: number;
  learningCompletionRate: number;
}
