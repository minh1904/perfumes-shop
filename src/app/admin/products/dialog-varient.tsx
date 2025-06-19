import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface VariantData {
  id?: number;
  volume_ml: number;
  sku: string;
  price: number;
  stock: number;
  product_id: number;
}

export function DialogVariantForm({
  mode,
  defaultValues,
  productId,
  onSuccess,
  showDeleteButton,
}: {
  mode: 'edit' | 'add';
  defaultValues?: Partial<VariantData>;
  productId: number;
  onSuccess?: () => void;
  showDeleteButton?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<VariantData>({
    defaultValues: {
      ...defaultValues,
      product_id: productId,
    } as VariantData,
  });

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const addVariant = useMutation({
    mutationFn: (data: VariantData) => axios.post('/api/variants', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess?.();
      reset();
      setOpen(false);
    },
  });

  const updateVariant = useMutation({
    mutationFn: (data: VariantData) => axios.put(`/api/variants/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess?.();
      reset();
      setOpen(false);
    },
  });

  const deleteVariant = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/variants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess?.();
      setOpen(false);
    },
  });

  const onSubmit = async (data: VariantData) => {
    if (mode === 'edit') {
      await updateVariant.mutateAsync(data);
    } else {
      await addVariant.mutateAsync(data);
    }
  };

  const handleDelete = async () => {
    if (!defaultValues?.id) return;
    await deleteVariant.mutateAsync(defaultValues.id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{mode === 'edit' ? 'Edit' : 'Add'} Variant</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{mode === 'edit' ? 'Edit Variant' : 'Add Variant'}</DialogTitle>
            <DialogDescription>
              {mode === 'edit'
                ? 'Update this product variant and click save when done.'
                : 'Fill in the fields to add a new product variant.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="volume">Volume (ml)</Label>
            <Input
              id="volume"
              type="number"
              {...register('volume_ml', { valueAsNumber: true, required: true })}
            />

            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...register('sku', { required: true })} />

            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              {...register('price', { valueAsNumber: true, required: true })}
            />

            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              {...register('stock', { valueAsNumber: true, required: true })}
            />
          </div>

          <DialogFooter className="flex justify-between">
            {mode === 'edit' && showDeleteButton && defaultValues?.id ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the variant.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {deleteVariant.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <span />
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
