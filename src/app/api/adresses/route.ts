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

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const newAddress = await db
      .insert(addresses)
      .values({
        full_name: body.full_name,
        phone_number: body.phone_number,
        city: body.city,
        address_line1: body.address_line1,
        address_line2: body.address_line2,
        postal_code: body.postal_code,
        country: body.country,
        user_id: session.user.id,
      })
      .returning();

    return NextResponse.json(newAddress[0]);
  } catch (error) {
    console.error('[POST /api/adresses]', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
