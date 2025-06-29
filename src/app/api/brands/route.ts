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
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    // Tạo slug từ name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    await db.insert(brands).values({ name, slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /brands error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
