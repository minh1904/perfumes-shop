import { useCartStore } from '@/stores';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface AddToCartData {
  variant_id: number;
  quantity: number;
  productData: {
    product_id: number;
    product_name: string;
    product_slug: string;
    brand_name: string;
    volume_ml: number;
    price: number;
    sku: string;
    image_url?: string;
  };
}

export const useAddToCart = () => {
  const { data: session } = useSession();
  const { addItem } = useCartStore();

  return useMutation({
    mutationFn: async (data: AddToCartData) => {
      const { variant_id, quantity, productData } = data;
      addItem({
        variant_id,
        quantity,
        ...productData,
      });
      if (session?.user?.id) {
        await axios.post(`/api/cart/${session.user.id}/add`, {
          variant_id,
          quantity,
        });
      }
    },
    onSuccess: () => {
      toast.success('Add product to cart successfully');
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
  return useMutation({
    mutationFn: async ({ variant_id, quantity }: { variant_id: number; quantity: number }) => {
      updateQuantity(variant_id, quantity);

      if (session?.user?.id) {
        await saveToServer(session?.user.id);
      }
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
    mutationFn: async (variant_id: number) => {
      // Xóa khỏi local store
      removeItem(variant_id);

      if (session?.user?.id) {
        await saveToServer(session.user.id);
      }
    },
    onSuccess: () => {
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
