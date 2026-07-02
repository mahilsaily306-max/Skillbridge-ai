import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { db } from '../utils/database';

export async function generateReport(req: AuthRequest, res: Response) {
  try {
    const { resumeId, jobId } = req.body;
    const resume = db.resumes.findById(resumeId);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    let matchResult = null;
    let roadmapResult = null;
    let missingSkills: string[] = [];

    if (jobId) {
      const matches = db.skillMatches.findAll();
      matchResult = matches.find(m => m.resumeId === resumeId && m.jobId === jobId) || null;
      if (matchResult) {
        missingSkills = matchResult.missingSkills.map((m: any) => m.skill);
      }
      const roadmaps = db.roadmaps.findAll();
      roadmapResult = roadmaps.find(r => r.userId === req.userId! && r.jobId === jobId) || null;
    }

    const allMatches = db.skillMatches.findAll();
    const userMatches = allMatches.filter(m => m.resumeId === resumeId);
    const avgMatch = userMatches.length > 0
      ? Math.round(userMatches.reduce((sum, m) => sum + m.matchPercentage, 0) / userMatches.length)
      : null;

    const report = {
      id: uuidv4(),
      userId: req.userId!,
      resumeId,
      jobId: jobId || undefined,
      matchScore: matchResult?.matchPercentage ?? avgMatch,
      atsScore: resume.atsScore || undefined,
      missingSkills,
      learningRoadmap: roadmapResult || undefined,
      recommendations: resume.atsScore?.suggestions || [],
      createdAt: new Date().toISOString(),
    };

    db.reports.create(report);
    res.status(201).json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getReports(req: AuthRequest, res: Response) {
  try {
    const reports = db.reports.findByUserId(req.userId!);
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getReportById(req: AuthRequest, res: Response) {
  try {
    const report = db.reports.findById(req.params.id);
    if (!report || report.userId !== req.userId!) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
