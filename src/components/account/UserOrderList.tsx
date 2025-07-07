import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserOrderDetailDialogContent } from './UserOrderDetailDialogContent';

const OrderDialog = ({ orderId, onClose }: { orderId: number; onClose: () => void }) => {
  return (
    <Dialog open={!!orderId} onOpenChange={onClose}>
      <DialogContent className="max-h-[70vh] w-full max-w-3xl overflow-y-auto rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="font-roslindale-medium-italic text-2xl">
            Order #{orderId}
          </DialogTitle>
        </DialogHeader>
        <UserOrderDetailDialogContent orderId={orderId} />
      </DialogContent>
    </Dialog>
  );
};

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Processing', value: 'processing' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
] as const;

type FilterType = (typeof FILTERS)[number]['value'];
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: number;
  total_amount: string;
  created_at: string;
  status: OrderStatus;
  shipping_full_name: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
}

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'paid':
      return <Badge variant="default">Paid</Badge>;
    case 'shipped':
      return <Badge className="bg-blue-500">Shipped</Badge>;
    case 'delivered':
      return <Badge className="bg-green-600">Delivered</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
  }
};

const UserOrderList = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['user-orders', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const res = await fetch(`/api/orders/user/${session.user.id}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.orders || [];
    },
  });

  const handleClose = async () => {
    setSelectedOrderId(null);
    await queryClient.invalidateQueries({ queryKey: ['user-orders', session?.user?.id] });
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'processing') return order.status === 'paid' || order.status === 'shipped';
    return order.status === filter;
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <div className="flex min-h-64 flex-col justify-between border p-4 md:col-span-3 md:p-5">
      <p className="mb-3 text-2xl font-normal uppercase">Orders</p>

      <div className="mb-6 flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'default' : 'outline'}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-muted-foreground">No orders found for this filter.</p>
      )}

      {filteredOrders.map((order) => (
        <div
          key={order.id}
          onClick={() => setSelectedOrderId(order.id)}
          className="hover:bg-muted/30 mb-6 flex cursor-pointer flex-col gap-6 border-b pb-4 transition lg:flex-row lg:justify-between"
        >
          <div className="space-y-2">
            <div>
              <p className="font-normal">Order ID</p>
              <p className="font-roslindale-medium-italic text-2xl">{order.id}</p>
            </div>
            <div>
              <p className="font-normal">Status</p>
              <div>{getStatusBadge(order.status)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <p className="font-normal">Total</p>
              <p className="font-roslindale-medium-italic text-2xl">${order.total_amount}</p>
            </div>
            <div>
              <p className="font-normal">Created At</p>
              <p className="font-roslindale-medium-italic text-2xl">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}

      {!!selectedOrderId && <OrderDialog orderId={selectedOrderId} onClose={handleClose} />}
    </div>
  );
};

export default UserOrderList;
