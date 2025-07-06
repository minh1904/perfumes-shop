import { db } from '@/db/db';
import { brands, images, products, productVariants } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

type Props = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, { params }: Props) {
  try {
    const { id } = await params;
    const brandId = Number(id);

    // 1. Lấy danh sách sản phẩm của brand này
    const productList = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.brand_id, brandId));

    const productIds = productList.map((p) => p.id);

    if (productIds.length > 0) {
      // 2. Xoá variants liên quan
      await db.delete(productVariants).where(inArray(productVariants.product_id, productIds));

      // 3. Xoá ảnh sản phẩm
      await db.delete(images).where(inArray(images.product_id, productIds));

      // 4. Xoá sản phẩm
      await db.delete(products).where(inArray(products.id, productIds));
    }

    // 5. Xoá brand
    await db.delete(brands).where(eq(brands.id, brandId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /brands/:id error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
