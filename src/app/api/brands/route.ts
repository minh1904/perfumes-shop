import { db } from '@/db/db';
import { brands } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await db.select().from(brands);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('GET /brands error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load brands' }, { status: 500 });
  }
}
