import { db } from '@/db/db';
import { orderItems, orders, products, productVariants } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(req: Request, context: { params: { id: string } }): Promise<Response> {
  const orderId = Number(context.params.id);

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));

  if (!order) return new NextResponse('Not found', { status: 404 });

  const items = await db
    .select({
      variant_id: orderItems.variant_id,
      quantity: orderItems.quantity,
      price_each: orderItems.price_each,
      volume_ml: productVariants.volume_ml,
      product_name: products.name,
    })
    .from(orderItems)
    .leftJoin(productVariants, eq(orderItems.variant_id, productVariants.id))
    .leftJoin(products, eq(productVariants.product_id, products.id))
    .where(eq(orderItems.order_id, orderId));

  return NextResponse.json({ order: { ...order, items } });
}
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  const body = await req.json();

  const schema = z.object({
    status: z.enum(['shipped', 'cancelled', 'delivered']),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse('Invalid status', { status: 400 });
  }

  const newStatus = parsed.data.status;

  // 1. Lấy trạng thái hiện tại của đơn hàng
  const [currentOrder] = await db
    .select({ status: orders.status })
    .from(orders)
    .where(eq(orders.id, orderId));

  if (!currentOrder) return new NextResponse('Order not found', { status: 404 });

  const prevStatus = currentOrder.status;

  // 2. Chỉ xử lý tồn kho nếu trạng thái từ "paid" sang "shipped" hoặc "cancelled"
  if (
    (prevStatus === 'paid' && newStatus === 'shipped') ||
    (prevStatus === 'paid' && newStatus === 'cancelled')
  ) {
    const items = await db
      .select({
        variantId: orderItems.variant_id,
        quantity: orderItems.quantity,
      })
      .from(orderItems)
      .where(eq(orderItems.order_id, orderId));

    for (const item of items) {
      const delta = newStatus === 'shipped' ? -item.quantity : item.quantity;

      await db
        .update(productVariants)
        .set({ stock: sql`${productVariants.stock} + ${delta}` })
        .where(eq(productVariants.id, item.variantId));
    }
  }

  // 3. Cập nhật trạng thái đơn hàng
  await db.update(orders).set({ status: newStatus }).where(eq(orders.id, orderId));

  return new NextResponse(null, { status: 204 });
}
