// app/api/products/[id]/images/[imageId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { eq, and } from 'drizzle-orm';
import { db } from '@/db/db';
import { images } from '@/db/schema';
type Props = {
  params: Promise<{ id: string; imageId: string }>;
};
// DELETE - Xóa ảnh
export async function DELETE(request: NextRequest, { params }: Props) {
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

    // Xóa ảnh
    await db.delete(images).where(and(eq(images.id, imageId), eq(images.product_id, productId)));

    console.log('Deleted image:', imageId);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
