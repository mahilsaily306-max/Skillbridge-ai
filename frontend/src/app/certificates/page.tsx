'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiAward, FiExternalLink, FiClock, FiSearch } from 'react-icons/fi';

export default function CertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.resources.certificates()
      .then(setCerts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? certs.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase())))
    : certs;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Certificate Recommendations</h1>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search certificates by name or skill..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <FiAward className="text-amber-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{c.name}</h3>
                  <p className="text-xs text-gray-500">{c.provider}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
                      c.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                    }`}>{c.difficulty}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs flex items-center gap-1">
                      <FiClock size={12} /> {c.estimatedHours}h
                    </span>
                    {c.free && <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">Free</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.skills.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">{s}</span>
                    ))}
                  </div>
                  <a href={c.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs text-blue-600 hover:underline font-medium">
                    <FiExternalLink size={12} /> View Certificate
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
