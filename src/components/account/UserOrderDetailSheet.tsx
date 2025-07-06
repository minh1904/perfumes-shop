'use client';

import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export function UserOrderDetailSheet({ orderId }: { orderId: number }) {
  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user-order', orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/users/${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      return (await res.json()).order;
    },
  });

  if (isLoading || !order) {
    return (
      <SheetContent side="right" className="w-[500px]">
        <div className="p-6">Loading...</div>
      </SheetContent>
    );
  }

  return (
    <SheetContent side="right" className="w-[500px]">
      <SheetHeader>
        <SheetTitle>Order #{order.id}</SheetTitle>
      </SheetHeader>

      <ScrollArea className="mt-4 h-[calc(100vh-80px)] pr-2">
        <div className="space-y-6 p-2">
          <div>
            <h3 className="text-lg font-semibold">Shipping Info</h3>
            <div className="text-muted-foreground mt-1 space-y-1 text-sm">
              <div>
                <strong>Name:</strong> {order.shipping_full_name || 'Unknown'}
              </div>
              <div>
                <strong>Phone:</strong> {order.shipping_phone || 'Unknown'}
              </div>
              <div>
                <strong>Address:</strong>
              </div>
              <div>
                {order.shipping_address_line1 || 'Unknown'}
                {order.shipping_address_line2 ? `, ${order.shipping_address_line2}` : ''}
              </div>
              <div>
                {[order.shipping_city, order.shipping_state, order.shipping_postal_code]
                  .filter(Boolean)
                  .join(', ') || 'Unknown'}
              </div>
              <div>{order.shipping_country || 'Unknown'}</div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold">Order Items</h3>
            <div className="mt-2 space-y-4 text-sm">
              {order.items.map((item: any) => (
                <div key={item.variant_id} className="space-y-1 rounded-md border p-3">
                  <div className="font-medium">{item.product_name || 'Unknown'}</div>
                  <div className="text-muted-foreground text-xs">
                    Volume: {item.volume_ml || 'Unknown'}ml
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Qty: {item.quantity}</span>
                    <span>× ${item.price_each}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total:</span>
            <span>${order.total_amount}</span>
          </div>

          <div className="text-right">
            <Badge variant="outline" className="text-xs">
              Status: {order.status}
            </Badge>
          </div>

          {/* Nút hủy nếu đơn đang là paid */}
          {order.status === 'paid' && (
            <div className="mt-6 text-right">
              <button
                onClick={async () => {
                  const res = await fetch(`/api/orders/${order.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'cancelled' }),
                  });

                  if (res.ok) {
                    toast.success('Order cancelled');
                    refetch();
                  } else {
                    toast.error('Failed to cancel order');
                  }
                }}
                className="text-sm text-red-600 underline hover:opacity-80"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </ScrollArea>
    </SheetContent>
  );
}
