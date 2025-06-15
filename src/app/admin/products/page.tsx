'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import ProductTable from './product-table';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="px-5">
      <h1 className="mb-4 text-2xl font-bold">Products</h1>
      <Input
        className="mb-4 rounded-sm p-2"
        placeholder="Search product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ProductTable externalSearch={search} />
    </div>
  );
}
