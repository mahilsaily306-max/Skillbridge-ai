'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { FiSave, FiUser, FiMail, FiMapPin, FiPhone, FiGithub, FiLinkedin, FiGlobe } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.auth.getProfile().then(data => {
      const p = data.profile || {};
      setName(data.user.name || '');
      setHeadline(p.headline || '');
      setBio(p.bio || '');
      setLocation(p.location || '');
      setPhone(p.phone || '');
      setLinkedin(p.linkedin || '');
      setGithub(p.github || '');
      setPortfolio(p.portfolio || '');
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.auth.updateProfile({ name, headline, bio, location, phone, linkedin, github, portfolio });
      updateUser({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {name.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{name || 'User'}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><FiUser className="inline mr-1" size={14} />Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><FiMail className="inline mr-1" size={14} />Email</label>
            <input value={user?.email || ''} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. Full Stack Developer" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><FiMapPin className="inline mr-1" size={14} />Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><FiPhone className="inline mr-1" size={14} />Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><FiLinkedin className="inline mr-1" size={14} />LinkedIn</label>
            <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><FiGithub className="inline mr-1" size={14} />GitHub</label>
            <input value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1"><FiGlobe className="inline mr-1" size={14} />Portfolio</label>
            <input value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium text-sm">
          <FiSave size={16} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
