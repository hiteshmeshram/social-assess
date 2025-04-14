'use client';

import { useState } from 'react';
import { useAuth } from '@/utils/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (activeTab === 'login') {
        // Handle login
        await signIn(email, password);
        console.log('User logged in successfully');
        onClose();
      } else {
        // Handle registration
        const { success, error: signUpError } = await signUp(email, password, name);
        console.log('Registration result:', { success, signUpError });
        
        if (!success) {
          setError(signUpError || 'Registration failed. Please try again.');
          return;
        }
        
        // Show success message
        setSuccess('Registration successful! You can now sign in with your credentials.');
        
        // Clear form
        setEmail('');
        setPassword('');
        setName('');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button 
            className={`py-2 px-4 ${activeTab === 'login' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500'}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'register' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500'}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
         
        <form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading 
              ? 'Please wait...' 
              : activeTab === 'login' 
                ? 'Sign In' 
                : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
} 