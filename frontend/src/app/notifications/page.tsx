'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiBell, FiCheckCircle, FiBookOpen, FiTarget, FiAward, FiCalendar } from 'react-icons/fi';

const typeIcons: Record<string, any> = {
  learning_reminder: FiBookOpen,
  resume_reminder: FiTarget,
  course_recommendation: FiAward,
  goal_complete: FiCheckCircle,
  interview_reminder: FiCalendar,
};

const typeColors: Record<string, string> = {
  learning_reminder: 'bg-blue-100 text-blue-600',
  resume_reminder: 'bg-purple-100 text-purple-600',
  course_recommendation: 'bg-green-100 text-green-600',
  goal_complete: 'bg-orange-100 text-orange-600',
  interview_reminder: 'bg-pink-100 text-pink-600',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await api.notifications.getAll();
      setNotifications(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await api.notifications.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await api.notifications.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline font-medium">Mark all as read</button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FiBell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h2>
          <p className="text-gray-500">You are all caught up! Notifications will appear here when you have learning reminders, course recommendations, and more.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const Icon = typeIcons[n.type] || FiBell;
            const color = typeColors[n.type] || 'bg-gray-100 text-gray-600';
            return (
              <div key={n.id}
                className={`bg-white rounded-xl border p-4 transition-colors ${n.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50/50'}`}
                onClick={() => !n.read && markRead(n.id)}>
                <div className="flex items-start gap-3 cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
