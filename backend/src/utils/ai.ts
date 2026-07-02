import { ParsedResume, ParsedJob, AtsScore, SkillMatchResult, LearningRoadmap, LearningResource } from '../types';
import { db } from './database';
import { v4 as uuidv4 } from 'uuid';

const allSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Docker',
  'Git', 'REST APIs', 'AWS', 'Data Structures', 'Algorithms', 'MongoDB',
  'PostgreSQL', 'CSS', 'HTML', 'Tailwind CSS', 'Next.js', 'Express.js',
  'GraphQL', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Kubernetes',
  'Terraform', 'CI/CD', 'Jenkins', 'Linux', 'Agile', 'Scrum', 'Jira',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP',
  'Data Science', 'Data Analysis', 'Pandas', 'NumPy', 'Tableau', 'Power BI',
  'Excel', 'Communication', 'Leadership', 'Problem Solving', 'Teamwork',
  'Time Management', 'Critical Thinking', 'Adaptability', 'Creativity',
];

const softSkills = [
  'Communication', 'Leadership', 'Problem Solving', 'Teamwork',
  'Time Management', 'Critical Thinking', 'Adaptability', 'Creativity',
  'Collaboration', 'Public Speaking', 'Negotiation', 'Conflict Resolution',
  'Emotional Intelligence', 'Decision Making', 'Mentoring',
];

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const skill of allSkills) {
    if (lower.includes(skill.toLowerCase())) {
      found.push(skill);
    }
  }
  for (const skill of softSkills) {
    if (lower.includes(skill.toLowerCase())) {
      if (!found.includes(skill)) found.push(skill);
    }
  }
  return found;
}

function extractExperience(text: string): { title?: string; company?: string; duration?: string; description?: string }[] {
  const lines = text.split('\n');
  const experiences: { title?: string; company?: string; duration?: string; description?: string }[] = [];
  let current: any = {};
  let inExp = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/experience|work|employment/i.test(line) && line.length < 50) {
      inExp = true;
      continue;
    }
    if (/education|projects|skills|certifications/i.test(line) && line.length < 50) {
      if (current.title) experiences.push(current);
      inExp = false;
      current = {};
      continue;
    }
    if (!inExp || !line) continue;

    if (/^[A-Z]/.test(line) && line.includes('|')) {
      const parts = line.split('|');
      if (!current.title) {
        current.title = parts[0].trim();
        current.company = parts[1]?.trim();
        current.duration = parts[2]?.trim();
      }
    } else if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2})/i.test(line)) {
      current.duration = line;
    } else if (!current.title && line.length < 100) {
      current.title = line;
    } else if (current.title && line.length > 20) {
      current.description = (current.description || '') + ' ' + line;
    }
  }
  if (current.title) experiences.push(current);
  return experiences;
}

function extractEducation(text: string): { degree?: string; institution?: string; year?: string }[] {
  const lines = text.split('\n');
  const education: { degree?: string; institution?: string; year?: string }[] = [];
  let current: any = {};
  let inEdu = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/education|academic/i.test(line) && line.length < 50) {
      inEdu = true;
      continue;
    }
    if (/experience|projects|skills|certifications/i.test(line) && line.length < 50) {
      if (current.degree) education.push(current);
      inEdu = false;
      current = {};
      continue;
    }
    if (!inEdu || !line) continue;

    if (/bachelor|master|phd|b\.?tech|m\.?tech|b\.?sc|m\.?sc|b\.?a|m\.?a/i.test(line)) {
      if (current.degree) education.push(current);
      current = { degree: line };
    } else if (current.degree && !current.institution) {
      current.institution = line;
    } else if (current.degree && !current.year && /\d{4}/.test(line)) {
      current.year = line;
    }
  }
  if (current.degree) education.push(current);
  return education;
}

function extractProjects(text: string): { name?: string; description?: string; technologies?: string[] }[] {
  const lines = text.split('\n');
  const projects: { name?: string; description?: string; technologies?: string[] }[] = [];
  let current: any = {};
  let inProj = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/projects/i.test(line) && line.length < 50) {
      inProj = true;
      continue;
    }
    if (/experience|education|skills|certifications|work/i.test(line) && line.length < 50) {
      if (current.name) projects.push(current);
      inProj = false;
      current = {};
      continue;
    }
    if (!inProj || !line) continue;

    if (line.startsWith('-') || line.startsWith('*')) {
      if (current.name) projects.push(current);
      current = { name: line.replace(/^[-*]\s*/, '') };
    } else if (current.name && !current.description) {
      current.description = line;
    }
  }
  if (current.name) projects.push(current);
  return projects;
}

function extractCertifications(text: string): string[] {
  const lines = text.split('\n');
  const certs: string[] = [];
  let inCerts = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/certifications|certificates/i.test(line) && line.length < 50) {
      inCerts = true;
      continue;
    }
    if (/experience|education|projects|skills|work/i.test(line) && line.length < 50) {
      inCerts = false;
      continue;
    }
    if (inCerts && line) {
      certs.push(line.replace(/^[-*\d.]\s*/, ''));
    }
  }
  return certs;
}

function extractName(text: string): string | undefined {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0];
  if (firstLine && firstLine.length < 100 && /^[A-Z][a-z]+/.test(firstLine)) {
    return firstLine;
  }
  return undefined;
}

function extractEmail(text: string): string | undefined {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return match ? match[0] : undefined;
}

function extractPhone(text: string): string | undefined {
  const match = text.match(/[\+]?[\d\s\-\(\)]{7,20}/);
  return match ? match[0].trim() : undefined;
}

export function parseResume(text: string): ParsedResume {
  const skills = extractSkills(text);
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    skills,
    experience: extractExperience(text),
    education: extractEducation(text),
    projects: extractProjects(text),
    certifications: extractCertifications(text),
    languages: [],
    achievements: [],
  };
}

export function parseJobDescription(text: string): ParsedJob {
  const lower = text.toLowerCase();
  const skills = extractSkills(text);
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const responsibilities: string[] = [];
  const qualifications: string[] = [];
  let inResp = false;
  let inQual = false;

  for (const line of lines) {
    if (/responsibilities|what you.*ll do|role & responsibilities|key duties/i.test(line)) {
      inResp = true; inQual = false; continue;
    }
    if (/qualifications|requirements|what we.*re looking for|skills required|you have/i.test(line)) {
      inResp = false; inQual = true; continue;
    }
    if (/about|benefits|perks|apply/i.test(line) && line.length < 50) {
      inResp = false; inQual = false; continue;
    }
    if (inResp && line.startsWith('-')) responsibilities.push(line.replace(/^-\s*/, ''));
    if (inQual && line.startsWith('-')) qualifications.push(line.replace(/^-\s*/, ''));
  }

  const preferredSkills: string[] = [];
  const requiredSkills: string[] = [];
  const tech: string[] = [];
  const tools: string[] = [];

  for (const skill of skills) {
    if (softSkills.includes(skill)) continue;
    if (lower.includes(`preferred`) && text.match(new RegExp(skill, 'i'))) {
      preferredSkills.push(skill);
    } else {
      requiredSkills.push(skill);
    }
    if (/^[A-Z][a-z]+$/.test(skill)) tech.push(skill);
    else tools.push(skill);
  }

  return {
    title: lines.find(l => /(job title|position|role):/i.test(l))?.split(':')[1]?.trim() || lines[0],
    company: lines.find(l => /(company|organization):/i.test(l))?.split(':')[1]?.trim(),
    location: lines.find(l => /(location|place):/i.test(l))?.split(':')[1]?.trim(),
    requiredSkills,
    preferredSkills,
    responsibilities,
    qualifications,
    experience: lines.find(l => /(\d+.*years?.*experience|experience.*\d+)/i.test(l)) || undefined,
    softSkills: skills.filter(s => softSkills.includes(s)),
    tools,
    technologies: tech,
    salary: undefined,
  };
}

export function calculateAtsScore(resume: ParsedResume, text: string): AtsScore {
  const hasEmail = !!resume.email;
  const hasPhone = !!resume.phone;
  const hasName = !!resume.name;
  const wordCount = text.split(/\s+/).length;

  const lengthScore = wordCount >= 250 && wordCount <= 800 ? 100 : wordCount < 250 ? 60 : 80;
  const headingsScore = [/experience/i, /education/i, /skills/i, /projects/i]
    .filter(r => r.test(text)).length * 25;
  const contactScore = hasEmail && hasPhone && hasName ? 100 : (hasEmail || hasPhone ? 70 : 40);
  const skillCount = resume.skills.length;
  const keywordsScore = Math.min(skillCount * 10, 100);
  const readabilityScore = text.split('\n').filter(l => l.trim().length > 0).length > 10 ? 90 : 70;
  const actionVerbs = ['developed', 'built', 'created', 'designed', 'implemented', 'managed', 'led', 'improved', 'delivered', 'achieved'];
  const verbCount = actionVerbs.filter(v => text.toLowerCase().includes(v)).length;
  const actionVerbsScore = Math.min(verbCount * 20, 100);
  const headingScore = headingsScore;
  const formattingScore = (headingScore >= 75 ? 90 : 70);
  const sections = [/experience/i, /education/i, /skills/i, /projects/i, /certifications/i]
    .filter(r => r.test(text)).length;
  const sectionScore = Math.min((sections / 5) * 100, 100);

  const overall = Math.round(
    (lengthScore * 0.1 + headingScore * 0.1 + keywordsScore * 0.2 + formattingScore * 0.1 +
      readabilityScore * 0.1 + contactScore * 0.1 + actionVerbsScore * 0.15 + sectionScore * 0.15)
  );

  const suggestions: string[] = [];
  if (!hasEmail) suggestions.push('Add your email address to the resume header.');
  if (!hasPhone) suggestions.push('Add your phone number to the resume header.');
  if (wordCount < 300) suggestions.push('Consider expanding your resume to include more details about your experience.');
  if (verbCount < 3) suggestions.push('Use more action verbs like "developed", "implemented", and "managed" to strengthen bullet points.');
  if (skillCount < 5) suggestions.push('List more technical skills relevant to the job you are applying for.');
  if (sections < 4) suggestions.push('Add missing sections: Experience, Education, Skills, Projects, Certifications.');
  if (actionVerbsScore < 60) suggestions.push('Start bullet points with strong action verbs to improve impact.');
  suggestions.push('Use a clean, consistent format with clear section headings.');
  suggestions.push('Quantify achievements with numbers where possible (e.g., "Improved performance by 30%").');

  return {
    overall,
    length: lengthScore,
    headings: headingScore,
    keywords: keywordsScore,
    formatting: formattingScore,
    readability: readabilityScore,
    contact: contactScore,
    actionVerbs: actionVerbsScore,
    sections: sectionScore,
    suggestions,
  };
}

export function calculateSkillMatch(resume: ParsedResume, job: ParsedJob, resumeId: string, jobId: string): SkillMatchResult {
  const resumeSkillsLower = resume.skills.map(s => s.toLowerCase());
  const jobSkillsLower = [...job.requiredSkills, ...job.preferredSkills].map(s => s.toLowerCase());
  const allRequiredLower = job.requiredSkills.map(s => s.toLowerCase());

  const matchingSkills: { skill: string; category: string; importance: 'required' | 'preferred' }[] = [];
  const missingSkills: { skill: string; category: string; importance: 'required' | 'preferred'; priority: 'high' | 'medium' | 'low' }[] = [];
  const additionalSkills: string[] = [];
  const categories = ['Programming Languages', 'Frameworks', 'Databases', 'Cloud', 'DevOps', 'Tools', 'Soft Skills'];
  const categoryMap: Record<string, string> = {
    javascript: 'Programming Languages', typescript: 'Programming Languages', python: 'Programming Languages',
    java: 'Programming Languages', go: 'Programming Languages', rust: 'Programming Languages', c: 'Programming Languages',
    react: 'Frameworks', 'next.js': 'Frameworks', 'express.js': 'Frameworks', 'node.js': 'Frameworks',
    docker: 'DevOps', kubernetes: 'DevOps', jenkins: 'DevOps', 'ci/cd': 'DevOps', terraform: 'DevOps',
    sql: 'Databases', postgresql: 'Databases', mongodb: 'Databases',
    aws: 'Cloud', azure: 'Cloud', gcp: 'Cloud',
  };

  const checked = new Set<string>();

  for (const skill of job.requiredSkills) {
    const lower = skill.toLowerCase();
    checked.add(lower);
    if (resumeSkillsLower.includes(lower)) {
      matchingSkills.push({ skill, category: categoryMap[lower] || 'Tools', importance: 'required' });
    } else {
      missingSkills.push({ skill, category: categoryMap[lower] || 'Tools', importance: 'required', priority: 'high' });
    }
  }

  for (const skill of job.preferredSkills) {
    const lower = skill.toLowerCase();
    if (checked.has(lower)) continue;
    checked.add(lower);
    if (resumeSkillsLower.includes(lower)) {
      matchingSkills.push({ skill, category: categoryMap[lower] || 'Tools', importance: 'preferred' });
    } else {
      missingSkills.push({ skill, category: categoryMap[lower] || 'Tools', importance: 'preferred', priority: 'medium' });
    }
  }

  for (const skill of resume.skills) {
    const lower = skill.toLowerCase();
    if (!checked.has(lower)) {
      additionalSkills.push(skill);
    }
  }

  const requiredCount = job.requiredSkills.length;
  const matchedRequired = matchingSkills.filter(m => m.importance === 'required').length;
  const matchPercentage = requiredCount > 0
    ? Math.round((matchedRequired / requiredCount) * 70 + (matchingSkills.length / (requiredCount + job.preferredSkills.length)) * 30)
    : 0;

  return {
    resumeId,
    jobId,
    matchPercentage,
    matchingSkills,
    missingSkills,
    additionalSkills,
    skillCategories: categories,
    prioritySkills: missingSkills.filter(m => m.priority === 'high').map(m => m.skill),
    createdAt: new Date().toISOString(),
  };
}

export function generateLearningRoadmap(missingSkills: string[], userId: string, jobId: string): LearningRoadmap {
  const allResources = db.learningResources.findAll();
  const weeks: LearningRoadmap['weeks'] = [];
  const maxWeeks = Math.min(missingSkills.length, 8);

  const priorityOrder = ['Git', 'Docker', 'SQL', 'JavaScript', 'Python', 'REST APIs', 'Node.js', 'React', 'TypeScript', 'Next.js', 'AWS', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'];

  const sortedSkills = [...missingSkills].sort((a, b) => {
    const ai = priorityOrder.indexOf(a);
    const bi = priorityOrder.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  for (let i = 0; i < maxWeeks; i++) {
    const skill = sortedSkills[i];
    const resource = allResources.find(r => r.skill.toLowerCase() === skill.toLowerCase());
    weeks.push({
      weekNumber: i + 1,
      title: skill,
      skills: [{
        name: skill,
        resources: resource || {
          id: uuidv4(),
          skill,
          description: `Learn ${skill}`,
          difficulty: 'intermediate',
          estimatedHours: 20,
          freeCourses: [{ title: `${skill} Tutorial`, url: `https://www.google.com/search?q=learn+${encodeURIComponent(skill)}+free`, platform: 'Web' }],
          practicePlatforms: [],
          miniProjects: [{ title: `${skill} Project`, description: `Build a project using ${skill}` }],
          videoTutorials: [],
        },
        completed: false,
      }],
    });
  }

  return {
    id: uuidv4(),
    userId,
    jobId,
    weeks,
    createdAt: new Date().toISOString(),
  };
}

export function generateInterviewQuestions(skills: string[], difficulty: string = 'intermediate'): any[] {
  const allQuestions = db.interviewQuestions.findAll();
  const relevant = allQuestions.filter(q => {
    const skillMatch = skills.some(s => q.question.toLowerCase().includes(s.toLowerCase()) || (q.skill && q.skill.toLowerCase() === s.toLowerCase()));
    return q.difficulty === difficulty || skillMatch;
  });

  if (relevant.length >= 10) return relevant.slice(0, 10);
  const technical = allQuestions.filter(q => q.type === 'technical' && q.difficulty === difficulty);
  const hr = allQuestions.filter(q => q.type === 'hr');
  const coding = allQuestions.filter(q => q.type === 'coding');
  const scenario = allQuestions.filter(q => q.type === 'scenario');
  const behavioral = allQuestions.filter(q => q.type === 'behavioral');

  const result = [...relevant];
  const pools = [technical, hr, coding, scenario, behavioral];
  for (const pool of pools) {
    if (result.length >= 10) break;
    for (const q of pool) {
      if (!result.find(r => r.id === q.id)) {
        result.push(q);
        if (result.length >= 10) break;
      }
    }
  }
  return result.slice(0, 10);
}

export function calculateSalary(role: string, country: string, experience: string): { min: number; max: number; currency: string } {
  const baseSalaries: Record<string, { min: number; max: number }> = {
    'software engineer': { min: 60000, max: 120000 },
    'frontend developer': { min: 55000, max: 110000 },
    'backend developer': { min: 60000, max: 115000 },
    'full stack developer': { min: 65000, max: 130000 },
    'data scientist': { min: 70000, max: 140000 },
    'data analyst': { min: 50000, max: 95000 },
    'devops engineer': { min: 75000, max: 140000 },
    'cloud engineer': { min: 70000, max: 135000 },
    'machine learning engineer': { min: 80000, max: 160000 },
    'product manager': { min: 75000, max: 150000 },
    'ui/ux designer': { min: 50000, max: 100000 },
    'qa engineer': { min: 45000, max: 90000 },
  };

  const countryMultipliers: Record<string, number> = {
    us: 1.0, 'united states': 1.0, uk: 0.8, 'united kingdom': 0.8,
    canada: 0.9, australia: 0.85, germany: 0.8, france: 0.7,
    india: 0.3, china: 0.5, japan: 0.7, brazil: 0.4,
    singapore: 0.7, 'united arab emirates': 0.8, netherlands: 0.8,
  };

  const expMultipliers: Record<string, number> = {
    '0-1': 0.5, '1-2': 0.7, '2-3': 0.8, '3-5': 1.0, '5-7': 1.2, '7-10': 1.4, '10+': 1.7,
  };

  const lower = role.toLowerCase();
  let base = baseSalaries[lower];
  if (!base) {
    base = { min: 50000, max: 100000 };
  }

  const countryMultiplier = countryMultipliers[country.toLowerCase()] || 0.7;
  const expMultiplier = expMultipliers[experience] || 1.0;

  return {
    min: Math.round(base.min * countryMultiplier * expMultiplier),
    max: Math.round(base.max * countryMultiplier * expMultiplier),
    currency: 'USD',
  };
}

export function generateResumeImprovements(resume: ParsedResume, job?: ParsedJob): string[] {
  const suggestions: string[] = [];

  if (!resume.summary || resume.summary.length < 20) {
    suggestions.push('Add a professional summary at the top that highlights your key qualifications and career goals.');
  }
  if (resume.skills.length < 5) {
    suggestions.push('List at least 5-10 relevant technical skills specific to the role.');
  }
  if (resume.experience.length === 0) {
    suggestions.push('Add work experience, internships, or relevant volunteer work.');
  }
  if (resume.experience.some(e => !e.description || e.description.length < 30)) {
    suggestions.push('Expand your experience descriptions with specific achievements and responsibilities.');
  }
  if (resume.projects.length === 0) {
    suggestions.push('Include relevant projects, especially if you have limited work experience.');
  }
  if (!resume.education.length) {
    suggestions.push('Add your educational background including degree, institution, and graduation year.');
  }

  if (job && job.requiredSkills.length > 0) {
    const missing = job.requiredSkills.filter(
      s => !resume.skills.some(rs => rs.toLowerCase() === s.toLowerCase())
    );
    if (missing.length > 0) {
      suggestions.push(`Add missing key skills to your resume: ${missing.join(', ')}.`);
    }
  }

  suggestions.push('Use bullet points instead of paragraphs for better readability.');
  suggestions.push('Quantify achievements with numbers, percentages, or metrics.');
  suggestions.push('Customize your resume for each job application to improve match rate.');
  suggestions.push('Keep your resume to 1-2 pages maximum.');

  return suggestions;
}
