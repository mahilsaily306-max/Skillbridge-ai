'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiBookOpen, FiCheckCircle, FiClock, FiExternalLink } from 'react-icons/fi';

export default function RoadmapPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.matches.getRoadmap()
      .then(setRoadmaps)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  if (roadmaps.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Roadmap</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FiBookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No roadmap yet</h2>
          <p className="text-gray-500 mb-6">Match your resume with a job description to generate a personalized learning roadmap</p>
          <a href="/match" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Go to Skill Match
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Learning Roadmap</h1>

      {roadmaps.map((roadmap: any) => (
        <div key={roadmap.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Personalized Learning Plan</h2>
              <p className="text-sm text-gray-500">{roadmap.weeks.length} weeks &middot; Created {new Date(roadmap.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
          </div>

          <div className="space-y-4">
            {roadmap.weeks.map((week: any, i: number) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">W{i + 1}</span>
                    <span className="font-medium text-gray-900">{week.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">{week.skills[0]?.resources.estimatedHours || '~'} hours</span>
                </div>
                <div className="p-4">
                  {week.skills.map((skill: any, j: number) => (
                    <div key={j} className="space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">{skill.resources.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              skill.resources.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
                              skill.resources.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' :
                              'bg-red-50 text-red-700'
                            }`}>{skill.resources.difficulty}</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs flex items-center gap-1">
                              <FiClock size={12} /> {skill.resources.estimatedHours}h
                            </span>
                          </div>

                          {skill.resources.freeCourses?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Free Courses</p>
                              <div className="space-y-1">
                                {skill.resources.freeCourses.map((c: any, k: number) => (
                                  <a key={k} href={c.url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                    <FiExternalLink size={12} /> {c.title} ({c.platform})
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {skill.resources.miniProjects?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1">Mini Projects</p>
                              {skill.resources.miniProjects.map((p: any, k: number) => (
                                <p key={k} className="text-sm text-gray-600">&bull; {p.title}: {p.description}</p>
                              ))}
                            </div>
                          )}

                          {skill.resources.officialDocs && (
                            <a href={skill.resources.officialDocs} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2">
                              <FiExternalLink size={12} /> Official Documentation
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
