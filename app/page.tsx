'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import AuthModal from './components/AuthModal';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Social Media Manager</h1>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Manage Your Social Media Content
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Create, schedule, and track your social media posts from one place.
            Get content ideas and analytics to grow your audience.
          </p>
          <div className="mt-8">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create Posts</h3>
            <p className="text-gray-500">Create engaging posts with images, formatting, and links.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Content</h3>
            <p className="text-gray-500">Plan and schedule your content calendar in advance.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track Analytics</h3>
            <p className="text-gray-500">Monitor engagement and performance of your posts.</p>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
