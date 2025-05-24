import { db } from '@/db/db';
import { products, images, brands } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const Products = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        brand: brands.name, // Lấy tên hãng từ bảng brands
        price: products.price,
        gender: products.gender,
        short_description: products.short_description,
        image_url: images.url, // Lấy URL ảnh chính
        image_alt: images.alt_text,
      })
      .from(products)
      .leftJoin(brands, eq(products.brand_id, brands.id)) // Join với bảng brands để lấy tên hãng
      .leftJoin(images, eq(images.product_id, products.id)) // Join với bảng images
      .where(eq(images.is_primary, true)) // Chỉ lấy ảnh chính
      .limit(100);

    return NextResponse.json({ products: Products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
