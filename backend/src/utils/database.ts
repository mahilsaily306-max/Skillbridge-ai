import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');

const collections = [
  'users', 'profiles', 'resumes', 'jobs', 'skill_matches',
  'learning_resources', 'roadmaps', 'interview_questions',
  'certificates', 'reports', 'notifications', 'saved_jobs', 'progress',
] as const;

type CollectionName = typeof collections[number];

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(collection: CollectionName): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection<T>(collection: CollectionName): T[] {
  ensureDir();
  const fp = filePath(collection);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, '[]', 'utf-8');
    return [];
  }
  try {
    const data = fs.readFileSync(fp, 'utf-8');
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
}

function writeCollection<T>(collection: CollectionName, data: T[]): void {
  ensureDir();
  fs.writeFileSync(filePath(collection), JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  users: {
    findAll: () => readCollection<any>('users'),
    findById: (id: string) => readCollection<any>('users').find(u => u.id === id),
    findByEmail: (email: string) => readCollection<any>('users').find(u => u.email === email.toLowerCase()),
    create: (user: any) => {
      const users = readCollection<any>('users');
      users.push(user);
      writeCollection('users', users);
      return user;
    },
    update: (id: string, updates: Partial<any>) => {
      const users = readCollection<any>('users');
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
      writeCollection('users', users);
      return users[idx];
    },
  },
  profiles: {
    findAll: () => readCollection<any>('profiles'),
    findByUserId: (userId: string) => readCollection<any>('profiles').find(p => p.userId === userId),
    create: (profile: any) => {
      const profiles = readCollection<any>('profiles');
      profiles.push(profile);
      writeCollection('profiles', profiles);
      return profile;
    },
    update: (userId: string, updates: Partial<any>) => {
      const profiles = readCollection<any>('profiles');
      const idx = profiles.findIndex(p => p.userId === userId);
      if (idx === -1) return null;
      profiles[idx] = { ...profiles[idx], ...updates, updatedAt: new Date().toISOString() };
      writeCollection('profiles', profiles);
      return profiles[idx];
    },
  },
  resumes: {
    findAll: () => readCollection<any>('resumes'),
    findByUserId: (userId: string) => readCollection<any>('resumes').filter(r => r.userId === userId),
    findById: (id: string) => readCollection<any>('resumes').find(r => r.id === id),
    create: (resume: any) => {
      const resumes = readCollection<any>('resumes');
      resumes.push(resume);
      writeCollection('resumes', resumes);
      return resume;
    },
    update: (id: string, updates: Partial<any>) => {
      const resumes = readCollection<any>('resumes');
      const idx = resumes.findIndex(r => r.id === id);
      if (idx === -1) return null;
      resumes[idx] = { ...resumes[idx], ...updates, updatedAt: new Date().toISOString() };
      writeCollection('resumes', resumes);
      return resumes[idx];
    },
    delete: (id: string) => {
      const resumes = readCollection<any>('resumes');
      const idx = resumes.findIndex(r => r.id === id);
      if (idx === -1) return false;
      resumes.splice(idx, 1);
      writeCollection('resumes', resumes);
      return true;
    },
  },
  jobs: {
    findAll: () => readCollection<any>('jobs'),
    findByUserId: (userId: string) => readCollection<any>('jobs').filter(j => j.userId === userId),
    findById: (id: string) => readCollection<any>('jobs').find(j => j.id === id),
    create: (job: any) => {
      const jobs = readCollection<any>('jobs');
      jobs.push(job);
      writeCollection('jobs', jobs);
      return job;
    },
    update: (id: string, updates: Partial<any>) => {
      const jobs = readCollection<any>('jobs');
      const idx = jobs.findIndex(j => j.id === id);
      if (idx === -1) return null;
      jobs[idx] = { ...jobs[idx], ...updates, updatedAt: new Date().toISOString() };
      writeCollection('jobs', jobs);
      return jobs[idx];
    },
    delete: (id: string) => {
      const jobs = readCollection<any>('jobs');
      const idx = jobs.findIndex(j => j.id === id);
      if (idx === -1) return false;
      jobs.splice(idx, 1);
      writeCollection('jobs', jobs);
      return true;
    },
  },
  skillMatches: {
    findAll: () => readCollection<any>('skill_matches'),
    findByResumeId: (resumeId: string) => readCollection<any>('skill_matches').filter(m => m.resumeId === resumeId),
    create: (match: any) => {
      const matches = readCollection<any>('skill_matches');
      matches.push(match);
      writeCollection('skill_matches', matches);
      return match;
    },
  },
  learningResources: {
    findAll: () => readCollection<any>('learning_resources'),
    findBySkill: (skill: string) => readCollection<any>('learning_resources').find(r => r.skill.toLowerCase() === skill.toLowerCase()),
    seed: (resources: any[]) => {
      writeCollection('learning_resources', resources);
    },
  },
  roadmaps: {
    findAll: () => readCollection<any>('roadmaps'),
    findByUserId: (userId: string) => readCollection<any>('roadmaps').filter(r => r.userId === userId),
    create: (roadmap: any) => {
      const roadmaps = readCollection<any>('roadmaps');
      roadmaps.push(roadmap);
      writeCollection('roadmaps', roadmaps);
      return roadmap;
    },
  },
  interviewQuestions: {
    findAll: () => readCollection<any>('interview_questions'),
    findByType: (type: string) => readCollection<any>('interview_questions').filter(q => q.type === type),
    seed: (questions: any[]) => {
      writeCollection('interview_questions', questions);
    },
  },
  certificates: {
    findAll: () => readCollection<any>('certificates'),
    findBySkill: (skill: string) => readCollection<any>('certificates').filter(c => c.skills.some((s: string) => s.toLowerCase() === skill.toLowerCase())),
    seed: (certs: any[]) => {
      writeCollection('certificates', certs);
    },
  },
  reports: {
    findAll: () => readCollection<any>('reports'),
    findByUserId: (userId: string) => readCollection<any>('reports').filter(r => r.userId === userId),
    findById: (id: string) => readCollection<any>('reports').find(r => r.id === id),
    create: (report: any) => {
      const reports = readCollection<any>('reports');
      reports.push(report);
      writeCollection('reports', reports);
      return report;
    },
  },
  notifications: {
    findAll: () => readCollection<any>('notifications'),
    findByUserId: (userId: string) => readCollection<any>('notifications').filter(n => n.userId === userId),
    create: (notification: any) => {
      const notifications = readCollection<any>('notifications');
      notifications.push(notification);
      writeCollection('notifications', notifications);
      return notification;
    },
    markRead: (id: string) => {
      const notifications = readCollection<any>('notifications');
      const idx = notifications.findIndex(n => n.id === id);
      if (idx === -1) return null;
      notifications[idx].read = true;
      writeCollection('notifications', notifications);
      return notifications[idx];
    },
  },
  savedJobs: {
    findAll: () => readCollection<any>('saved_jobs'),
    findByUserId: (userId: string) => readCollection<any>('saved_jobs').filter(s => s.userId === userId),
    create: (saved: any) => {
      const savedJobs = readCollection<any>('saved_jobs');
      savedJobs.push(saved);
      writeCollection('saved_jobs', savedJobs);
      return saved;
    },
    update: (id: string, updates: Partial<any>) => {
      const savedJobs = readCollection<any>('saved_jobs');
      const idx = savedJobs.findIndex(s => s.id === id);
      if (idx === -1) return null;
      savedJobs[idx] = { ...savedJobs[idx], ...updates };
      writeCollection('saved_jobs', savedJobs);
      return savedJobs[idx];
    },
    delete: (id: string) => {
      const savedJobs = readCollection<any>('saved_jobs');
      const idx = savedJobs.findIndex(s => s.id === id);
      if (idx === -1) return false;
      savedJobs.splice(idx, 1);
      writeCollection('saved_jobs', savedJobs);
      return true;
    },
  },
  progress: {
    findByUserId: (userId: string) => readCollection<any>('progress').find(p => p.userId === userId),
    upsert: (progress: any) => {
      const all = readCollection<any>('progress');
      const idx = all.findIndex(p => p.userId === progress.userId);
      if (idx === -1) {
        all.push(progress);
      } else {
        all[idx] = progress;
      }
      writeCollection('progress', all);
      return progress;
    },
  },
};
