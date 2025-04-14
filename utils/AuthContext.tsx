'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { supabase } from './supabase';

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<{success: boolean, error?: string}>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/posts', '/profile'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for saved auth in localStorage on initial load
  useEffect(() => {
    setIsLoading(true);
    const savedUser = localStorage.getItem('authUser');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('authUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Check if current route requires authentication and redirect if needed
  useEffect(() => {
    const redirectUnauthenticated = () => {
      const isProtectedRoute = PROTECTED_ROUTES.some(route => 
        pathname?.startsWith(route)
      );
      
      if (isProtectedRoute && !isLoading && !user) {
        router.push('/');
      }
    };
    
    redirectUnauthenticated();
  }, [pathname, isLoading, user, router]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Authenticate user and fetch from database
      const response = await axios.post('/api/auth/signin', { email, password });
      
      const data = response.data;
      if (response.data.user) {
        // Save to state and localStorage
        setUser(response.data.user);
        localStorage.setItem('authUser', JSON.stringify(response.data.user));
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

      } else {
        throw new Error('Invalid credentials');
      }
      
      return;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      
      // Create user in database via API
      const response = await axios.post('/api/auth/signup', { 
        email, 
        password,
        name: name || email.split('@')[0]
      });
      
      if (response.data.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Registration failed'
        };
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Registration failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear user from state and localStorage
      setUser(null);
      localStorage.removeItem('authUser');
      
      // Redirect to home page after sign out
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 