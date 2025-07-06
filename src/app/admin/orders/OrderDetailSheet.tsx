'use client';

import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface Props {
  orderId: number;
  onUpdated?: () => void;
}

export function OrderDetailSheet({ orderId }: Props) {
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order details');
      return (await res.json()).order;
    },
  });

  if (isLoading || !order)
    return (
      <SheetContent side="right" className="w-[500px]">
        <div className="p-6">Loading...</div>
      </SheetContent>
    );

  return (
    <SheetContent side="right" className="w-[500px]">
      <SheetHeader>
        <SheetTitle>Order #{order.id}</SheetTitle>
      </SheetHeader>
      <ScrollArea className="mt-4 h-[calc(100vh-80px)] pr-2">
        <div className="space-y-6 p-2">
          {/* Shipping Info */}
          <div>
            <h3 className="text-lg font-semibold">Shipping Info</h3>
            <div className="text-muted-foreground mt-1 space-y-1 text-sm">
              <div>
                <strong>Name:</strong> {order.shipping_full_name}
              </div>
              <div>
                <strong>Phone:</strong> {order.shipping_phone}
              </div>
              <div>
                <strong>Address:</strong>
              </div>
              <div>
                {order.shipping_address_line1}
                {order.shipping_address_line2 && `, ${order.shipping_address_line2}`}
              </div>
              <div>
                {order.shipping_city}, {order.shipping_state || ''}, {order.shipping_postal_code}
              </div>
              <div>{order.shipping_country}</div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold">Order Items</h3>
            <div className="mt-2 space-y-4 text-sm">
              {order.items.map(
                (item: {
                  variant_id: number;
                  product_name: string;
                  volume_ml: number;
                  quantity: number;
                  price_each: string;
                }) => (
                  <div key={item.variant_id} className="space-y-1 rounded-md border p-3">
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-muted-foreground text-xs">Volume: {item.volume_ml}ml</div>
                    <div className="flex justify-between text-sm">
                      <span>Qty: {item.quantity}</span>
                      <span>× ${item.price_each}</span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <Separator />

          {/* Tổng tiền + trạng thái */}
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${order.total_amount}</span>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-xs">
              Status: {order.status}
            </Badge>
          </div>
        </div>
      </ScrollArea>
    </SheetContent>
  );
}
