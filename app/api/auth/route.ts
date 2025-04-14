import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      authenticated: !!session,
      user: session?.user || null 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      authenticated: false, 
      user: null,
      error: 'Failed to check authentication status'
    }, { status: 500 });
  }
} 