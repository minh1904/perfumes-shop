import { db } from '@/db/db';
import { productVariants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
type Props = {
  params: Promise<{ id: string }>;
};
export async function PUT(req: Request, { params }: Props) {
  try {
    const param = await params;
    const id = Number(param.id);
    const body = await req.json();
    const { volume_ml, sku, price, stock } = body;

    await db
      .update(productVariants)
      .set({ volume_ml, sku, price, stock })
      .where(eq(productVariants.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PUT /variants/:id error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update variant' },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await db.delete(productVariants).where(eq(productVariants.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /variants/:id error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete variant' },
      { status: 500 },
    );
  }
}
