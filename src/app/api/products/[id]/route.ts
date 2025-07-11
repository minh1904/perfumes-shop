import { db } from '@/db/db';
import { products, productVariants, images } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// PATCH: Cập nhật sản phẩm
export async function PATCH(req: Request, context: { params: { id: string } }): Promise<Response> {
  const id = Number(context.params.id);
  const body = await req.json();

  const { name, slug, brand_id, status, gender, short_description, sale_count } = body;

  const updateData: Partial<typeof products.$inferInsert> = {};

  if (name !== undefined) updateData.name = name;
  if (slug !== undefined) updateData.slug = slug;
  if (brand_id !== undefined) updateData.brand_id = brand_id;
  if (status !== undefined) updateData.status = status;
  if (gender !== undefined) updateData.gender = gender;
  if (short_description !== undefined) updateData.short_description = short_description;
  if (sale_count !== undefined) updateData.sale_count = sale_count;

  await db.update(products).set(updateData).where(eq(products.id, id));

  return NextResponse.json({ success: true });
}

// DELETE: Xoá sản phẩm và các dữ liệu liên quan
export async function DELETE(_: Request, context: { params: { id: string } }): Promise<Response> {
  const id = Number(context.params.id);

  // Xoá các variants
  await db.delete(productVariants).where(eq(productVariants.product_id, id));

  // Xoá ảnh sản phẩm nếu có
  await db.delete(images).where(eq(images.product_id, id));

  // Xoá sản phẩm
  await db.delete(products).where(eq(products.id, id));

  return NextResponse.json({ success: true });
}
