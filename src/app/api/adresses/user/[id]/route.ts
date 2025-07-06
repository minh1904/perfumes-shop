import { auth } from '@/auth';
import { db } from '@/db/db';
import { addresses } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const searchParams = req.nextUrl.searchParams;
  const getDefault = searchParams.get('default') === 'true';

  try {
    const query = db.select().from(addresses).where(eq(addresses.user_id, id));

    const result = getDefault
      ? await query.orderBy(desc(addresses.is_default)).limit(1)
      : await query;

    if (!result || result.length === 0) {
      return NextResponse.json([], { status: 404 });
    }

    return NextResponse.json(getDefault ? result[0] : result);
  } catch (error) {
    console.error('[GET /api/adresses/user/:id]', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (params.id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();

  try {
    const updated = await db
      .update(addresses)
      .set({
        full_name: body.full_name,
        phone_number: body.phone_number,
        city: body.city,
        address_line1: body.address_line1,
        address_line2: body.address_line2,
        postal_code: body.postal_code,
        country: body.country,
      })
      .where(and(eq(addresses.id, body.id), eq(addresses.user_id, session.user.id)))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[PUT /api/adresses/user/:id]', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}
