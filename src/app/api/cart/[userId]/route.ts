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
        variantId: cartItems.variant_id,
        productId: products.id,
        productName: products.name,
        productSlug: products.slug,
        brandName: brands.name,
        volumeMl: productVariants.volume_ml,
        price: productVariants.price,
        quantity: cartItems.quantity,
        sku: productVariants.sku,
        imageUrl: images.url,
      })
      .from(cartItems)
      .innerJoin(productVariants, eq(cartItems.variant_id, productVariants.id))
      .innerJoin(products, eq(productVariants.product_id, products.id))
      .innerJoin(brands, eq(products.brand_id, brands.id))
      .leftJoin(images, and(eq(images.product_id, products.id), eq(images.is_primary, true)))
      .where(eq(cartItems.user_id, userId));

    const cartData = result.map((item) => ({
      id: `${item.variantId}-${userId}`,
      variantId: item.variantId,
      productId: item.productId,
      productName: item.productName,
      productSlug: item.productSlug,
      brandName: item.brandName,
      volumeMl: item.volumeMl,
      price: parseFloat(item.price),
      quantity: item.quantity,
      sku: item.sku,
      imageUrl: item.imageUrl,
    }));

    return NextResponse.json(cartData);
  } catch (err) {
    console.error('Error fetching cart:', err);
    return NextResponse.json({ error: 'Không thể lấy giỏ hàng' }, { status: 500 });
  }
}
