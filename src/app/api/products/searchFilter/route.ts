import { NextRequest, NextResponse } from 'next/server';

import { and, count, desc, asc, ilike, eq } from 'drizzle-orm';
import { brands, images, products } from '@/db/schema';
import { db } from '@/db/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Lấy parameters từ URL
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const gender = searchParams.get('gender') || '';
    const brandSlug = searchParams.get('brand') || '';
    const sortBy = searchParams.get('sortBy') || '';

    // Tính offset
    const offset = (page - 1) * limit;

    // Tạo điều kiện where
    const whereConditions = [];

    if (search) {
      whereConditions.push(ilike(products.name, `%${search}%`));
    }

    if (gender) {
      whereConditions.push(eq(products.gender, gender));
    }

    if (brandSlug) {
      whereConditions.push(eq(brands.slug, brandSlug));
    }

    // Chỉ lấy products có status = true
    whereConditions.push(eq(products.status, true));

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Xử lý sorting với brand name
    let orderByClause;
    switch (sortBy) {
      case 'name_asc':
        orderByClause = [asc(products.name)];
        break;
      case 'name_desc':
        orderByClause = [desc(products.name)];
        break;
      case 'price_asc':
        orderByClause = [asc(products.price)];
        break;
      case 'price_desc':
        orderByClause = [desc(products.price)];
        break;
      case 'sale_asc':
        orderByClause = [asc(products.sale_count)];
        break;
      case 'sale_asc':
        orderByClause = [desc(products.sale_count)];
        break;
      default:
        orderByClause = [desc(products.created_at)];
    }

    // Query để đếm tổng số sản phẩm với JOIN
    const [{ totalProducts }] = await db
      .select({ totalProducts: count() })
      .from(products)
      .innerJoin(brands, eq(products.brand_id, brands.id))
      .where(whereClause);

    // Query để lấy sản phẩm với JOIN brands và primary image
    const productsList = await db
      .select({
        // Product fields
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        discount: products.discount,
        short_description: products.short_description,
        gender: products.gender,
        sale_count: products.sale_count,
        status: products.status,
        created_at: products.created_at,
        // Brand fields
        brand: {
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          logo_url: brands.logo_url,
        },
        // Primary image
        primary_image: images.url,
      })
      .from(products)
      .innerJoin(brands, eq(products.brand_id, brands.id))
      .leftJoin(images, and(eq(images.product_id, products.id), eq(images.is_primary, true)))
      .where(whereClause)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products: productsList,
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
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
