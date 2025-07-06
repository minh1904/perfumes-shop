'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  orderId: number;
  type: 'ship' | 'cancel' | 'complete';
  onClose: () => void;
  onSuccess: () => void;
}

export function OrderActionDialog({ orderId, type, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const labelMap = {
    ship: 'Mark as Shipped',
    cancel: 'Cancel Order',
    complete: 'Mark as Delivered',
  };

  const confirmTextMap = {
    ship: 'Are you sure you want to mark this order as shipped?',
    cancel: 'Are you sure you want to cancel this order?',
    complete: 'Are you sure the customer has received this order?',
  };

  const statusMap = {
    ship: 'shipped',
    cancel: 'cancelled',
    complete: 'delivered',
  };

  const label = labelMap[type];
  const confirmText = confirmTextMap[type];
  const statusToUpdate = statusMap[type];

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusToUpdate }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Order ${statusToUpdate} successfully`);
      onSuccess();
    } catch {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">{confirmText}</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
