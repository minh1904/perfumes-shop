// file: /app/api/admin/orders/route.ts

import { db } from '@/db/db';
import { orders, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await db
    .select({
      id: orders.id,
      total_amount: orders.total_amount,
      status: orders.status,
      created_at: orders.created_at,
      shipping_full_name: orders.shipping_full_name,
      user: {
        name: users.name,
      },
    })
    .from(orders)
    .leftJoin(users, eq(orders.user_id, users.id))
    .orderBy(desc(orders.created_at));

  return NextResponse.json({ orders: result });
}
