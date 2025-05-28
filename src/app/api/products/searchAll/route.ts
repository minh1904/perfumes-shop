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
        brand: brands.name,
        price: products.price,
        gender: products.gender,
        short_description: products.short_description,
        image_url: images.url,
        image_alt: images.alt_text,
        sale_count: products.sale_count,
      })
      .from(products)
      .leftJoin(brands, eq(products.brand_id, brands.id))
      .leftJoin(images, eq(images.product_id, products.id))
      .where(eq(images.is_primary, true))
      .limit(100);

    return NextResponse.json({ products: Products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
