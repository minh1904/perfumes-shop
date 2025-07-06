'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { OrderTable } from './OrderTable';

export default function OrderManagementPage() {
  const {
    data: orders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.orders;
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Button onClick={() => refetch()} variant="outline">
          Refresh
        </Button>
      </div>
      <OrderTable orders={orders} onUpdated={refetch} loading={isLoading} />
    </div>
  );
}
