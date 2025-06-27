import { db } from '@/db/db';
import { products, productVariants } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      slug,
      brand_id,
      short_description,
      sale_count,
      gender,
      status,
      product_variants, // danh sách biến thể gửi kèm
    } = body;

    // Validate tối thiểu
    if (!name || !slug || !brand_id || !gender) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Tạo sản phẩm
    const [product] = await db
      .insert(products)
      .values({
        name,
        slug,
        brand_id,
        short_description,
        sale_count,
        gender,
        status,
      })
      .returning();

    // Nếu có variants thì thêm luôn
    if (Array.isArray(product_variants)) {
      await db.insert(productVariants).values(
        product_variants.map((v: any) => ({
          product_id: product.id,
          volume_ml: Number(v.volume_ml),
          sku: String(v.sku),
          price: String(v.price),
          stock: Number(v.stock),
        })),
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error('[PRODUCT_CREATE_ERROR]', err);
    return NextResponse.json({ error: 'Lỗi server khi tạo sản phẩm' }, { status: 500 });
  }
}
