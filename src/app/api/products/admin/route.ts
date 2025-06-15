import { db } from '@/db/db';
import { products, brands, categories, productVariants, images } from '@/db/schema';
import { and, eq, ilike, inArray, count, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const search = searchParams.get('search') || '';
    const genders = searchParams.getAll('genders[]') ?? [];
    const brandSlugs = searchParams.get('brands')?.split(',').filter(Boolean) ?? [];
    const sortBy = searchParams.get('sortBy') || '';
    const statusParam = searchParams.get('status');
    const status = statusParam === 'true' ? true : statusParam === 'false' ? false : undefined;

    const conditions = [];

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }
    if (genders.length > 0) {
      conditions.push(inArray(products.gender, genders));
    }
    if (brandSlugs.length > 0) {
      conditions.push(inArray(brands.slug, brandSlugs));
    }
    if (status !== undefined) {
      conditions.push(eq(products.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderClause;
    switch (sortBy) {
      case 'name_asc':
        orderClause = [products.name];
        break;
      case 'name_desc':
        orderClause = [desc(products.name)];
        break;
      case 'price_asc':
        orderClause = [products.price];
        break;
      case 'price_desc':
        orderClause = [desc(products.price)];
        break;
      default:
        orderClause = [desc(products.created_at)];
    }

    const [productList, [{ totalProducts }]] = await Promise.all([
      db
        .select()
        .from(products)
        .leftJoin(brands, eq(products.brand_id, brands.id))
        .leftJoin(categories, eq(products.category_id, categories.id))
        .where(whereClause)
        .orderBy(...orderClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ totalProducts: count() })
        .from(products)
        .leftJoin(brands, eq(products.brand_id, brands.id))
        .where(whereClause),
    ]);

    const enriched = await Promise.all(
      productList.map(async (row) => {
        const variants = await db
          .select()
          .from(productVariants)
          .where(eq(productVariants.product_id, row.products.id));

        const primaryImage = await db
          .select({ url: images.url })
          .from(images)
          .where(and(eq(images.product_id, row.products.id), eq(images.is_primary, true)))
          .limit(1);

        return {
          id: row.products.id,
          name: row.products.name,
          slug: row.products.slug,
          price: row.products.price,
          gender: row.products.gender,
          discount: row.products.discount,
          status: row.products.status,
          brand: row.brands?.name ?? null,
          category: row.categories?.name ?? null,
          image_url: primaryImage[0]?.url ?? null,
          variants: variants.map((v) => ({
            id: v.id,
            volume_ml: v.volume_ml,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
          })),
        };
      }),
    );

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      success: true,
      data: enriched,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_ROUTE_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load admin products' },
      { status: 500 },
    );
  }
}
