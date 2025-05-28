import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ArrowDownUp } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { getFilterOptions, getProducts } from '@/actions/load-product';
import SortComponent from '@/components/ui/sort';

interface SearchParams {
  page?: string;
  search?: string;
  gender?: string;
  brand?: string;
  sortBy?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const searchParamss = await searchParams;
  const params = {
    page: parseInt(searchParamss.page || '1'),
    search: searchParamss.search || '',
    gender: searchParamss.gender || '',
    brand: searchParamss.brand || '',
    sortBy: searchParamss.sortBy || '',
  };

  // Fetch data và filter options parallel
  const [data, filterOptions] = await Promise.all([getProducts(params), getFilterOptions()]);

  const { products, pagination } = data;

  // Hàm tạo URL cho pagination
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParamss as Record<string, string>);
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

  // Hàm lấy các trang hiển thị
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, pagination.currentPage - delta);
      i <= Math.min(pagination.totalPages - 1, pagination.currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    const rangeWithDots: (number | string)[] = [];
    if (pagination.currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagination.currentPage + delta < pagination.totalPages - 1) {
      rangeWithDots.push('...', pagination.totalPages);
    } else if (pagination.totalPages > 1) {
      rangeWithDots.push(pagination.totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden">
      <div className="w-full lg:flex">
        <div className="mt-15 hidden w-[20%] pl-10 lg:block">
          <p className="mt-5">Filter by</p>
          <div>
            <p className="text-[16px] font-semibold">Gender</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {filterOptions.genders.map((item) => (
                <p className="border-blacky cursor-pointer rounded-sm border px-3 py-1" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[16px] font-semibold">Brand</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {filterOptions.brands.map((item) => (
                <p
                  className="border-blacky cursor-pointer rounded-sm border px-3 py-1"
                  key={item.id}
                >
                  {item.name}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-[80%]">
          <input
            placeholder="Search"
            className="mx-7 mt-20 w-full border-b text-2xl outline-none"
            autoFocus
          />
          <div className="mt-5 ml-7 flex justify-between text-[16px]">
            <p>Products {pagination.totalProducts} results</p>
            <p className="border-blacky flex cursor-pointer items-center gap-1 rounded-sm border px-2 lg:hidden">
              <ArrowDownUp size={18} strokeWidth={1.25} /> Filter & Sort
            </p>
            <div className="hidden lg:block">
              <SortComponent currentSort={params.sortBy} className="ml-auto" />
            </div>
          </div>

          <div>
            <div className="mt-4 ml-7 grid h-full grid-cols-2 gap-2 text-base md:grid-cols-3 lg:grid-cols-4 lg:overflow-y-auto">
              {products.map((results) => (
                <div
                  key={results.id}
                  className="bg-masculine flex h-96 flex-col justify-between rounded-md py-3 lg:h-[25rem] 2xl:h-[32rem]"
                >
                  <p className="mx-auto min-w-36 rounded-full bg-black px-2 py-2 text-center text-white md:grid-cols-3 lg:grid-cols-4">
                    {results.brand.name}
                  </p>
                  <Image
                    src={`${results.primary_image}`}
                    alt={`${results.primary_image}`}
                    width={600}
                    height={600}
                    className="mx-auto h-60 w-60 object-cover"
                  />
                  <div className="pl-5">
                    <p>{results.name}</p>
                    <p>{results.price}$</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="m-5">
        <Pagination>
          <PaginationContent>
            {pagination.hasPreviousPage && (
              <PaginationItem>
                <PaginationPrevious href={createPageUrl(pagination.currentPage - 1)} />
              </PaginationItem>
            )}
            {getVisiblePages().map((pageNum, index) => (
              <PaginationItem key={`page-${pageNum}-${index}`}>
                {pageNum === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={createPageUrl(pageNum as number)}
                    isActive={pageNum === pagination.currentPage}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            {pagination.hasNextPage && (
              <PaginationItem>
                <PaginationNext href={createPageUrl(pagination.currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Page;
