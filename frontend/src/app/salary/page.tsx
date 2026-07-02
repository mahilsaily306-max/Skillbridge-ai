'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { FiDollarSign, FiSearch } from 'react-icons/fi';

export default function SalaryPage() {
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('US');
  const [experience, setExperience] = useState('3-5');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.matches.getSalary(role, country, experience);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Salary Insights</h1>

      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
          <input value={role} onChange={e => setRole(e.target.value)} required placeholder="e.g. Software Engineer, Data Scientist"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select value={country} onChange={e => setCountry(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
              {['US', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Singapore', 'UAE', 'Netherlands', 'Brazil', 'Japan'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <select value={experience} onChange={e => setExperience(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
              {[['0-1', 'Entry Level (0-1 yrs)'], ['1-2', 'Junior (1-2 yrs)'], ['2-3', 'Mid-Level (2-3 yrs)'], ['3-5', 'Senior (3-5 yrs)'], ['5-7', 'Lead (5-7 yrs)'], ['7-10', 'Principal (7-10 yrs)'], ['10+', 'Executive (10+ yrs)']].map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm transition-colors">
          <FiSearch size={16} /> {loading ? 'Searching...' : 'Get Salary Estimate'}
        </button>
      </form>

      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FiDollarSign className="text-green-500" size={28} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{result.role}</h2>
              <p className="text-sm text-gray-500">{result.country} {result.city && `- ${result.city}`} &middot; {result.experience || experience} yrs</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6 rounded-lg bg-green-50">
            <div>
              <p className="text-xs text-gray-500 mb-1">Minimum</p>
              <p className="text-2xl font-bold text-gray-900">${result.min?.toLocaleString()}</p>
            </div>
            <div className="text-2xl text-gray-300">-</div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Maximum</p>
              <p className="text-2xl font-bold text-gray-900">${result.max?.toLocaleString()}</p>
            </div>
            <div className="ml-auto">
              <p className="text-xs text-gray-500 mb-1">Currency</p>
              <p className="text-lg font-semibold text-gray-900">{result.currency}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Source: {result.source}</p>
        </div>
      )}
    </div>
  );
}
