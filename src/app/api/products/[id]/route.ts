import { db } from '@/db/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Props) {
  try {
    const param = await params;
    const id = Number(param.id);
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
  } catch (error) {
    console.error('PATCH /products/:id error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
