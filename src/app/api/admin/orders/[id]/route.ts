import { db } from '@/db/db';
import { orderItems, orders, products, productVariants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);

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

  await db.update(orders).set({ status: parsed.data.status }).where(eq(orders.id, orderId));

  return new NextResponse(null, { status: 204 });
}
