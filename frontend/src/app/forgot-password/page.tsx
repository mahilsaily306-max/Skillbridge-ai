'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.auth.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">SkillBridge AI</Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FiMail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 mb-6">We sent a password reset link to {email}</p>
              <Link href="/login" className="text-blue-600 font-medium hover:underline">Back to login</Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
                <FiArrowLeft size={16} /> Back to login
              </Link>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h2>
              <p className="text-gray-500 mb-8">Enter your email and we will send you a reset link</p>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="you@example.com" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
