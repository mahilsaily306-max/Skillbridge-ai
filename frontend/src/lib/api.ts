const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      request<{ token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    googleAuth: (data: { email: string; name: string; googleId: string }) =>
      request<{ token: string; user: any }>('/auth/google', { method: 'POST', body: JSON.stringify(data) }),
    forgotPassword: (email: string) =>
      request<{ message: string; resetToken: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token: string, newPassword: string) =>
      request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
    getProfile: () => request<any>('/auth/profile'),
    updateProfile: (data: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  resumes: {
    upload: (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return request<any>('/resumes/upload', { method: 'POST', body: fd });
    },
    getAll: () => request<any[]>('/resumes'),
    getById: (id: string) => request<any>(`/resumes/${id}`),
    analyze: (id: string) => request<any>(`/resumes/${id}/analyze`),
    delete: (id: string) => request<any>(`/resumes/${id}`, { method: 'DELETE' }),
  },
  jobs: {
    create: (data: { text: string; title?: string; company?: string }) =>
      request<any>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    upload: (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return request<any>('/jobs/upload', { method: 'POST', body: fd });
    },
    getAll: () => request<any[]>('/jobs'),
    getById: (id: string) => request<any>(`/jobs/${id}`),
    update: (id: string, data: any) => request<any>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/jobs/${id}`, { method: 'DELETE' }),
  },
  matches: {
    create: (resumeId: string, jobId: string) =>
      request<{ match: any; roadmap: any }>('/matches', { method: 'POST', body: JSON.stringify({ resumeId, jobId }) }),
    getHistory: () => request<any[]>('/matches/history'),
    getRoadmap: () => request<any[]>('/matches/roadmap'),
    getInterviewQuestions: (skills?: string[], difficulty?: string) => {
      const params = new URLSearchParams();
      if (skills?.length) params.set('skills', skills.join(','));
      if (difficulty) params.set('difficulty', difficulty);
      return request<any[]>(`/matches/interview-questions?${params}`);
    },
    getSalary: (role: string, country?: string, experience?: string) => {
      const params = new URLSearchParams({ role });
      if (country) params.set('country', country);
      if (experience) params.set('experience', experience);
      return request<any>(`/matches/salary?${params}`);
    },
  },
  reports: {
    generate: (resumeId: string, jobId?: string) =>
      request<any>('/reports', { method: 'POST', body: JSON.stringify({ resumeId, jobId }) }),
    getAll: () => request<any[]>('/reports'),
    getById: (id: string) => request<any>(`/reports/${id}`),
  },
  savedJobs: {
    save: (jobId: string, notes?: string) =>
      request<any>('/saved-jobs', { method: 'POST', body: JSON.stringify({ jobId, notes }) }),
    getAll: () => request<any[]>('/saved-jobs'),
    update: (id: string, data: any) => request<any>(`/saved-jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/saved-jobs/${id}`, { method: 'DELETE' }),
  },
  notifications: {
    getAll: () => request<any[]>('/notifications'),
    markRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request<any>('/notifications/read-all', { method: 'PUT' }),
  },
  progress: {
    get: () => request<any>('/progress'),
    update: (data: any) => request<any>('/progress', { method: 'PUT', body: JSON.stringify(data) }),
  },
  resources: {
    learning: () => request<any[]>('/resources/learning'),
    learningBySkill: (skill: string) => request<any>(`/resources/learning/${skill}`),
    certificates: (skill?: string) => {
      const params = skill ? `?skill=${skill}` : '';
      return request<any[]>(`/resources/certificates${params}`);
    },
    interviewQuestions: (type?: string, difficulty?: string) => {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (difficulty) params.set('difficulty', difficulty);
      return request<any[]>(`/resources/interview-questions?${params}`);
    },
  },
  analytics: {
    getUser: () => request<any>('/analytics'),
    getAdmin: () => request<any>('/analytics/admin'),
  },
};
