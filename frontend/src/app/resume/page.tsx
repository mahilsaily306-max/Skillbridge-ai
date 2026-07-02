'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FiUpload, FiFileText, FiTrash2, FiRefreshCw, FiDownload, FiChevronRight, FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';

export default function ResumePage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadResumes = async () => {
    try {
      const data = await api.resumes.getAll();
      setResumes(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadResumes(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await api.resumes.upload(file);
      await loadResumes();
    } catch (err: any) {
      alert(err.message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleAnalyze = async (id: string) => {
    setAnalyzing(id);
    try {
      const data = await api.resumes.analyze(id);
      setAnalysis(data);
      setSelected(id);
    } catch (err: any) {
      alert(err.message);
    }
    setAnalyzing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    await api.resumes.delete(id);
    await loadResumes();
    if (selected === id) { setSelected(null); setAnalysis(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Resumes</h1>
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm font-medium">
          <FiUpload size={16} /> {uploading ? 'Uploading...' : 'Upload Resume'}
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {resumes.length === 0 && !loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FiFileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h2>
          <p className="text-gray-500 mb-6">Upload your first resume to get AI-powered analysis</p>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-medium">
            <FiUpload size={18} /> Upload Resume (PDF, DOCX, TXT)
            <input type="file" accept=".pdf,.docx,.txt" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {resumes.map(r => (
              <div key={r.id}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${selected === r.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                onClick={() => { setSelected(r.id); handleAnalyze(r.id); }}>
                <div className="flex items-center justify-between mb-2">
                  <FiFileText className="text-blue-600" size={24} />
                  <button onClick={e => { e.stopPropagation(); handleDelete(r.id); }} className="text-gray-400 hover:text-red-500"><FiTrash2 size={16} /></button>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{r.fileName}</p>
                <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()} &middot; {(r.fileSize / 1024).toFixed(0)} KB</p>
                {r.atsScore && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-sm font-bold ${r.atsScore.overall >= 70 ? 'text-green-600' : r.atsScore.overall >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      ATS: {r.atsScore.overall}/100
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {analyzing ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <FiRefreshCw className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500">Analyzing resume...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">ATS Score</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`text-4xl font-bold ${analysis.atsScore.overall >= 70 ? 'text-green-600' : analysis.atsScore.overall >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {analysis.atsScore.overall}
                    </div>
                    <div className="text-sm text-gray-500">/100</div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Keywords', score: analysis.atsScore.keywords },
                      { label: 'Formatting', score: analysis.atsScore.formatting },
                      { label: 'Contact', score: analysis.atsScore.contact },
                      { label: 'Action Verbs', score: analysis.atsScore.actionVerbs },
                      { label: 'Headings', score: analysis.atsScore.headings },
                      { label: 'Readability', score: analysis.atsScore.readability },
                      { label: 'Sections', score: analysis.atsScore.sections },
                      { label: 'Length', score: analysis.atsScore.length },
                    ].map(m => (
                      <div key={m.label} className="p-3 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500">{m.label}</p>
                        <p className={`text-lg font-bold ${m.score >= 70 ? 'text-green-600' : m.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{m.score}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h2>
                  <ul className="space-y-2">
                    {analysis.atsScore.suggestions.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <FiAlertTriangle className="text-yellow-500 mt-0.5 shrink-0" size={16} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Parsed Information</h2>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Name</p>
                      <p className="text-gray-600">{analysis.resume.parsedData.name || 'Not found'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{analysis.resume.parsedData.email || 'Not found'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Skills ({analysis.totalSkills})</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysis.resume.parsedData.skills.map((s: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Experience ({analysis.experienceCount})</p>
                      {analysis.resume.parsedData.experience.map((e: any, i: number) => (
                        <p key={i} className="text-gray-600">{e.title} {e.company && `- ${e.company}`}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/match?resumeId=${selected}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    Match with Job <FiChevronRight size={16} />
                  </Link>
                  <Link href={`/reports`} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                    <FiDownload size={16} /> Generate Report
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-400">Select a resume to view analysis</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
