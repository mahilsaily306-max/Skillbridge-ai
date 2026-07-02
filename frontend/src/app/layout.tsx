import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'SkillBridge AI - AI-Powered Career Assistant',
  description: 'Analyze your resume, identify skill gaps, and get personalized learning roadmaps.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
