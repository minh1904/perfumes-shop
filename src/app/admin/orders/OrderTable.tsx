'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { OrderDetailSheet } from './OrderDetailSheet';
import { OrderActionDialog } from './OrderActionDialog';
import { Loader2 } from 'lucide-react';

interface Order {
  id: number;
  user: { name: string };
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: string;
  created_at: string;
  shipping_full_name: string;
}

export function OrderTable({
  orders,
  onUpdated,
  loading,
}: {
  orders: Order[];
  onUpdated: () => void;
  loading: boolean;
}) {
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [actionOrderId, setActionOrderId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'ship' | 'cancel' | 'complete' | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.shipping_full_name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [orders, search]);

  const getStatusBadge = (status: Order['status']) => {
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

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by customer name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.shipping_full_name}</TableCell>
                  <TableCell>${order.total_amount}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          View
                        </Button>
                      </SheetTrigger>
                      {selectedOrderId === order.id && (
                        <OrderDetailSheet orderId={order.id} onUpdated={onUpdated} />
                      )}
                    </Sheet>

                    {order.status === 'paid' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setActionType('ship');
                            setActionOrderId(order.id);
                          }}
                        >
                          Ship
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setActionType('cancel');
                            setActionOrderId(order.id);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {order.status === 'shipped' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setActionType('complete');
                          setActionOrderId(order.id);
                        }}
                      >
                        Done
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {actionOrderId !== null && actionType !== null && (
        <OrderActionDialog
          orderId={actionOrderId}
          type={actionType}
          onClose={() => {
            setActionOrderId(null);
            setActionType(null);
          }}
          onSuccess={() => {
            setActionOrderId(null);
            setActionType(null);
            onUpdated();
          }}
        />
      )}
    </div>
  );
}
