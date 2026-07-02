import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../utils/database';

export async function getProgress(req: AuthRequest, res: Response) {
  try {
    let progress = db.progress.findByUserId(req.userId!);
    if (!progress) {
      progress = {
        userId: req.userId!,
        completedSkills: [],
        totalLearningHours: 0,
        resumeVersions: 0,
        atsScoreHistory: [],
        matchHistory: [],
        learningStreak: 0,
        lastActiveDate: new Date().toISOString(),
      };
      db.progress.upsert(progress);
    }
    res.json(progress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateProgress(req: AuthRequest, res: Response) {
  try {
    let progress = db.progress.findByUserId(req.userId!);
    if (!progress) {
      progress = {
        userId: req.userId!,
        completedSkills: [],
        totalLearningHours: 0,
        resumeVersions: 0,
        atsScoreHistory: [],
        matchHistory: [],
        learningStreak: 0,
        lastActiveDate: new Date().toISOString(),
      };
    }

    const updates = req.body;
    if (updates.completedSkills) progress.completedSkills = updates.completedSkills;
    if (updates.totalLearningHours !== undefined) progress.totalLearningHours = updates.totalLearningHours;
    if (updates.resumeVersions !== undefined) progress.resumeVersions = updates.resumeVersions;
    if (updates.learningStreak !== undefined) progress.learningStreak = updates.learningStreak;
    if (updates.atsScore) {
      progress.atsScoreHistory.push({ date: new Date().toISOString(), score: updates.atsScore });
    }
    if (updates.matchScore) {
      progress.matchHistory.push({ date: new Date().toISOString(), score: updates.matchScore });
    }

    progress.lastActiveDate = new Date().toISOString();
    const updated = db.progress.upsert(progress);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
