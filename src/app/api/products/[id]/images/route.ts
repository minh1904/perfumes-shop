import { NextRequest, NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { images } from '@/db/schema';
type Props = {
  params: Promise<{ id: string }>;
};

// GET - Lấy tất cả ảnh của sản phẩm
export async function GET(req: Request, context: { params: { id: string } }): Promise<Response> {
  try {
    const productId = parseInt(context.params.id);

    if (!productId || isNaN(productId)) {
      return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 });
    }

    // Query database để lấy tất cả ảnh, sắp xếp ảnh chính lên đầu
    const productImages = await db
      .select()
      .from(images)
      .where(eq(images.product_id, productId))
      .orderBy(images.is_primary, images.id);

    console.log('Database query result:', productImages);

    return NextResponse.json({
      success: true,
      images: productImages,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch images' }, { status: 500 });
  }
}

// POST - Thêm ảnh mới
export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();

    if (!productId || isNaN(productId)) {
      return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 });
    }

    const { url, alt_text, is_primary } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    // Nếu đây là ảnh chính, set tất cả ảnh khác thành false
    if (is_primary) {
      await db.update(images).set({ is_primary: false }).where(eq(images.product_id, productId));
    }

    // Thêm ảnh mới
    const newImage = await db
      .insert(images)
      .values({
        product_id: productId,
        url,
        alt_text: alt_text || '',
        is_primary: is_primary || false,
      })
      .returning();

    console.log('Created new image:', newImage[0]);

    return NextResponse.json({
      success: true,
      image: newImage[0],
    });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json({ success: false, error: 'Failed to create image' }, { status: 500 });
  }
}
