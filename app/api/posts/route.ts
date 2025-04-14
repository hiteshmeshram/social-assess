// import prisma from "../../utils/db"

import { PostStatus } from "@/app/generated/prisma"
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/utils/AuthContext";
import { cookies } from "next/headers";
import { getSupabaseServerSession } from "@/utils/supabase-server";
import {prisma} from "@/utils/db";

interface Post {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  status: 'published' | 'draft' | 'scheduled';
  scheduledFor: string | null;
  userId?: number;
}

// Default user ID for testing
const DEFAULT_USER_ID = 1;

// Simple mock authentication check
// In a real app, you would verify the user's token
async function getAuthenticatedUserId(req: NextRequest): Promise<number | null> {
//   const session = await supabase.auth.getSession()
//   console.log(session)
//  const response = await supabase.auth.getUser();
//  console.log(response)
//  const userEmail = response.data.user?.email;
//  if(!userEmail) return null;

//  const user = await prisma.user.findUnique({
//   where:{ email: userEmail}
//  })
//  if(!user) return null;
// const user = localStorage.getItem('authUser')
// // const uesrId = user.id
// console.log(user)
// const supabase = createRouteHandlerClient({ cookies });
    
// // Get the user's session
// console.log('Getting session in users API route...');
// const user = await supabase.auth.getUser();
// console.log(user)
// // const { data: { session }, error } = await supabase.auth.getSession();

// console.log(session)
// console.log("Data:", await supabase.auth.getUser() )

const supabase = getSupabaseServerSession()
const data = await supabase.auth.getSession();
console.log(data);

  return 1
}

export async function GET(req: NextRequest) {
  console.log('GET /api/posts route handler called');
  
  try {
    // Get authenticated user ID
    const userId = req.headers.get('userId');
    console.log('Authenticated user ID:', userId);
    
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Get posts from database for the authenticated user
    const posts = await prisma.post.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/posts route handler called');
  
  try {
    const body = await req.json();
    console.log('Request body:', body);
    
    const { title, description, imageUrl, status, scheduledFor} = body.formData;
    const userId = body.userId;
    
    // Get authenticated user ID
    // const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.log('Creating post with data:', { 
      title, 
      description, 
      imageUrl: imageUrl || 'https://placehold.co/600x400', 
      status: status || 'draft', 
      scheduledFor, 
      userId
    });
    
    // Create new post in database with fallbacks for missing fields
    const post = await prisma.post.create({
      data: {
        title: title || 'New Post',
        description: description || 'New post description',
        imageUrl: imageUrl || 'https://placehold.co/600x400',
        status: (status as PostStatus) || 'draft',
        scheduledFor: scheduledFor || null,
        userId,
      }
    });
    
    console.log('Post created:', post);
    
    return NextResponse.json({
      message: "Post created successfully",
      post
    });
  } catch (error: any) {
    console.error("Error creating post:", error);
    console.error("Error details:", error.message);
    
    if (error.code) {
      console.error("Error code:", error.code);
    }
    
    if (error.meta) {
      console.error("Error meta:", error.meta);
    }
    
    return NextResponse.json(
      { error: "Failed to create post", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  console.log('PUT /api/posts route handler called');
  
  try {
    // Get authenticated user ID
    const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { id, title, description, imageUrl, status, scheduledFor } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }
    
    // Check if the post belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });
    
    if (!existingPost || existingPost.userId !== userId) {
      return NextResponse.json(
        { error: "Post not found or not authorized" },
        { status: 403 }
      );
    }
    
    // Update post in database
    const post = await prisma.post.update({
      where: {
        id: id
      },
      data: {
        title,
        description,
        imageUrl,
        status,
        scheduledFor
      }
    });
    
    console.log('Post updated:', post);
    
    return NextResponse.json({
      message: "Post updated successfully",
      post
    });
  } catch (error: any) {
    console.error("Error updating post:", error);
    
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  console.log('DELETE /api/posts route handler called');
  
  try {
    // Get authenticated user ID
    const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }
    
    const postId = parseInt(id);
    
    // Check if the post belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!existingPost || existingPost.userId !== userId) {
      return NextResponse.json(
        { error: "Post not found or not authorized" },
        { status: 403 }
      );
    }
    
    // Delete post from database
    await prisma.post.delete({
      where: {
        id: postId
      }
    });
    
    console.log('Post deleted:', id);
    
    return NextResponse.json({
      message: "Post deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}