'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { FiCheckCircle, FiXCircle, FiStar, FiBookOpen, FiRefreshCw, FiBarChart2, FiChevronRight, FiExternalLink, FiTarget, FiTrendingUp, FiLayers, FiAlertTriangle } from 'react-icons/fi';

const categoryColors: Record<string, string> = {
  'Programming Languages': 'bg-blue-500',
  'Frameworks & Libraries': 'bg-green-500',
  'Databases': 'bg-purple-500',
  'Cloud & DevOps': 'bg-orange-500',
  'Data Science & ML': 'bg-pink-500',
  'Soft Skills': 'bg-teal-500',
  'Tools & Platforms': 'bg-indigo-500',
};

const categoryColorsHex: Record<string, string> = {
  'Programming Languages': '#3b82f6',
  'Frameworks & Libraries': '#22c55e',
  'Databases': '#a855f7',
  'Cloud & DevOps': '#f97316',
  'Data Science & ML': '#ec4899',
  'Soft Skills': '#14b8a6',
  'Tools & Platforms': '#6366f1',
};

function CircularProgress({ value, size = 100, strokeWidth = 8, label }: { value: number; size?: number; strokeWidth?: number; label: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? '#16a34a' : value >= 40 ? '#ca8a04' : '#dc2626';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className={`text-2xl font-bold ${value >= 70 ? 'text-green-600' : value >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value}%
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2 font-medium">{label}</p>
    </div>
  );
}

function BarProgress({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{value}/{maxValue}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MatchContent() {
  const searchParams = useSearchParams();
  const [resumes, setResumes] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState(searchParams.get('resumeId') || '');
  const [selectedJob, setSelectedJob] = useState(searchParams.get('jobId') || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [activeTab, setActiveTab] = useState<'match' | 'roadmap' | 'keywords'>('match');

  useEffect(() => {
    Promise.all([
      api.resumes.getAll().catch(() => []),
      api.jobs.getAll().catch(() => []),
    ]).then(([r, j]) => {
      setResumes(r); setJobs(j);
    }).finally(() => setLoading(false));
  }, []);

  const handleMatch = async () => {
    if (!selectedResume || !selectedJob) return;
    setMatching(true);
    try {
      const data = await api.matches.create(selectedResume, selectedJob);
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    }
    setMatching(false);
  };

  const getCategory = (skill: string): string => {
    const cats: Record<string, string[]> = {
      'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin'],
      'Frameworks & Libraries': ['React', 'Node.js', 'Next.js', 'Express.js', 'Angular', 'Vue', 'Django', 'Flask', 'Spring Boot'],
      'Databases': ['SQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch'],
      'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'Linux'],
      'Data Science & ML': ['Machine Learning', 'Deep Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'NLP'],
      'Soft Skills': ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking', 'Adaptability', 'Creativity'],
    };
    for (const [cat, skills] of Object.entries(cats)) {
      if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) return cat;
    }
    return 'Tools & Platforms';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Match Analysis</h1>
          <p className="text-gray-500 mt-1">Compare your resume against a job description</p>
        </div>
        <Link href="/skills" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
          <FiLayers size={16} /> Skills Library
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Resume</label>
            <div className="relative">
              <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none cursor-pointer">
                <option value="">Choose a resume...</option>
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.fileName} {r.atsScore ? `(ATS: ${r.atsScore.overall})` : ''}
                  </option>
                ))}
              </select>
              <FiChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
            </div>
            {resumes.length === 0 && <p className="text-xs text-amber-600 mt-1">No resumes found. Upload one first.</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Job</label>
            <div className="relative">
              <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none cursor-pointer">
                <option value="">Choose a job...</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}{j.company ? ` - ${j.company}` : ''}</option>
                ))}
              </select>
              <FiChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
            </div>
            {jobs.length === 0 && <p className="text-xs text-amber-600 mt-1">No jobs found. Add one first.</p>}
          </div>
        </div>
        <button onClick={handleMatch} disabled={!selectedResume || !selectedJob || matching}
          className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-medium transition-all shadow-lg shadow-blue-200">
          {matching ? <FiRefreshCw className="animate-spin" size={20} /> : <FiTarget size={20} />}
          {matching ? 'AI is Analyzing...' : 'Analyze Match'}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">

          {/* Score Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative flex items-center justify-center">
                <CircularProgress value={result.match.matchPercentage} size={140} strokeWidth={12} label="Match Score" />
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {[
                  { label: 'Matching Skills', value: result.match.matchingSkills.length, color: 'text-green-600 bg-green-50' },
                  { label: 'Missing Skills', value: result.match.missingSkills.length, color: 'text-red-600 bg-red-50' },
                  { label: 'Required Skills', value: result.match.missingSkills.filter((m: any) => m.importance === 'required').length, color: 'text-orange-600 bg-orange-50' },
                  { label: 'Priority Skills', value: result.match.prioritySkills.length, color: 'text-purple-600 bg-purple-50' },
                ].map((stat, i) => (
                  <div key={i} className={`p-3 rounded-xl ${stat.color} text-center`}>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 mb-6">
              {(['match', 'roadmap', 'keywords'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  {tab === 'match' ? 'Skills Comparison' : tab === 'roadmap' ? 'Learning Path' : 'Keyword Analysis'}
                </button>
              ))}
            </div>

            {activeTab === 'match' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FiCheckCircle className="text-green-500 shrink-0" size={18} />
                    <span>Matching Skills ({result.match.matchingSkills.length})</span>
                  </h3>
                  {result.match.matchingSkills.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No matching skills found</p>
                  ) : (
                    <div className="space-y-1.5">
                      {result.match.matchingSkills.map((m: any, i: number) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500 shrink-0" size={14} />
                            <span className="text-sm font-medium text-gray-900">{m.skill}</span>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.importance === 'required' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {m.importance}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FiXCircle className="text-red-500 shrink-0" size={18} />
                    <span>Missing Skills ({result.match.missingSkills.length})</span>
                  </h3>
                  {result.match.missingSkills.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No missing skills - great fit!</p>
                  ) : (
                    <div className="space-y-1.5">
                      {result.match.missingSkills.map((m: any, i: number) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                          <div className="flex items-center gap-2">
                            <FiXCircle className="text-red-500 shrink-0" size={14} />
                            <span className="text-sm font-medium text-gray-900">{m.skill}</span>
                          </div>
                          <div className="flex gap-1.5">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {m.priority}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.importance === 'required' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                              {m.importance}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && result.roadmap && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Weekly Learning Plan</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {result.roadmap.weeks.map((w: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold mb-2">
                        {w.weekNumber}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{w.title}</p>
                      <p className="text-xs text-gray-500">{w.skills[0]?.resources?.estimatedHours || '~'} hours</p>
                      <div className="mt-2 space-y-1">
                        {w.skills[0]?.resources?.freeCourses?.slice(0, 2).map((c: any, j: number) => (
                          <a key={j} href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <FiExternalLink size={10} /> {c.platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/roadmap" className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
                  View Full Roadmap <FiChevronRight size={16} />
                </Link>
              </div>
            )}

            {activeTab === 'roadmap' && !result.roadmap && (
              <p className="text-sm text-gray-400 italic text-center py-8">No learning roadmap generated.</p>
            )}

            {activeTab === 'keywords' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Keyword Coverage Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Required Skills Coverage</p>
                    <BarProgress
                      label="Matched Required"
                      value={result.match.matchingSkills.filter((m: any) => m.importance === 'required').length}
                      maxValue={result.match.matchingSkills.filter((m: any) => m.importance === 'required').length + result.match.missingSkills.filter((m: any) => m.importance === 'required').length}
                      color="bg-green-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Preferred Skills Coverage</p>
                    <BarProgress
                      label="Matched Preferred"
                      value={result.match.matchingSkills.filter((m: any) => m.importance === 'preferred').length}
                      maxValue={result.match.matchingSkills.filter((m: any) => m.importance === 'preferred').length + result.match.missingSkills.filter((m: any) => m.importance === 'preferred').length}
                      color="bg-blue-500"
                    />
                  </div>

                  {result.match.additionalSkills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <FiStar className="text-purple-500" size={14} /> Additional Skills on Resume ({result.match.additionalSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.match.additionalSkills.map((s: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs border border-purple-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.match.prioritySkills.length > 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1">
                        <FiAlertTriangle size={14} /> High Priority Skills to Learn
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.match.prioritySkills.map((s: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.match.additionalSkills.length > 0 && result.match.matchingSkills.length > 0 && activeTab === 'match' && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                  <FiStar className="text-purple-500" size={14} /> Additional Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.match.additionalSkills.map((s: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs border border-purple-100">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/reports`}
              className="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all shadow-lg shadow-blue-200">
              <FiBarChart2 size={18} /> Generate Full Report
            </Link>
            <Link href={`/roadmap`}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all">
              <FiBookOpen size={18} /> View Learning Roadmap
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-400">Loading...</div>}>
      <MatchContent />
    </Suspense>
  );
}
