import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import {prisma} from '@/utils/db';

// Get the authenticated user or return null
async function getAuthenticatedUser() {
  try {
    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the user's session
    console.log('Getting session in users API route...');
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log("Data:", await supabase.auth.getUser() )
    if (error) {
      console.error('Error getting session in API route:', error);
    }
    
    console.log('Session in API route:', session ? `Found (${session.user.email})` : 'Not found');
    
    if (!session || !session.user) {
      console.log('No valid session found in API route');
      return null;
    }
    
    // Check if user exists in database
    let dbUser = await prisma.user.findFirst({
      where: { email: session.user.email! }
    });
    
    // Create user if doesn't exist
    if (!dbUser) {
      console.log('Creating new user in database for:', session.user.email);
      dbUser = await prisma.user.create({
        data: {
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
        }
      });
      console.log('Created new user:', dbUser);
    } else {
      console.log('Found existing user in database:', dbUser.id);
    }
    
    return dbUser;
  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }
    
    // Get data from request
    const body = await req.json();
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name
        // Add other fields as needed
      }
    });
    
    return NextResponse.json({ 
      message: "User updated successfully",
      user: updatedUser 
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
} 