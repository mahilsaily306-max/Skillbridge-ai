import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../utils/database';

export async function getLearningResources(req: AuthRequest, res: Response) {
  try {
    const resources = db.learningResources.findAll();
    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getLearningResourceBySkill(req: AuthRequest, res: Response) {
  try {
    const resource = db.learningResources.findBySkill(req.params.skill);
    if (!resource) return res.status(404).json({ error: 'Resource not found for this skill' });
    res.json(resource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCertificates(req: AuthRequest, res: Response) {
  try {
    const { skill } = req.query;
    let certs = db.certificates.findAll();
    if (skill) {
      certs = db.certificates.findBySkill(skill as string);
    }
    res.json(certs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getInterviewQuestions(req: AuthRequest, res: Response) {
  try {
    const { type, difficulty } = req.query;
    let questions = db.interviewQuestions.findAll();
    if (type) questions = questions.filter(q => q.type === type);
    if (difficulty) questions = questions.filter(q => q.difficulty === difficulty);
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
