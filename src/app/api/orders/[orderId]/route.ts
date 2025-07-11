import { auth } from '@/auth';
import { db } from '@/db/db';
import { orderItems, orders, products, productVariants } from '@/db/schema';
import { sql } from 'drizzle-orm';

import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: { orderId: string } },
): Promise<Response> {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orderIdNum = Number(context.params.orderId);
  if (isNaN(orderIdNum)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
  }

  try {
    // Lấy đơn hàng
    const orderResult = await db.select().from(orders).where(eq(orders.id, orderIdNum));

    if (!orderResult.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderResult[0];

    // Chặn truy cập đơn hàng của người khác
    if (order.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Lấy các item trong đơn hàng
    const items = await db
      .select({
        variant_id: orderItems.variant_id,
        quantity: orderItems.quantity,
        price_each: orderItems.price_each,
        product_name: products.name,
        volume_ml: productVariants.volume_ml,
      })
      .from(orderItems)
      .innerJoin(productVariants, eq(orderItems.variant_id, productVariants.id))
      .innerJoin(products, eq(productVariants.product_id, products.id))
      .where(eq(orderItems.order_id, orderIdNum));

    return NextResponse.json({
      order: {
        ...order,
        items,
      },
    });
  } catch (err) {
    console.error('[GET /api/orders/:orderId]', err);
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}
export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderId } = await params;
  const orderIdNum = Number(orderId);
  if (isNaN(orderIdNum)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
  }

  try {
    // 1. Kiểm tra đơn có tồn tại và đúng user
    const orderRes = await db.select().from(orders).where(eq(orders.id, orderIdNum));
    if (!orderRes.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderRes[0];

    if (order.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (order.status === 'cancelled') {
      return NextResponse.json({ message: 'Order already cancelled' }, { status: 400 });
    }

    // 2. Lấy danh sách item
    const items = await db
      .select({
        variant_id: orderItems.variant_id,
        quantity: orderItems.quantity,
      })
      .from(orderItems)
      .where(eq(orderItems.order_id, orderIdNum));

    // 3. Hoàn lại số lượng inventory
    await Promise.all(
      items.map((item) =>
        db
          .update(productVariants)
          .set({
            stock: sql`${productVariants.stock} + ${item.quantity}`,
          })
          .where(eq(productVariants.id, item.variant_id)),
      ),
    );

    // 4. Cập nhật trạng thái đơn hàng
    await db.update(orders).set({ status: 'cancelled' }).where(eq(orders.id, orderIdNum));

    return NextResponse.json({ message: 'Order cancelled and stock restored' });
  } catch (err) {
    console.error('[PATCH /api/orders/:orderId]', err);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
