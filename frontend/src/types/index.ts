export interface User {
  id: string; email: string; name: string; role: string; isVerified: boolean;
}

export interface ParsedResume {
  name?: string; email?: string; phone?: string; summary?: string;
  skills: string[]; languages: string[]; achievements: string[];
  experience: { title?: string; company?: string; duration?: string; description?: string }[];
  education: { degree?: string; institution?: string; year?: string }[];
  projects: { name?: string; description?: string; technologies?: string[] }[];
  certifications: string[];
}

export interface AtsScore {
  overall: number; length: number; headings: number; keywords: number;
  formatting: number; readability: number; contact: number;
  actionVerbs: number; sections: number; suggestions: string[];
}

export interface Resume {
  id: string; userId: string; fileName: string; fileType: string;
  fileSize: number; parsedData: ParsedResume; atsScore?: AtsScore;
  createdAt: string; updatedAt: string;
}

export interface ParsedJob {
  title?: string; company?: string; location?: string;
  requiredSkills: string[]; preferredSkills: string[];
  responsibilities: string[]; qualifications: string[];
  experience?: string; softSkills: string[]; tools: string[]; technologies: string[];
}

export interface JobDescription {
  id: string; userId: string; title: string; company?: string;
  rawText: string; parsedData: ParsedJob;
  createdAt: string; updatedAt: string;
}

export interface SkillMatchResult {
  resumeId: string; jobId: string; matchPercentage: number;
  matchingSkills: { skill: string; category: string; importance: string }[];
  missingSkills: { skill: string; category: string; importance: string; priority: string }[];
  additionalSkills: string[]; prioritySkills: string[];
}

export interface LearningResource {
  id: string; skill: string; description: string; difficulty: string;
  estimatedHours: number; officialDocs?: string;
  freeCourses: { title: string; url: string; platform: string }[];
  practicePlatforms: { name: string; url: string }[];
  miniProjects: { title: string; description: string }[];
  videoTutorials: { title: string; url: string; platform: string }[];
}

export interface LearningWeek {
  weekNumber: number; title: string;
  skills: { name: string; resources: LearningResource; completed: boolean }[];
}

export interface LearningRoadmap {
  id: string; userId: string; jobId: string; weeks: LearningWeek[]; createdAt: string;
}

export interface InterviewQuestion {
  id: string; type: string; difficulty: string; question: string; answer?: string;
}

export interface Report {
  id: string; userId: string; resumeId: string; jobId?: string;
  matchScore?: number; atsScore?: AtsScore; missingSkills: string[];
  learningRoadmap?: LearningRoadmap; recommendations: string[]; createdAt: string;
}

export interface Notification {
  id: string; userId: string; type: string; title: string; message: string; read: boolean; createdAt: string;
}

export interface Progress {
  userId: string; completedSkills: string[]; totalLearningHours: number;
  resumeVersions: number; atsScoreHistory: { date: string; score: number }[];
  matchHistory: { date: string; score: number }[]; learningStreak: number; lastActiveDate: string;
}
