// app/product/[productSlug]/page.tsx
import { notFound } from 'next/navigation';

import { getAllProducts, getProductBySlugAndId } from '@/actions/load-product';

type Props = {
  params: Promise<{ productSlug: string }>;
};
export const revalidate = 3600;
export const dynamicParams = true;

export default async function ProductPage({ params }: Props) {
  const param = await params;
  const match = param.productSlug.match(/^(\d+)-(.+)$/);
  if (!match) {
    notFound();
  }
  const [, id, slug] = match;

  const product = await getProductBySlugAndId(id);

  if (!product || product.slug !== slug) {
    notFound();
  }

  const { name, price } = product;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">{name}</h1>
      <p className="mb-4 text-lg">Price: ${price}</p>
    </div>
  );
}

export async function generateStaticParams() {
  const productList = await getAllProducts();
  return productList.map(({ id, slug }) => ({
    productSlug: `${id}-${slug}`,
  }));
}
