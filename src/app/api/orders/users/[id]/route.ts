import { db } from '@/db/db';
import { orders, orderItems, productVariants, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const orderId = Number(params.id);

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) return new NextResponse('Not found', { status: 404 });

  const items = await db
    .select({
      variant_id: orderItems.variant_id,
      quantity: orderItems.quantity,
      price_each: orderItems.price_each,
      product_name: products.name,
      volume_ml: productVariants.volume_ml,
    })
    .from(orderItems)
    .leftJoin(productVariants, eq(orderItems.variant_id, productVariants.id))
    .leftJoin(products, eq(productVariants.product_id, products.id))
    .where(eq(orderItems.order_id, orderId));

  return NextResponse.json({ order: { ...order, items } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const orderId = Number(params.id);
  const body = await req.json();

  const schema = z.object({
    status: z.enum(['cancelled']),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse('Invalid status', { status: 400 });
  }

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) return new NextResponse('Order not found', { status: 404 });

  if (order.status !== 'paid') {
    return new NextResponse('Only orders with status "paid" can be cancelled.', {
      status: 400,
    });
  }

  const items = await db
    .select({
      variantId: orderItems.variant_id,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .where(eq(orderItems.order_id, orderId));

  for (const item of items) {
    await db.execute(sql`
      UPDATE product_variants
      SET stock = stock + ${item.quantity}
      WHERE id = ${item.variantId}
    `);
  }

  await db.update(orders).set({ status: 'cancelled' }).where(eq(orders.id, orderId));

  return new NextResponse(null, { status: 204 });
}
