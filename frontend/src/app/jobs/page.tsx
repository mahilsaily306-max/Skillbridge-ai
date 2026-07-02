'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FiFileText, FiTrash2, FiPlus, FiUpload, FiChevronRight, FiBriefcase } from 'react-icons/fi';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadJobs = async () => {
    try {
      const data = await api.jobs.getAll();
      setJobs(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadJobs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await api.jobs.create({ text, title, company });
      setText(''); setTitle(''); setCompany('');
      setShowForm(false);
      await loadJobs();
    } catch (err: any) {
      alert(err.message);
    }
    setSubmitting(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubmitting(true);
    try {
      await api.jobs.upload(file);
      await loadJobs();
    } catch (err: any) {
      alert(err.message);
    }
    setSubmitting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job description?')) return;
    await api.jobs.delete(id);
    await loadJobs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Job Descriptions</h1>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium text-gray-700">
            <FiUpload size={16} /> Upload
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <FiPlus size={16} /> Add Manually
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Job Title" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company (optional)" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} required rows={8}
            placeholder="Paste the full job description here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-y" />
          <div className="flex gap-2">
            <button type="submit" disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
              {submitting ? 'Saving...' : 'Save Job Description'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FiBriefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No job descriptions yet</h2>
          <p className="text-gray-500 mb-6">Add a job description to compare with your resume</p>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            <FiPlus size={18} /> Add Job Description
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map(j => (
            <div key={j.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FiBriefcase className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{j.title}</h3>
                    {j.company && <p className="text-sm text-gray-500">{j.company}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {j.parsedData.requiredSkills.slice(0, 5).map((s: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">{s}</span>
                      ))}
                      {j.parsedData.requiredSkills.length > 5 && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">+{j.parsedData.requiredSkills.length - 5}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{new Date(j.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/match?jobId=${j.id}`} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-xs font-medium transition-colors">Match</Link>
                  <button onClick={() => handleDelete(j.id)} className="p-1.5 text-gray-400 hover:text-red-500"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
