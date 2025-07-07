import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type OrderItem = {
  variant_id: number;
  quantity: number;
  price_each: string;
  product_name: string;
  volume_ml: number;
};

export function UserOrderDetailDialogContent({ orderId }: { orderId: number }) {
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: ['user-order', orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/users/${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      return (await res.json()).order;
    },
  });

  const [isCancelling, setIsCancelling] = useState(false);

  if (isLoading || !order) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-2" key={order.status}>
      <div className="border-b pb-6">
        <p className="font-normal">Shipping Info</p>
        <p className="font-roslindale-medium-italic text-2xl">
          {order.shipping_full_name || 'Unknown'}
        </p>
        <p className="text-muted-foreground text-sm">
          {order.shipping_address_line1}
          {order.shipping_address_line2 ? `, ${order.shipping_address_line2}` : ''},{' '}
          {order.shipping_city}, {order.shipping_postal_code}, {order.shipping_country}
        </p>
      </div>

      <div className="border-b pb-6">
        <p className="font-normal">Order Items</p>
        <div className="mt-2 space-y-3">
          {order.items.map((item: OrderItem) => (
            <div key={item.variant_id} className="rounded-md border p-3">
              <div className="text-base font-semibold">{item.product_name}</div>
              <div className="text-muted-foreground text-sm">Volume: {item.volume_ml}ml</div>
              <div className="flex justify-between">
                <span>Qty: {item.quantity}</span>
                <span>× ${item.price_each}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-lg font-semibold">
        <span>Total:</span>
        <span>${order.total_amount}</span>
      </div>

      <div className="text-right">
        <Badge variant="outline" className="text-xs">
          Status: {order.status}
        </Badge>
      </div>

      {order.status === 'paid' && (
        <div className="mt-4 text-right">
          <button
            disabled={isCancelling}
            onClick={async () => {
              setIsCancelling(true);
              const res = await fetch(`/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
              });

              if (res.ok) {
                toast.success('Order cancelled');
                await queryClient.invalidateQueries({ queryKey: ['user-order', orderId] });
              } else {
                toast.error('Failed to cancel order');
              }
              setIsCancelling(false);
            }}
            className="text-sm text-red-600 underline hover:opacity-80"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      )}
    </div>
  );
}
