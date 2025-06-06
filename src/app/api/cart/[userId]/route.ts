import { db } from '@/db/db';
import { brands, cartItems, images, products, productVariants } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const param = await params;
    const userId = param.userId;

    const result = await db
      .select({
        variant_id: cartItems.variant_id,
        product_id: products.id,
        product_name: products.name,
        product_slug: products.slug,
        brand_name: brands.name,
        volume_ml: productVariants.volume_ml,
        price: productVariants.price,
        quantity: cartItems.quantity,
        sku: productVariants.sku,
        image_url: images.url,
      })
      .from(cartItems)
      .innerJoin(productVariants, eq(cartItems.variant_id, productVariants.id))
      .innerJoin(products, eq(productVariants.product_id, products.id))
      .innerJoin(brands, eq(products.brand_id, brands.id))
      .leftJoin(images, and(eq(images.product_id, products.id), eq(images.is_primary, true)))
      .where(eq(cartItems.user_id, userId));

    const cartData = result.map((item) => ({
      id: `${item.variant_id}-${userId}`,
      variant_id: item.variant_id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_slug: item.product_slug,
      brand_name: item.brand_name,
      volume_ml: item.volume_ml,
      price: parseFloat(item.price),
      quantity: item.quantity,
      sku: item.sku,
      image_url: item.image_url,
    }));

    return NextResponse.json(cartData);
  } catch (err) {
    console.error('Error fetching cart:', err);
    return NextResponse.json({ error: 'Không thể lấy giỏ hàng' }, { status: 500 });
  }
}
