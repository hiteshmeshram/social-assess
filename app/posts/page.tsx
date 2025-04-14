"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import AuthButton from '../components/AuthButton';
import { useAuth } from '@/utils/AuthContext';
import { supabase } from '@/utils/supabase';

interface Engagement {
  likes: number;
  comments: number;
  shares: number;
}

interface Post {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status: 'published' | 'draft' | 'scheduled';
  scheduledFor: string | null;
  engagement: Engagement;
}

interface PostFormData {
  title: string;
  description: string;
  imageUrl: string;
  scheduledFor: string;
}

// Mock data for demonstration
const MOCK_POSTS: Post[] = [
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
  { 
    id: 3, 
    title: "Meet Our Chef Series", 
    description: "Get to know the talented individuals behind your favorite dishes", 
    imageUrl: "https://placehold.co/600x400", 
    status: "draft",
    scheduledFor: null,
    engagement: { likes: 0, comments: 0, shares: 0 }
  }
];

export default  function Posts() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [filter, setFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  
  // const res = await supabase.auth.getUser()
  // console.log(res)
  // Check for create=true in URL parameter - Keep all hooks BEFORE any conditional returns
  useEffect(() => {
    const createParam = searchParams.get('create');
    if (createParam === 'true') {
      // Get title and description if present
      const title = searchParams.get('title');
      const description = searchParams.get('description');
      
      // Open the create modal with pre-filled data if available
      setEditingPost(null); // Ensure we're creating, not editing
      setIsCreateModalOpen(true);
      
      // Update URL to remove the parameters (optional)
      const url = new URL(window.location.href);
      url.searchParams.delete('create');
      url.searchParams.delete('title');
      url.searchParams.delete('description');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams]);
  
  // Filter posts based on selected filter
  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.status === filter);
    
  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      console.log('Fetching posts...');
      const user = JSON.parse(localStorage.getItem('authUser') ?? "")
      const response = await axios.get('/api/posts',{
        headers: {
          userId: user!.id!
        }
      });
      if (response.data.posts) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  // Load posts on initial render
  useEffect(() => {
    fetchPosts();
  }, []);
    
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsCreateModalOpen(true);
  };
  
  const handleCreatePost = () => {
    setEditingPost(null);
    setIsCreateModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingPost(null);
  };
  
  const handleSavePost = async (formData: PostFormData) => {
    try {
      if (editingPost) {
        // Update existing post via API
        console.log('Updating post:', editingPost.id);
        await axios.put('/api/posts', {
          id: editingPost.id,
          ...formData,
          status: formData.scheduledFor ? 'scheduled' : editingPost.status
        });
      } else {
        // Create new post via API
        console.log('Creating new post');
        await axios.post('/api/posts', {
          ...formData,
          status: formData.scheduledFor ? 'scheduled' : 'draft',
        });
      }
      
      // Refresh posts after saving
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      handleCloseModal();
    }
  };
  
  const handleDeletePost = async (postId: number) => {
    try {
      console.log('Deleting post:', postId);
      await axios.delete(`/api/posts?id=${postId}`);
      
      // Refresh posts after deleting
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  
  // NOW we can have conditional rendering after all hooks are called
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
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Manage Posts</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleCreatePost}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Create New Post
            </button>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Posts
            </button>
            <button 
              onClick={() => setFilter('published')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Published
            </button>
            <button 
              onClick={() => setFilter('draft')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'draft' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Drafts
            </button>
            <button 
              onClick={() => setFilter('scheduled')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'scheduled' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Scheduled
            </button>
          </div>
          
          <div>
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-4">You don't have any {filter !== 'all' ? filter : ''} posts yet.</p>
            <button 
              onClick={handleCreatePost}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <li key={post.id}>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
                          {post.imageUrl && (
                            <div className="relative w-full h-full">
                              <Image 
                                src={post.imageUrl.startsWith('http') ? post.imageUrl : `https://${post.imageUrl}`} 
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
                              : post.status === 'scheduled'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status === 'published' 
                              ? 'Published' 
                              : post.status === 'scheduled' 
                                ? 'Scheduled' 
                                : 'Draft'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{post.description}</p>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {post.status === 'published' 
                              ? 'Published on ' 
                              : post.status === 'scheduled'
                                ? 'Scheduled for '
                                : 'Last edited on '}
                            {post.scheduledFor 
                              ? new Date(post.scheduledFor).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) 
                              : 'Not scheduled'}
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
                            <button 
                              onClick={() => handleEditPost(post)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Delete
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
        )}
      </main>
      
      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <PostFormModal 
          post={editingPost} 
          onClose={handleCloseModal} 
          onSave={handleSavePost}
        />
      )}
    </div>
  );
}

interface PostFormModalProps {
  post: Post | null;
  onClose: () => void;
  onSave: (formData: PostFormData) => void;
}

function PostFormModal({ post, onClose, onSave }: PostFormModalProps) {
  const searchParams = useSearchParams();
  const isEditing = !!post;
  
  // Get title and description from URL parameters if present
  const titleFromUrl = searchParams.get('title');
  const descriptionFromUrl = searchParams.get('description');
  
  const [formData, setFormData] = useState<PostFormData>({
    title: post?.title || titleFromUrl || '',
    description: post?.description || descriptionFromUrl || '',
    imageUrl: post?.imageUrl || '',
    scheduledFor: post?.scheduledFor || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData)
    const user = JSON.parse(localStorage.getItem('authUser') ?? "")
    const res = await axios.post('/api/posts',{formData,userId: user!.id!})
    console.log(formData)
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter post title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter post description"
                required
              />
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter image URL or upload an image"
              />
              <div className="mt-2 flex items-center">
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Upload Image
                </button>
                {formData.imageUrl && (
                  <div className="ml-4 w-16 h-16 bg-gray-200 rounded overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image 
                        src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `https://${formData.imageUrl}`} 
                        alt="Post preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700">
                Schedule Post
              </label>
              <input
                type="datetime-local"
                id="scheduledFor"
                name="scheduledFor"
                value={formData.scheduledFor}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to save as draft
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 