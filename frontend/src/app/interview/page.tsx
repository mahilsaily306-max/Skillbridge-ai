'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiMessageSquare, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function InterviewPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
      const data = await api.matches.getInterviewQuestions(skillList, difficulty);
      setQuestions(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadQuestions(); }, []);

  const typeColors: Record<string, string> = {
    hr: 'bg-purple-100 text-purple-700',
    technical: 'bg-blue-100 text-blue-700',
    coding: 'bg-green-100 text-green-700',
    scenario: 'bg-orange-100 text-orange-700',
    behavioral: 'bg-pink-100 text-pink-700',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Interview Preparation</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <div className="flex gap-2">
              <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. JavaScript, React, Node.js"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              <button onClick={loadQuestions} disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
                {loading ? 'Loading...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FiMessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Click Generate to get interview questions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id || i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                className="w-full flex items-start justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[q.type] || 'bg-gray-100 text-gray-700'}`}>
                      {q.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      q.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
                      q.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                    }`}>{q.difficulty}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{q.question}</p>
                </div>
                {expanded === q.id ? <FiChevronUp className="text-gray-400 ml-2 mt-1 shrink-0" /> : <FiChevronDown className="text-gray-400 ml-2 mt-1 shrink-0" />}
              </button>
              {expanded === q.id && q.answer && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-600">{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
