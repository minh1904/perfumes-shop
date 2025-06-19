import { db } from '@/db/db';
import { productVariants } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, volume_ml, sku, price, stock } = body;

    const newVariant = await db.insert(productVariants).values({
      product_id,
      volume_ml,
      sku,
      price,
      stock,
    });

    return NextResponse.json({ success: true, data: newVariant });
  } catch (err) {
    console.error('POST /variants error:', err);
    return NextResponse.json({ success: false, error: 'Failed to add variant' }, { status: 500 });
  }
}
