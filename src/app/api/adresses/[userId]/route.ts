import { NextRequest, NextResponse } from 'next/server';

import { addresses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db/db';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    const [address] = await db
      .select()
      .from(addresses)
      .where(eq(addresses.user_id, userId))
      .orderBy(desc(addresses.is_default)) // lấy địa chỉ mặc định
      .limit(1);

    if (!address) {
      return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(address);
  } catch (err) {
    console.error('[ADDRESS_FETCH_ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}
