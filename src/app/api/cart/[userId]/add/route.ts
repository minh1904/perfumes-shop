import { db } from '@/db/db';
import { cartItems } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  try {
    const paramss = await params;
    const userId = paramss.userId;
    const { variant_id, quantity } = await request.json();
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.user_id, userId), eq(cartItems.variant_id, variant_id)))
      .limit(1);

    if (existingItem.length > 0) {
      // Cập nhật số lượng
      await db
        .update(cartItems)
        .set({
          quantity: existingItem[0].quantity + quantity,
        })
        .where(and(eq(cartItems.user_id, userId), eq(cartItems.variant_id, variant_id)));
    } else {
      // Thêm mới
      await db.insert(cartItems).values({
        user_id: userId,
        variant_id: variant_id,
        quantity,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error adding to cart:', err);
    return NextResponse.json({ error: 'Không thể thêm vào giỏ hàng' }, { status: 500 });
  }
}
