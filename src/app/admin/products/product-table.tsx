'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import SidebarProduct from './sidebar-product';

interface ProductVariant {
  id: number;
  volume_ml: number;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount: number | null;
  short_description: string | null;
  status: boolean | null;
  brand?: string | null;
  brand_id: number;
  category: string | null;
  image_url: string | null;
  gender: string | null;
  variants: ProductVariant[];
  sale_count: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

interface ProductResponse {
  success: boolean;
  data: Product[];
  pagination: Pagination;
}

export default function ProductTable({ externalSearch = '' }: { externalSearch?: string }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [gender, setGender] = useState<'all' | 'male' | 'female' | 'unisex'>('all');
  const [sortBy, setSortBy] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState(externalSearch);

  useEffect(() => {
    setSearch(externalSearch);
    setPage(1);
  }, [externalSearch]);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, error } = useQuery<ProductResponse>({
    queryKey: ['products', page, status, gender, debouncedSearch, sortBy],
    queryFn: async () => {
      interface ProductQueryParams {
        page: number;
        status?: boolean;
        search?: string;
        sortBy?: string;
        genders?: string[];
      }
      const params: ProductQueryParams = { page };
      if (status !== 'all') params.status = status === 'active';
      if (gender !== 'all') params.genders = [gender];
      if (debouncedSearch) params.search = debouncedSearch;
      if (sortBy) params.sortBy = sortBy;

      const res = await axios.get('/api/products/admin', { params });
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading data...</div>;
  if (error || !data) return <div className="p-6 text-red-500">Error loading products.</div>;

  return (
    <div className="space-y-4 p-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label>Status:</label>
          <Select
            value={status}
            onValueChange={(value: 'all' | 'active' | 'inactive') => {
              setPage(1);
              setStatus(value);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label>Gender:</label>
          <Select
            value={gender}
            onValueChange={(value: 'all' | 'male' | 'female' | 'unisex') => {
              setPage(1);
              setGender(value);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label>Sort by:</label>
          <Select
            value={sortBy || 'default'}
            onValueChange={(value) => {
              setPage(1);
              setSortBy(value === 'default' ? '' : value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Newest</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="price_asc">Price (Low → High)</SelectItem>
              <SelectItem value="price_desc">Price (High → Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Total count */}
      <div className="text-muted-foreground text-sm">
        Found {data.pagination.totalProducts} product(s)
      </div>

      {/* Product Cards */}
      {data.data.map((product) => (
        <Card key={product.id} className="shadow">
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={
                    product.image_url &&
                    (product.image_url.startsWith('/') || product.image_url.startsWith('http'))
                      ? product.image_url
                      : '/placeholder.png'
                  }
                  alt={product.name}
                  className="h-full w-full object-cover"
                  width={600}
                  height={600}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                  >
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    {expandedId === product.id ? (
                      <ChevronUp className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <ChevronDown className="text-muted-foreground h-4 w-4" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {' '}
                    <Badge variant={product.status ? 'outline' : 'destructive'}>
                      {product.status ? 'Active' : 'Inactive'}
                    </Badge>
                    <SidebarProduct product={product} />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {product.brand} •{' '}
                  {product.gender
                    ? product.gender.charAt(0).toUpperCase() + product.gender.slice(1)
                    : ''}
                </p>

                {expandedId === product.id && (
                  <div className="mt-4">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">Variants:</p>
                    <div className="text-muted-foreground grid grid-cols-4 border-b py-1 text-xs font-semibold">
                      <span>Volume</span>
                      <span>SKU</span>
                      <span>Price</span>
                      <span>Stock</span>
                    </div>
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="grid grid-cols-4 border-b py-1 text-sm">
                        <span>{variant.volume_ml}ml</span>
                        <span>{variant.sku}</span>
                        <span>{Number(variant.price).toLocaleString()}₫</span>
                        <span>
                          {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-3">
        <Button
          disabled={!data.pagination.hasPreviousPage}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span className="px-4 py-2">
          Page {data.pagination.currentPage} of {data.pagination.totalPages}
        </span>
        <Button disabled={!data.pagination.hasNextPage} onClick={() => setPage((prev) => prev + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
