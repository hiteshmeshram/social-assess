import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/utils/db';
import { supabase } from '@/utils/supabase';
import { prisma } from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log(email , password)
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log(res)
    // const data = await supabase.auth.signInWithPassword({email,password})
    // console.log(data)

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // User doesn't exist in our database
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // // In a real application, you'd verify the password here
    // // This is a simplified version that just checks if passwords match
    // if (user.password !== password) {
    //   return NextResponse.json(
    //     { error: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }


    // return NextResponse.json("")
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error during sign in:', error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
} 