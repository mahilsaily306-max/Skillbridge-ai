import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { db } from '../utils/database';
import { parseFileContent } from '../utils/fileParser';
import { parseResume, calculateAtsScore, calculateSkillMatch, generateResumeImprovements } from '../utils/ai';

export async function uploadResume(req: AuthRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.originalname.split('.').pop() || 'txt';
    const text = await parseFileContent(filePath, fileType);
    const parsedData = parseResume(text);
    const atsScore = calculateAtsScore(parsedData, text);

    const resume = {
      id: uuidv4(),
      userId: req.userId!,
      fileName: req.file.originalname,
      fileType: fileType as 'pdf' | 'docx' | 'txt',
      fileSize: req.file.size,
      filePath,
      parsedData,
      atsScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.resumes.create(resume);
    res.status(201).json(resume);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getResumes(req: AuthRequest, res: Response) {
  try {
    const resumes = db.resumes.findByUserId(req.userId!);
    res.json(resumes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getResumeById(req: AuthRequest, res: Response) {
  try {
    const resume = db.resumes.findById(req.params.id);
    if (!resume || resume.userId !== req.userId!) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteResume(req: AuthRequest, res: Response) {
  try {
    const resume = db.resumes.findById(req.params.id);
    if (!resume || resume.userId !== req.userId!) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    db.resumes.delete(req.params.id);
    res.json({ message: 'Resume deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function analyzeResume(req: AuthRequest, res: Response) {
  try {
    const resume = db.resumes.findById(req.params.id);
    if (!resume || resume.userId !== req.userId!) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const improvements = generateResumeImprovements(resume.parsedData);
    const skillCategories: Record<string, string[]> = {};

    const progLangs = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#'];
    const frameworks = ['React', 'Node.js', 'Next.js', 'Express.js', 'Angular', 'Vue', 'Django', 'Flask'];
    const databases = ['SQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis'];
    const cloud = ['AWS', 'Azure', 'GCP'];
    const devops = ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform'];

    for (const skill of resume.parsedData.skills) {
      if (progLangs.includes(skill)) { skillCategories['Programming Languages'] = [...(skillCategories['Programming Languages'] || []), skill]; }
      else if (frameworks.includes(skill)) { skillCategories['Frameworks'] = [...(skillCategories['Frameworks'] || []), skill]; }
      else if (databases.includes(skill)) { skillCategories['Databases'] = [...(skillCategories['Databases'] || []), skill]; }
      else if (cloud.includes(skill)) { skillCategories['Cloud'] = [...(skillCategories['Cloud'] || []), skill]; }
      else if (devops.includes(skill)) { skillCategories['DevOps'] = [...(skillCategories['DevOps'] || []), skill]; }
      else { skillCategories['Other'] = [...(skillCategories['Other'] || []), skill]; }
    }

    res.json({
      resume,
      atsScore: resume.atsScore,
      improvements,
      skillCategories,
      totalSkills: resume.parsedData.skills.length,
      experienceCount: resume.parsedData.experience.length,
      projectCount: resume.parsedData.projects.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
