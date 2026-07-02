'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FiSearch, FiBookOpen, FiClock, FiBarChart2, FiChevronDown, FiChevronUp, FiExternalLink, FiStar, FiFilter, FiGrid, FiList, FiLayers } from 'react-icons/fi';

const skillCategories: Record<string, { skills: string[]; color: string; }> = {
  'Programming Languages': {
    skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin'],
    color: 'from-blue-500 to-blue-600',
  },
  'Frameworks & Libraries': {
    skills: ['React', 'Node.js', 'Next.js', 'Express.js', 'Angular', 'Vue', 'Django', 'Flask', 'Spring Boot', 'SwiftUI'],
    color: 'from-green-500 to-green-600',
  },
  'Databases': {
    skills: ['SQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra', 'MariaDB'],
    color: 'from-purple-500 to-purple-600',
  },
  'Cloud & DevOps': {
    skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'Linux'],
    color: 'from-orange-500 to-orange-600',
  },
  'Data Science & ML': {
    skills: ['Machine Learning', 'Deep Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'NLP', 'Computer Vision'],
    color: 'from-pink-500 to-pink-600',
  },
  'Soft Skills': {
    skills: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking', 'Adaptability', 'Creativity'],
    color: 'from-teal-500 to-teal-600',
  },
  'Tools & Platforms': {
    skills: ['Git', 'Docker', 'REST APIs', 'GraphQL', 'Jira', 'Figma', 'Postman', 'Web3'],
    color: 'from-indigo-500 to-indigo-600',
  },
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  advanced: 'bg-red-100 text-red-700 border-red-200',
};

export default function SkillsPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.resources.learning()
      .then(setResources)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter(r => {
    if (search && !r.skill.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedDifficulty && r.difficulty !== selectedDifficulty) return false;
    if (selectedCategory) {
      const cat = Object.entries(skillCategories).find(([_, v]) => v.skills.some(s => s.toLowerCase() === r.skill.toLowerCase()));
      if (!cat || cat[0] !== selectedCategory) return false;
    }
    return true;
  });

  const getSkillCategory = (skill: string): string => {
    for (const [cat, data] of Object.entries(skillCategories)) {
      if (data.skills.some(s => s.toLowerCase() === skill.toLowerCase())) return cat;
    }
    return 'Other';
  };

  const userSkills = resources
    .filter(r => r.difficulty)
    .map(r => ({
      name: r.skill,
      category: getSkillCategory(r.skill),
      difficulty: r.difficulty,
      hours: r.estimatedHours || 0,
      hasResources: true,
    }));

  const categoryCounts: Record<string, number> = {};
  userSkills.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills Library</h1>
          <p className="text-gray-500 mt-1">Browse all skills with learning resources</p>
        </div>
        <Link href="/match" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <FiBarChart2 size={16} /> Analyze Your Skills
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-600 transition-colors">
            <FiFilter size={16} /> Filters {showFilters ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}><FiGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}><FiList size={16} /></button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-500 mr-1 self-center">Category:</span>
              {Object.keys(skillCategories).map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedCategory === cat ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-500 mr-1 self-center">Difficulty:</span>
              {['beginner', 'intermediate', 'advanced'].map(d => (
                <button key={d} onClick={() => setSelectedDifficulty(selectedDifficulty === d ? '' : d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedDifficulty === d ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(skillCategories).map(([cat, data]) => {
          const count = categoryCounts[cat] || 0;
          return (
            <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              className={`bg-white rounded-xl border p-3 text-center hover:shadow-md transition-all ${selectedCategory === cat ? 'border-blue-400 ring-2 ring-blue-200 shadow-md' : 'border-gray-200'}`}>
              <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${data.color} flex items-center justify-center mb-2`}>
                <FiLayers className="text-white" size={14} />
              </div>
              <p className="text-xs font-medium text-gray-700 truncate">{cat}</p>
              <p className="text-xs text-gray-400">{count} skills</p>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FiBookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No skills found matching your filters</p>
          <button onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedDifficulty(''); }} className="mt-2 text-blue-600 text-sm hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
          {filtered.map(r => {
            const cat = getSkillCategory(r.skill);
            const catColor = skillCategories[cat]?.color || 'from-gray-500 to-gray-600';
            const isExpanded = expandedSkill === r.skill;

            return viewMode === 'grid' ? (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
                <div className={`h-2 bg-gradient-to-r ${catColor}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{r.skill}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[r.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                      {r.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{r.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><FiClock size={12} /> {r.estimatedHours}h</span>
                    <span className="flex items-center gap-1"><FiStar size={12} /> {cat}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {r.freeCourses?.slice(0, 2).map((c: any, i: number) => (
                      <a key={i} href={c.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 transition-colors">
                        <FiExternalLink size={10} /> {c.platform}
                      </a>
                    ))}
                  </div>
                  <button onClick={() => setExpandedSkill(isExpanded ? null : r.skill)}
                    className="w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    {isExpanded ? 'Show Less' : 'View Resources'} {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                  </button>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 animate-fadeIn">
                      {r.freeCourses?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Free Courses</p>
                          {r.freeCourses.map((c: any, i: number) => (
                            <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline py-0.5">
                              <FiExternalLink size={10} /> {c.title}
                            </a>
                          ))}
                        </div>
                      )}
                      {r.miniProjects?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Mini Projects</p>
                          {r.miniProjects.map((p: any, i: number) => (
                            <p key={i} className="text-xs text-gray-600 py-0.5">- {p.title}: {p.description}</p>
                          ))}
                        </div>
                      )}
                      {r.officialDocs && (
                        <a href={r.officialDocs} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          <FiExternalLink size={10} /> Official Documentation
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={r.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-2 h-10 rounded bg-gradient-to-b ${catColor}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{r.skill}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[r.difficulty] || 'bg-gray-100 text-gray-600'}`}>{r.difficulty}</span>
                        <span className="text-xs text-gray-400">{r.estimatedHours}h</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                    </div>
                  </div>
                  <button onClick={() => setExpandedSkill(isExpanded ? null : r.skill)} className="text-gray-400 hover:text-blue-600 p-1">
                    {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </button>
                </div>
                {isExpanded && (
                  <div className="mt-3 ml-5 pl-4 border-l-2 border-blue-200 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {r.freeCourses?.map((c: any, i: number) => (
                        <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 transition-colors">
                          <FiExternalLink size={10} /> {c.title}
                        </a>
                      ))}
                    </div>
                    {r.miniProjects?.length > 0 && (
                      <p className="text-xs text-gray-500">Projects: {r.miniProjects.map((p: any) => p.title).join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
