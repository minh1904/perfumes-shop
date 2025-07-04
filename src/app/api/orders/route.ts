import { NextRequest, NextResponse } from 'next/server';
import { orders, orderItems } from '@/db/schema';
import { db } from '@/db/db';

type OrderItem = {
  variant_id: string;
  quantity: number;
  price: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, address, items, total_amount } = body;

    // --- Kiểm tra đầu vào ---
    if (!user_id || !address || !items?.length || !total_amount) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // --- Tạo đơn hàng ---
    const [newOrder] = await db
      .insert(orders)
      .values({
        user_id,
        total_amount,
        status: 'paid',
        shipping_full_name: address.full_name,
        shipping_phone: address.phone_number,
        shipping_address_line1: address.address_line1,
        shipping_address_line2: address.address_line2 || '',
        shipping_city: address.city,
        shipping_state: address.state || '',
        shipping_postal_code: address.postal_code || '',
        shipping_country: address.country,
      })
      .returning();

    // --- Tạo các dòng sản phẩm ---
    const orderItemValues = (items as OrderItem[]).map((item) => ({
      order_id: newOrder.id,
      variant_id: Number(item.variant_id),
      quantity: item.quantity,
      price_each: String(item.price),
    }));

    await db.insert(orderItems).values(orderItemValues);

    return NextResponse.json({ success: true, order_id: newOrder.id });
  } catch (err) {
    console.error('[ORDER_CREATE_ERROR]', err);
    return NextResponse.json({ error: 'Lỗi server khi tạo đơn hàng' }, { status: 500 });
  }
}
