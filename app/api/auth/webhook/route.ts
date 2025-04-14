import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/utils/db';

/**
 * Webhook handler for Supabase Auth events
 * This endpoint should be configured in Supabase Auth Webhooks:
 * https://supabase.com/dashboard/project/_/auth/auth-webhooks
 * 
 * Events to listen for:
 * - user.created: When a user signs up
 * - user.updated: When a user updates their profile
 * - user.deleted: When a user is deleted
 */
export async function POST(req: NextRequest) {
  // You should set a secret in Supabase and verify it here
  // const authHeader = req.headers.get('Authorization');
  // if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const payload = await req.json();
    const event = payload.type;
    const user = payload.record;

    console.log(`Received webhook: ${event}`, user);

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event) {
      case 'user.created':
        // Create user in database
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email }
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.user_metadata?.name || user.email.split('@')[0]
            }
          });
          console.log('Created new user in database:', newUser);
        }
        break;

      case 'user.updated':
        // Update user in database
        const updatedUser = await prisma.user.findFirst({
          where: { email: user.email }
        });
        
        if (updatedUser) {
          await prisma.user.update({
            where: { id: updatedUser.id },
            data: {
              name: user.user_metadata?.name || updatedUser.name
            }
          });
          console.log('Updated user in database:', updatedUser.id);
        }
        break;

      case 'user.deleted':
        // We can choose to either delete the user or mark them as inactive
        // For this example, we'll just log the event
        console.log('User deleted in Supabase:', user.email);
        break;

      default:
        console.log('Unhandled webhook event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 