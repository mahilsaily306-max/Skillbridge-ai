'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { FiUpload, FiFileText, FiTarget, FiClock, FiTrendingUp, FiBookOpen, FiAward, FiChevronRight } from 'react-icons/fi';

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.analytics.getUser().catch(() => null),
      api.resumes.getAll().catch(() => []),
    ]).then(([a, r]) => {
      setAnalytics(a);
      setResumes(r);
    }).finally(() => setLoading(false));
  }, []);

  const widgets = [
    { label: 'ATS Score', value: analytics?.latestAtsScore ?? '--', icon: FiTarget, color: 'bg-blue-500', link: '/resume' },
    { label: 'Match Score', value: analytics?.latestMatchScore ? `${analytics.latestMatchScore}%` : '--', icon: FiTrendingUp, color: 'bg-green-500', link: '/match' },
    { label: 'Resumes', value: analytics?.totalResumes ?? 0, icon: FiFileText, color: 'bg-purple-500', link: '/resume' },
    { label: 'Skills Learned', value: analytics?.progress?.completedSkills?.length ?? 0, icon: FiBookOpen, color: 'bg-orange-500', link: '/roadmap' },
    { label: 'Learning Hours', value: analytics?.progress?.totalLearningHours ?? 0, icon: FiClock, color: 'bg-teal-500', link: '/roadmap' },
    { label: 'Streak', value: `${analytics?.progress?.learningStreak ?? 0}d`, icon: FiAward, color: 'bg-pink-500', link: '/profile' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-500 mt-1">Here is your career improvement overview</p>
        </div>
        <Link href="/resume" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <FiUpload size={16} /> Upload Resume
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {widgets.map((w, i) => (
          <Link key={i} href={w.link} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg ${w.color} flex items-center justify-center mb-3`}>
              <w.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{w.value}</p>
            <p className="text-xs text-gray-500 mt-1">{w.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Resumes</h2>
          {loading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiFileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No resumes uploaded yet</p>
              <Link href="/resume" className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block">Upload your first resume</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 5).map(r => (
                <Link key={r.id} href={`/resume/${r.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FiFileText className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.fileName}</p>
                      <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {r.atsScore && (
                      <span className={`text-sm font-bold ${r.atsScore.overall >= 70 ? 'text-green-600' : r.atsScore.overall >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {r.atsScore.overall}/100
                      </span>
                    )}
                    <FiChevronRight className="text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Upload Resume', desc: 'Upload your resume for AI analysis', href: '/resume', icon: FiUpload, color: 'text-blue-600 bg-blue-50' },
              { label: 'Add Job Description', desc: 'Paste a job description to compare', href: '/jobs', icon: FiFileText, color: 'text-green-600 bg-green-50' },
              { label: 'Skill Match', desc: 'Match resume with a job', href: '/match', icon: FiTarget, color: 'text-purple-600 bg-purple-50' },
              { label: 'View Roadmap', desc: 'See your learning plan', href: '/roadmap', icon: FiBookOpen, color: 'text-orange-600 bg-orange-50' },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
                <FiChevronRight className="text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {analytics?.progress?.atsScoreHistory?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ATS Score History</h2>
          <div className="flex items-end gap-2 h-32">
            {analytics.progress.atsScoreHistory.slice(-10).map((h: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${h.score}%`, minHeight: '4px' }} />
                <span className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString().slice(0, 5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
