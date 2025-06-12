import { auth } from '@/auth';
import { db } from '@/db/db';
import { addresses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userAddresses = await db
    .select()
    .from(addresses)
    .where(eq(addresses.user_id, session.user.id));

  return NextResponse.json(userAddresses);
}
