import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAllProducts, getProductBySlugAndId } from '@/actions/load-product';
import TypeProduct from '@/components/ui/TypeProduct';

type Props = {
  params: Promise<{ productSlug: string }>;
};

export const revalidate = 3600;
export const dynamicParams = true;

export default async function ProductPage({ params }: Props) {
  const param = await params;
  const match = param.productSlug.match(/^(\d+)-(.+)$/);

  if (!match) notFound();

  const [, id, slug] = match;
  const product = await getProductBySlugAndId(id);

  if (!product || product.slug !== slug) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Product Image Column */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-2xl">
              <Image
                src={product.images[0]?.url || '/placeholder.jpg'}
                alt={product.images[0]?.alt_text || 'Product Image'}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
          {/* Product Info Column */}
          <div className="flex flex-col justify-center space-y-8 lg:pt-8">
            <TypeProduct product={{ ...product, price: parseFloat(product.price) }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const productList = await getAllProducts();
  return productList.map(({ id, slug }) => ({
    productSlug: `${id}-${slug}`,
  }));
}
