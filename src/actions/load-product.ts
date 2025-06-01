import { db } from '@/db/db';
import { brands, images, products } from '@/db/schema';
import { and, count, desc, asc, ilike, eq, sql, inArray } from 'drizzle-orm';

export interface SearchParams {
  page?: number;
  search?: string;
  genders?: string[];
  brands?: string[];
  sortBy?: string;
  limit?: number;
}

export async function getProducts(params: SearchParams) {
  const {
    page = 1,
    search = '',
    genders = [],
    brands: brandSlugs = [],
    sortBy = '',
    limit = 12,
  } = params;

  const offset = (page - 1) * limit;
  const whereConditions = [];

  if (search) {
    whereConditions.push(ilike(products.name, `%${search}%`));
  }

  if (genders.length > 0) {
    whereConditions.push(inArray(products.gender, genders));
  }

  if (brandSlugs.length > 0) {
    whereConditions.push(inArray(brands.slug, brandSlugs));
  }

  whereConditions.push(eq(products.status, true));

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

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
    case 'brand_asc':
      orderByClause = [asc(brands.name)];
      break;
    case 'brand_desc':
      orderByClause = [desc(brands.name)];
      break;
    default:
      orderByClause = [desc(products.created_at)];
  }

  // Parallel queries để tối ưu performance
  const [productsList, [{ totalProducts }]] = await Promise.all([
    // Query products với JOIN
    db
      .select({
        // Product fields
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        discount: products.discount,
        short_description: products.short_description,
        gender: products.gender,
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
      .offset(offset),

    // Count query
    db
      .select({ totalProducts: count() })
      .from(products)
      .innerJoin(brands, eq(products.brand_id, brands.id))
      .where(whereClause),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products: productsList,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      limit,
    },
  };
}

export async function getFilterOptions() {
  // Lấy unique brands và genders cho filter
  const [brandsList, gendersList] = await Promise.all([
    // Lấy brands có ít nhất 1 product active
    db
      .select({
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
      })
      .from(brands)
      .innerJoin(products, eq(products.brand_id, brands.id))
      .where(eq(products.status, true))
      .groupBy(brands.id, brands.name, brands.slug),

    // Lấy unique genders
    db
      .selectDistinct({
        gender: products.gender,
      })
      .from(products)
      .where(
        and(
          eq(products.status, true),
          // Loại bỏ null values
          sql`${products.gender} IS NOT NULL`,
        ),
      ),
  ]);

  return {
    brands: brandsList,
    genders: gendersList.map((g) => g.gender).filter(Boolean),
  };
}

export async function getProductBySlugAndId(id: string) {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, parseInt(id)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getAllProducts() {
  return await db.select().from(products);
}
