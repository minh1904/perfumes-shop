import { NextRequest, NextResponse } from 'next/server';
import { orders, orderItems, productVariants } from '@/db/schema';
import { db } from '@/db/db';
import { sql, eq } from 'drizzle-orm';

type OrderItem = {
  variant_id: number;
  quantity: number;
  price: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[ORDER_CREATE] Request body:', JSON.stringify(body, null, 2));

    const { user_id, address, items, total_amount } = body;

    // --- Kiểm tra đầu vào ---
    if (!user_id || !address || !items?.length || !total_amount) {
      console.log('[ORDER_CREATE] Validation failed:', {
        user_id,
        address: !!address,
        items: items?.length,
        total_amount,
      });
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

    const order_id = newOrder.id;

    // --- Tạo các dòng sản phẩm ---
    const orderItemValues = (items as OrderItem[]).map((item) => ({
      order_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price_each: String(item.price),
    }));

    await db.insert(orderItems).values(orderItemValues);

    // --- Trừ số lượng tồn kho ---
    for (const item of items as OrderItem[]) {
      const variant_id = item.variant_id;

      // Lấy thông tin variant hiện tại
      const [variant] = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, variant_id));

      if (!variant) {
        throw new Error(`Không tìm thấy sản phẩm với ID ${variant_id}`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(`Sản phẩm ${variant_id} không đủ số lượng tồn kho`);
      }

      // Trừ kho bằng phép tính an toàn (atomic SQL)
      await db
        .update(productVariants)
        .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
        .where(eq(productVariants.id, variant_id));
    }

    const result = order_id;

    return NextResponse.json({ success: true, order_id: result });
  } catch (err) {
    console.error('[ORDER_CREATE_ERROR]', err);
    console.error('[ORDER_CREATE_ERROR] Stack:', err instanceof Error ? err.stack : 'No stack');
    return NextResponse.json(
      {
        error: 'Lỗi server khi tạo đơn hàng',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
