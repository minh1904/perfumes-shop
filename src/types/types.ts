export type ProductDescription = {
  content: string;
  features: string[];
};

// Brand
export type Brand = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  created_at: Date | null;
};

// Category
export type Category = {
  id: number;
  name: string;
  slug: string;
  created_at: Date | null;
};

// Image
export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
  alt_text: string | null;
  is_primary: boolean | null;
};

// Product Variant
export type ProductVariant = {
  id: number;
  product_id: number;
  volume_ml: number;
  sku: string;
  price: string;
  stock: number;
};

// Review
export type Review = {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: Date | null;
};

// Full Product Type
export type Product = {
  id: number;
  name: string;
  slug: string;
  brand_id: number;
  category_id: number | null;
  price: string;
  discount: number | null;
  short_description: string | null;
  description: ProductDescription | null;
  gender: string | null;
  top_notes: string | null;
  middle_notes: string | null;
  base_notes: string | null;
  status: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  sale_count: string | null;

  // Relations
  brand: Brand;
  images: ProductImage[];
  product_variants: ProductVariant[];
  reviews?: Review[];
};
