import { useCartStore } from '@/stores';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface AddToCartData {
  variantId: number;
  quantity: number;
  productData: {
    productId: number;
    productName: string;
    productSlug: string;
    brandName: string;
    volumeMl: number;
    price: number;
    sku: string;
    imageUrl?: string;
  };
}

export const useAddToCart = () => {
  const { data: session } = useSession();
  const { addItem } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddToCartData) => {
      const { variantId, quantity, productData } = data;
      addItem({
        variantId,
        quantity,
        ...productData,
      });
      if (session?.user?.id) {
        await axios.post(`/api/cart/${session.user.id}/add`, {
          variantId,
          quantity,
        });
      }
    },
    onSuccess: () => {
      toast.success('Add product to cart successfully');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast.error('Cant add product to cart');
    },
  });
};

export const useUpdateCartQuantity = () => {
  const { data: session } = useSession();
  const { updateQuantity, saveToServer } = useCartStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: number; quantity: number }) => {
      updateQuantity(variantId, quantity);

      if (session?.user?.id) {
        await saveToServer(session?.user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Update product to cart successfully');
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast.error('Cant update product to cart');
    },
  });
};

export const useRemoveFromCart = () => {
  const { data: session } = useSession();
  const { removeItem, saveToServer } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variantId: number) => {
      // Xóa khỏi local store
      removeItem(variantId);

      // Nếu user đã đăng nhập, đồng bộ với server
      if (session?.user?.id) {
        await saveToServer(session.user.id);
      }
    },
    onSuccess: () => {
      toast.success('Remove successfully');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
      toast.error('Cant remove');
    },
  });
};

export const useSyncCart = () => {
  const { data: session } = useSession();
  const { syncWithServer } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }
      await syncWithServer(session.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error syncing cart:', error);
    },
  });
};
