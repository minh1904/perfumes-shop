import { auth } from '@/auth';
import { db } from '@/db/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: { id: string } }): Promise<Response> {
  const { id } = context.params;
  const session = await auth();

  // ✅ Kiểm tra đăng nhập
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Kiểm tra không cho xem đơn hàng của người khác
  if (id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const result = await db
      .select({
        id: orders.id,
        status: orders.status,
        total_amount: orders.total_amount,
        created_at: orders.created_at,
      })
      .from(orders)
      .where(eq(orders.user_id, session.user.id))
      .orderBy(orders.created_at);

    return NextResponse.json({ orders: result });
  } catch (error) {
    console.error('[GET /api/orders/user/:id]', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
