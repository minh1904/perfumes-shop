import { db } from '@/db/db';
import { images } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
type Props = {
  params: Promise<{ id: string; imageId: string }>;
};
// app/api/products/[id]/images/[imageId]/set-primary/route.ts
export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const param = await params;
    const productId = parseInt(param.id);
    const imageId = parseInt(param.imageId);

    if (!productId || isNaN(productId) || !imageId || isNaN(imageId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID or image ID' },
        { status: 400 },
      );
    }

    // Kiểm tra ảnh có tồn tại và thuộc về sản phẩm này không
    const existingImage = await db
      .select()
      .from(images)
      .where(and(eq(images.id, imageId), eq(images.product_id, productId)))
      .limit(1);

    if (existingImage.length === 0) {
      return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
    }

    // Set tất cả ảnh khác thành false
    await db.update(images).set({ is_primary: false }).where(eq(images.product_id, productId));

    // Set ảnh này thành primary
    await db
      .update(images)
      .set({ is_primary: true })
      .where(and(eq(images.id, imageId), eq(images.product_id, productId)));

    console.log('Set primary image:', imageId);

    return NextResponse.json({
      success: true,
      message: 'Primary image updated successfully',
    });
  } catch (error) {
    console.error('Error setting primary image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set primary image' },
      { status: 500 },
    );
  }
}
