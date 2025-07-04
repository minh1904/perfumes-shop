import { NextRequest, NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { cartItems } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ message: 'Missing user_id' }, { status: 400 });
    }

    await db.delete(cartItems).where(eq(cartItems.user_id, user_id));

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
