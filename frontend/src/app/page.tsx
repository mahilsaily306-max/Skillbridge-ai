'use client';
import Link from 'next/link';
import { FiUpload, FiSearch, FiTrendingUp, FiAward, FiArrowRight, FiCheckCircle, FiBookOpen, FiFileText } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">SkillBridge AI</span>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
              <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Get Started Free</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Bridge Your Skills to<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Your Dream Job</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume, paste a job description, and get AI-powered analysis to identify skill gaps, improve your resume, and get a personalized learning roadmap.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-lg">
              Start Analyzing <FiArrowRight />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: FiUpload, title: 'Upload Resume', desc: 'Upload your resume in PDF, DOCX, or TXT format.' },
              { icon: FiSearch, title: 'Paste Job Description', desc: 'Paste or upload the job description you are targeting.' },
              { icon: FiTrendingUp, title: 'AI Analysis', desc: 'Our AI analyzes your resume against the job requirements.' },
              { icon: FiBookOpen, title: 'Get Roadmap', desc: 'Receive a personalized learning roadmap to fill skill gaps.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiCheckCircle, title: 'ATS Score', desc: 'Check how ATS-friendly your resume is with detailed feedback.' },
              { icon: FiTrendingUp, title: 'Skill Match', desc: 'See your compatibility percentage and identify missing skills.' },
              { icon: FiBookOpen, title: 'Learning Roadmap', desc: 'Get a weekly learning plan with free resources and projects.' },
              { icon: FiFileText, title: 'Resume Builder', desc: 'Generate ATS-optimized resumes with multiple templates.' },
              { icon: FiAward, title: 'Certificate Recommendations', desc: 'Discover free certifications from trusted providers.' },
              { icon: FiSearch, title: 'Keyword Analysis', desc: 'Identify missing keywords to improve your resume match rate.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <item.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-lg text-blue-100 mb-8">Join thousands of job seekers who use SkillBridge AI to improve their resumes and careers.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-white text-blue-600 font-medium hover:bg-blue-50 transition-colors text-lg">
            Get Started Free <FiArrowRight />
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SkillBridge AI. All rights reserved.
      </footer>
    </div>
  );
}
