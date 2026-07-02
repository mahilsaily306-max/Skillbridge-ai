import { Response } from 'express';
import { db } from '../utils/database';

export async function getAnalytics(_req: any, res: Response) {
  try {
    const users = db.users.findAll();
    const resumes = db.resumes.findAll();
    const matches = db.skillMatches.findAll();
    const reports = db.reports.findAll();

    const skillCounts: Record<string, number> = {};
    const missingSkillCounts: Record<string, number> = {};

    resumes.forEach(r => {
      r.parsedData.skills.forEach((s: string) => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });

    matches.forEach(m => {
      m.missingSkills.forEach((ms: any) => {
        missingSkillCounts[ms.skill] = (missingSkillCounts[ms.skill] || 0) + 1;
      });
    });

    const atsScores = resumes.filter(r => r.atsScore).map(r => r.atsScore!.overall);
    const avgAts = atsScores.length > 0
      ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length)
      : 0;

    const analytics = {
      totalUsers: users.length,
      activeUsers: users.filter(u => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return new Date(u.updatedAt) > thirtyDaysAgo;
      }).length,
      dailyUploads: resumes.filter(r => {
        const today = new Date().toISOString().split('T')[0];
        return r.createdAt.startsWith(today);
      }).length,
      averageAtsScore: avgAts,
      popularSkills: Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count })),
      mostMissingSkills: Object.entries(missingSkillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count })),
      resumeImprovementRate: resumes.filter(r => r.atsScore && r.atsScore.overall > 70).length / (resumes.length || 1) * 100,
      userRetention: users.length > 0
        ? Math.round((users.filter(u => {
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return new Date(u.updatedAt) > sevenDaysAgo;
        }).length / users.length) * 100)
        : 0,
      learningCompletionRate: 0,
    };

    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUserAnalytics(req: any, res: Response) {
  try {
    const userId = req.userId;
    const resumes = db.resumes.findByUserId(userId);
    const jobs = db.jobs.findByUserId(userId);
    const matches = db.skillMatches.findAll();
    const userMatches = matches.filter(m => resumes.some(r => r.id === m.resumeId));
    const progress = db.progress.findByUserId(userId);

    const atsScores = resumes.filter(r => r.atsScore).map(r => r.atsScore!.overall);
    const avgAts = atsScores.length > 0
      ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length)
      : 0;

    const avgMatch = userMatches.length > 0
      ? Math.round(userMatches.reduce((sum, m) => sum + m.matchPercentage, 0) / userMatches.length)
      : 0;

    res.json({
      totalResumes: resumes.length,
      totalJobs: jobs.length,
      totalMatches: userMatches.length,
      averageAtsScore: avgAts,
      averageMatchScore: avgMatch,
      latestAtsScore: atsScores[atsScores.length - 1] || 0,
      latestMatchScore: userMatches[userMatches.length - 1]?.matchPercentage || 0,
      progress: progress || { completedSkills: [], totalLearningHours: 0, learningStreak: 0 },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
