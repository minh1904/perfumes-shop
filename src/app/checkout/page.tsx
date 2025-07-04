'use client';

import { useCartStore } from '@/stores';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutPage from '@/components/checkoutPage';
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

const Page = () => {
  const { getTotalPrice, items: localItems } = useCartStore();
  const [isOpen, setIsOpen] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'Vietnam',
    },
  });

  const [addressData, setAddressData] = useState<Address | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAddress = async () => {
      try {
        const res = await fetch(`/api/adresses/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch address');
        const data = await res.json();

        const [firstName, ...lastParts] = data.full_name?.split(' ') || [''];
        reset({
          firstName,
          lastName: lastParts.join(' '),
          email: '',
          phone: data.phone_number || '',
          street: data.address_line1 || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.postal_code || '',
          country: data.country || 'Vietnam',
        });

        // Lưu lại address để truyền sang CheckoutPage
        setAddressData({
          full_name: data.full_name,
          phone_number: data.phone_number,
          address_line1: data.address_line1,
          address_line2: '',
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country || 'Vietnam',
        });
      } catch (err) {
        toast.warning('Could not load saved address.');
        console.error(err);
      }
    };

    fetchAddress();
  }, [userId, reset]);

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      <div className="max-h-screen w-full overflow-y-auto border-r border-gray-200 md:w-2/3">
        <div className="sticky top-0 z-10 w-full bg-[#F6F6F6]">
          <div
            className="mx-auto flex h-18 max-w-[70rem] cursor-pointer items-center justify-between border-y border-gray-200 px-6 py-4"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <p className="flex items-center gap-2 text-lg font-semibold">
              Order summary
              <span>
                {isOpen ? <ChevronUp strokeWidth={1.25} /> : <ChevronDown strokeWidth={1.25} />}
              </span>
            </p>
            <p className="text-xl font-bold text-gray-800">${getTotalPrice().toFixed(2)}</p>
          </div>
        </div>

        <div className="w-full bg-white">
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-[70rem] divide-y divide-gray-200 px-6"
              >
                {localItems.length > 0 ? (
                  localItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row"
                    >
                      <div className="flex w-full items-center gap-4 md:w-2/3">
                        <Image
                          src={item.image_url || '/logo.png'}
                          alt="image"
                          height={80}
                          width={80}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                        <div className="space-y-1">
                          <p className="text-base font-medium text-gray-800">{item.product_name}</p>
                          <p className="text-sm text-gray-500">{item.volume_ml}ml</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-semibold text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="py-10 text-center text-gray-500"
                  >
                    Your cart is empty. <br />
                    <a href="/shop" className="text-blue-600 underline">
                      Browse to shop
                    </a>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full space-y-8 px-5 py-8 md:w-1/3 md:py-10">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(() => {})}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input {...register('firstName', { required: true })} placeholder="First name" />
                <Input {...register('lastName', { required: true })} placeholder="Last name" />
              </div>
              <Input {...register('email', { required: true })} placeholder="Email" />
              <Input {...register('phone', { required: true })} placeholder="Phone" />
              <Input {...register('street', { required: true })} placeholder="Street address" />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input {...register('city', { required: true })} placeholder="City" />
                <Input {...register('state', { required: true })} placeholder="State" />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input {...register('zip', { required: true })} placeholder="Postal Code" />
                <Input {...register('country', { required: true })} placeholder="Country" />
              </div>

              {addressData && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: 'payment',
                    amount: convertToSubcurrency(getTotalPrice()),
                    currency: 'usd',
                  }}
                >
                  <CheckoutPage
                    amount={getTotalPrice()}
                    userId={userId || ''}
                    cartItems={localItems}
                    totalAmount={getTotalPrice()}
                    address={addressData}
                    disabled={!isValid || getTotalPrice() === 0}
                  />
                </Elements>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
