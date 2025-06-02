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
    <div className="container h-screen justify-center">
      <div className="px-7">
        <div>
          <Image
            src={product.images[0]?.url || '/placeholder.jpg'}
            alt={product.images[0]?.alt_text || 'Ảnh sản phẩm'}
            width={600}
            height={600}
            className="rounded-lg object-cover"
          />
        </div>

        <div className="mt-3.5">
          <p className="border-blacky inline-block w-auto rounded-2xl border px-6 duration-300">
            {product.brand.name}
          </p>
          <p className="mt-2 text-5xl">{product.name}</p>
          <p className="mt-2 text-gray-500 uppercase">{product.gender}</p>
          <TypeProduct product={product} />
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
