import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { db } from '../utils/database';
import { parseFileContent } from '../utils/fileParser';
import { parseJobDescription } from '../utils/ai';

export async function createJob(req: AuthRequest, res: Response) {
  try {
    const { text, title, company } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Job description text is required' });
    }

    const parsedData = parseJobDescription(text);

    const job = {
      id: uuidv4(),
      userId: req.userId!,
      title: title || parsedData.title || 'Untitled Job',
      company: company || parsedData.company || '',
      rawText: text,
      parsedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.jobs.create(job);
    res.status(201).json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function uploadJob(req: AuthRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.originalname.split('.').pop() || 'txt';
    const text = await parseFileContent(filePath, fileType);
    const parsedData = parseJobDescription(text);

    const job = {
      id: uuidv4(),
      userId: req.userId!,
      title: parsedData.title || req.file.originalname,
      company: parsedData.company || '',
      rawText: text,
      parsedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.jobs.create(job);
    res.status(201).json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getJobs(req: AuthRequest, res: Response) {
  try {
    const jobs = db.jobs.findByUserId(req.userId!);
    res.json(jobs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getJobById(req: AuthRequest, res: Response) {
  try {
    const job = db.jobs.findById(req.params.id);
    if (!job || job.userId !== req.userId!) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateJob(req: AuthRequest, res: Response) {
  try {
    const job = db.jobs.findById(req.params.id);
    if (!job || job.userId !== req.userId!) {
      return res.status(404).json({ error: 'Job not found' });
    }
    const { title, company, text } = req.body;
    const updates: any = {};
    if (title) updates.title = title;
    if (company) updates.company = company;
    if (text) {
      updates.rawText = text;
      updates.parsedData = parseJobDescription(text);
    }
    const updated = db.jobs.update(req.params.id, updates);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteJob(req: AuthRequest, res: Response) {
  try {
    const job = db.jobs.findById(req.params.id);
    if (!job || job.userId !== req.userId!) {
      return res.status(404).json({ error: 'Job not found' });
    }
    db.jobs.delete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
