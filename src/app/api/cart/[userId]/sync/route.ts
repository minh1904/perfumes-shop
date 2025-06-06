import { db } from '@/db/db';
import { cartItems } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const param = await params;
    const userId = param.userId;
    const { items } = await request.json();

    if (items.length > 0) {
      const cartItemsData = items.map((item: { variant_id: number; quantity: number }) => ({
        user_id: userId,
        variant_id: item.variant_id,
        quantity: item.quantity,
      }));
      await db.insert(cartItems).values(cartItemsData);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error syncing cart:', err);
    return NextResponse.json({ error: 'Không thể đồng bộ giỏ hàng' }, { status: 500 });
  }
}
