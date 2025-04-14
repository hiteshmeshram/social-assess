import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import {  prisma } from '@/utils/db';


export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    console.log(email,password)
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const data = await supabase.auth.signUp({email,password})
    console.log(data)

    // Check if user already exists
    // const existingUser = await prisma.user.findUnique({
    //   where: { email }
    // });

    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: "User with this email already exists" },
    //     { status: 400 }
    //   );
    // }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password, // In a real app, you'd hash this password
        name: name || email.split('@')[0]
      }
    });

    // console.log('Created new user:', user);

    return NextResponse.json({
      success: true,
      message: "User registered successfully"
    });
  } catch (error: any) {
    console.error('Error during registration:', error);
    
    // Check for Prisma-specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
} 