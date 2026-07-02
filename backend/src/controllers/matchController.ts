import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { db } from '../utils/database';
import { calculateSkillMatch, generateLearningRoadmap, generateInterviewQuestions, calculateSalary } from '../utils/ai';

export async function matchResumeWithJob(req: AuthRequest, res: Response) {
  try {
    const { resumeId, jobId } = req.body;
    if (!resumeId || !jobId) {
      return res.status(400).json({ error: 'resumeId and jobId are required' });
    }

    const resume = db.resumes.findById(resumeId);
    const job = db.jobs.findById(jobId);

    if (!resume || !job) {
      return res.status(404).json({ error: 'Resume or job not found' });
    }

    const match = calculateSkillMatch(resume.parsedData, job.parsedData, resumeId, jobId);
    db.skillMatches.create(match);

    const roadmap = generateLearningRoadmap(
      match.missingSkills.map(m => m.skill),
      req.userId!,
      jobId
    );
    db.roadmaps.create(roadmap);

    res.json({ match, roadmap });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getMatchHistory(req: AuthRequest, res: Response) {
  try {
    const resumes = db.resumes.findByUserId(req.userId!);
    const allMatches = db.skillMatches.findAll();
    const userMatches = allMatches.filter(m => resumes.some(r => r.id === m.resumeId));
    res.json(userMatches);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getLearningRoadmap(req: AuthRequest, res: Response) {
  try {
    const roadmaps = db.roadmaps.findByUserId(req.userId!);
    res.json(roadmaps);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getInterviewQuestions(req: AuthRequest, res: Response) {
  try {
    const { skills, difficulty } = req.query;
    const skillList = skills ? (skills as string).split(',').map(s => s.trim()) : [];
    const questions = generateInterviewQuestions(skillList, (difficulty as string) || 'intermediate');
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSalaryInsights(req: AuthRequest, res: Response) {
  try {
    const { role, country, experience, city } = req.query;
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }
    const salary = calculateSalary(role as string, (country as string) || 'US', (experience as string) || '3-5');
    res.json({ role, country: country || 'US', city: city || '', ...salary, source: 'SkillBridge AI Estimates' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
