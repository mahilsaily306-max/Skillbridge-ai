'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FiArrowLeft, FiFileText, FiChevronRight } from 'react-icons/fi';

export default function ResumeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.resumes.getById(id as string)
        .then(setResume)
        .catch(() => router.push('/resume'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;
  if (!resume) return <div className="text-center py-12 text-gray-400">Resume not found</div>;

  const p = resume.parsedData;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiFileText className="text-blue-600" size={28} />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{resume.fileName}</h1>
              <p className="text-sm text-gray-500">Uploaded {new Date(resume.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {resume.atsScore && (
            <div className={`text-3xl font-bold ${resume.atsScore.overall >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
              {resume.atsScore.overall}/100
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {p.name && <div><p className="text-xs text-gray-500">Name</p><p className="font-medium">{p.name}</p></div>}
          {p.email && <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{p.email}</p></div>}
          {p.phone && <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{p.phone}</p></div>}
        </div>

        {p.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Skills ({p.skills.length})</h2>
            <div className="flex flex-wrap gap-2">
              {p.skills.map((s: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">{s}</span>
              ))}
            </div>
          </div>
        )}

        {p.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Experience</h2>
            {p.experience.map((e: any, i: number) => (
              <div key={i} className="mb-3 p-3 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-900">{e.title || 'Position'}</p>
                {e.company && <p className="text-sm text-gray-500">{e.company}</p>}
                {e.duration && <p className="text-xs text-gray-400">{e.duration}</p>}
                {e.description && <p className="text-sm text-gray-700 mt-1">{e.description}</p>}
              </div>
            ))}
          </div>
        )}

        {p.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Education</h2>
            {p.education.map((e: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-gray-50 mb-2">
                <p className="text-sm font-medium">{e.degree || 'Degree'}</p>
                {e.institution && <p className="text-sm text-gray-500">{e.institution}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href={`/match?resumeId=${resume.id}`} className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
        Match this Resume with a Job <FiChevronRight size={18} />
      </Link>
    </div>
  );
}
