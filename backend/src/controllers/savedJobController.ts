import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { db } from '../utils/database';

export async function saveJob(req: AuthRequest, res: Response) {
  try {
    const { jobId, notes } = req.body;
    if (!jobId) return res.status(400).json({ error: 'jobId is required' });

    const job = db.jobs.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const saved = {
      id: uuidv4(),
      userId: req.userId!,
      jobId,
      notes: notes || '',
      status: 'saved' as const,
      createdAt: new Date().toISOString(),
    };

    const result = db.savedJobs.create(saved);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSavedJobs(req: AuthRequest, res: Response) {
  try {
    const savedJobs = db.savedJobs.findByUserId(req.userId!);
    const jobs = savedJobs.map(s => {
      const job = db.jobs.findById(s.jobId);
      return { ...s, job };
    });
    res.json(jobs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateSavedJob(req: AuthRequest, res: Response) {
  try {
    const { status, notes } = req.body;
    const saved = db.savedJobs.update(req.params.id, { status, notes });
    if (!saved) return res.status(404).json({ error: 'Saved job not found' });
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteSavedJob(req: AuthRequest, res: Response) {
  try {
    const result = db.savedJobs.delete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Saved job not found' });
    res.json({ message: 'Saved job removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
