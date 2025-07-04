'use client';

import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type CartItem = {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
  volume_ml?: number;
  // ... các trường khác nếu có
};

type Address = {
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
};

const CheckoutPage = ({
  amount,
  userId,
  cartItems,
  totalAmount,
  address,
  disabled,
}: {
  amount: number;
  userId: string;
  cartItems: CartItem[];
  totalAmount: number;
  address: Address;
  disabled?: boolean;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async () => {
    if (disabled) return;
    setIsLoading(true);
    if (!stripe || !elements) return;

    // Step 1: Tạo đơn hàng trước
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          address,
          items: cartItems,
          total_amount: totalAmount,
        }),
      });

      if (!res.ok) throw new Error('Failed to create order');
    } catch (error) {
      console.log(error);
      setErrorMessage('Không thể tạo đơn hàng. Vui lòng thử lại.');
      setIsLoading(false);
      return;
    }

    // Step 2: Gửi form thanh toán
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    // Step 3: Xác nhận thanh toán
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return <div>Processing...</div>;
  }

  return (
    <div className="mt-5 space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        type="button"
        className="w-full"
        disabled={isLoading || disabled}
        onClick={handleSubmit}
      >
        {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
      </Button>
    </div>
  );
};

export default CheckoutPage;
