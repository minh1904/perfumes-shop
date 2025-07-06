'use client';

import { useCartStore } from '@/stores';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutPage from '@/components/checkoutPage';
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

type Address = {
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

type CheckoutForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const Page = () => {
  const { getTotalPrice, items: localItems } = useCartStore();
  const [isOpen, setIsOpen] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [submittedAddress, setSubmittedAddress] = useState<Address | null>(null);

  const {
    register,
    handleSubmit,
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

  const onSubmit = (data: CheckoutForm) => {
    const fullAddress = {
      full_name: `${data.firstName} ${data.lastName}`,
      phone_number: data.phone,
      address_line1: data.street,
      address_line2: '',
      city: data.city,
      state: data.state,
      postal_code: data.zip,
      country: data.country,
    };
    setSubmittedAddress(fullAddress);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      {/* Order Summary */}
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

      {/* Address + Payment */}
      <div className="w-full space-y-8 px-5 py-8 md:w-1/3 md:py-10">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

              <button
                type="submit"
                disabled={!isValid}
                className="w-full rounded-lg bg-black py-3 text-white"
              >
                Comfirm address to checkout
              </button>
            </form>
          </CardContent>
        </Card>

        {submittedAddress && (
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
              address={submittedAddress}
              disabled={false}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Page;
