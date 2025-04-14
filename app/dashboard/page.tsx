"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthButton from "../components/AuthButton";
import { useAuth } from '@/utils/AuthContext';

interface ContentIdea {
  id: number;
  title: string;
  description: string;
}

// Mock data for demonstration
const MOCK_BUSINESS = {
  name: "Sunset Cafe",
  type: "Restaurant",
  location: "New York, NY",
  description: "Family-owned cafe serving breakfast and lunch"
};

const MOCK_CONTENT_IDEAS = [
  { id: 1, title: "Top 5 Summer Dishes in New York", description: "Highlight your refreshing summer menu items with beautiful photography" },
  { id: 2, title: "Weekend Brunch Special", description: "Promote your weekend brunch offerings with a special discount" },
  { id: 3, title: "Local Ingredients Spotlight", description: "Feature posts about your locally-sourced ingredients and suppliers" },
];

const MOCK_POSTS = [
  { 
    id: 1, 
    title: "New Summer Menu Launch", 
    description: "Check out our refreshing new summer items!", 
    imageUrl: "https://placehold.co/600x400", 
    status: "published",
    scheduledFor: "2023-06-15T10:00:00Z",
    engagement: { likes: 45, comments: 12, shares: 8 }
  },
  { 
    id: 2, 
    title: "Weekend Special: 20% Off", 
    description: "Join us this weekend for special discounts on all desserts", 
    imageUrl: "https://placehold.co/600x400", 
    status: "draft",
    scheduledFor: "2023-06-18T09:00:00Z",
    engagement: { likes: 0, comments: 0, shares: 0 }
  },
];

const MOCK_ANALYTICS = {
  totalPosts: 24,
  totalEngagement: 1250,
  topPerforming: "New Summer Menu Launch",
  recentGrowth: "+15%"
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleCreateNewPost = async () => {
    // Option 1: Redirect to the posts page with a create modal flag
    router.push('/posts?create=true');
    
    // Option 2: Create a post directly via API
    /*
    setIsCreatingPost(true);
    setError(null);
    
    try {
      console.log('Creating new post...');
      const response = await axios.post('/api/posts', {
        title: "New Post",
        description: "Draft post created from dashboard", 
        imageUrl: "https://placehold.co/600x400",
        status: "draft",
        scheduledFor: null
      });
      
      console.log('Post created:', response.data);
      
      // Navigate to the posts page to manage the new post
      router.push('/posts');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsCreatingPost(false);
    }
    */
  };

  const handleUseIdea = (idea: ContentIdea) => {
    // Create a post from the idea
    router.push(`/posts?create=true&title=${encodeURIComponent(idea.title)}&description=${encodeURIComponent(idea.description)}`);
  };

  // NOW we can have conditional rendering after all hooks and functions are defined
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Social Media Manager</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleCreateNewPost}
              disabled={isCreatingPost}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                isCreatingPost ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isCreatingPost ? 'Creating...' : '+ New Post'}
            </button>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Display error message if present */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("content")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "content" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Content Ideas
            </button>
            <button 
              onClick={() => setActiveTab("posts")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "posts" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Posts
            </button>
            <button 
              onClick={() => setActiveTab("analytics")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "analytics" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Business Profile Card */}
            <div className="col-span-1 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Business Profile</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="font-medium">{MOCK_BUSINESS.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{MOCK_BUSINESS.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{MOCK_BUSINESS.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium">{MOCK_BUSINESS.description}</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Edit Profile
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Posts</h3>
                <p className="text-3xl font-bold">{MOCK_ANALYTICS.totalPosts}</p>
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <span>↑ 12% from last month</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Engagement</h3>
                <p className="text-3xl font-bold">{MOCK_ANALYTICS.totalEngagement}</p>
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <span>↑ 8% from last month</span>
                </div>
              </div>
              
              <div className="col-span-2 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">New post scheduled for tomorrow at 9:00 AM</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">3 new content ideas generated based on your location</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm">Your last post received 45 likes and 12 comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Content Ideas</h2>
              <button 
                onClick={() => router.push('/content-ideas')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Generate New Ideas
              </button>
            </div>
            
            {/* Ideas List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {MOCK_CONTENT_IDEAS.map((idea) => (
                  <li key={idea.id}>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{idea.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{idea.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleUseIdea(idea)}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                          >
                            Use Idea
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Manage Posts</h2>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-md py-2 px-3 text-sm">
                  <option>All Posts</option>
                  <option>Published</option>
                  <option>Drafts</option>
                  <option>Scheduled</option>
                </select>
                <button 
                  onClick={handleCreateNewPost}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  + New Post
                </button>
              </div>
            </div>
            
            {/* Posts List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {MOCK_POSTS.map((post) => (
                  <li key={post.id}>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                            {post.imageUrl && (
                              <div className="relative w-full h-full">
                                <Image 
                                  src={post.imageUrl} 
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{post.description}</p>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              {post.status === 'published' 
                                ? 'Published on ' 
                                : 'Scheduled for '}
                              {new Date(post.scheduledFor).toLocaleDateString()}
                            </div>
                            
                            <div className="flex space-x-2">
                              {post.status === 'published' && (
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    {post.engagement.likes}
                                  </span>
                                  <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                    {post.engagement.comments}
                                  </span>
                                  <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                    </svg>
                                    {post.engagement.shares}
                                  </span>
                                </div>
                              )}
                              <button className="text-sm text-blue-600 hover:text-blue-800">
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Posts</p>
                    <p className="text-2xl font-bold">{MOCK_ANALYTICS.totalPosts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Engagement</p>
                    <p className="text-2xl font-bold">{MOCK_ANALYTICS.totalEngagement}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Top Performing Post</p>
                    <p className="font-medium">{MOCK_ANALYTICS.topPerforming}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Recent Growth</p>
                    <p className="text-2xl font-bold text-green-600">{MOCK_ANALYTICS.recentGrowth}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Breakdown</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">Chart Placeholder</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Likes</p>
                    <p className="text-xl font-bold text-blue-600">756</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Comments</p>
                    <p className="text-xl font-bold text-green-600">384</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Shares</p>
                    <p className="text-xl font-bold text-purple-600">110</p>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Audience Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Age Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm w-16">18-24</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                        <span className="text-sm w-10 text-right">30%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-16">25-34</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <span className="text-sm w-10 text-right">45%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-16">35-44</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                        <span className="text-sm w-10 text-right">15%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-16">45+</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                        <span className="text-sm w-10 text-right">10%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm w-24">New York</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                        <span className="text-sm w-10 text-right">60%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-24">Brooklyn</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                        <span className="text-sm w-10 text-right">20%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-24">Queens</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                        <span className="text-sm w-10 text-right">15%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-24">Other</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "5%" }}></div>
                        </div>
                        <span className="text-sm w-10 text-right">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
