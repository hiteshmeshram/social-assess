'use client';

import React, { useState } from 'react';
import { useAuth } from '@/utils/AuthContext';
import Link from 'next/link';
import AuthModal from './AuthModal';

export default function AuthButton() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      setShowDropdown(!showDropdown);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleAuthClick}
        className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        {user ? (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="ml-2 hidden md:block">{user.name || user.email}</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={showDropdown ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </div>
        ) : (
          <span className="text-blue-600 hover:text-blue-800">Sign In</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowDropdown(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
} 