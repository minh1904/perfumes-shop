'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/stores';
import { useSession } from 'next-auth/react';

export default function PaymentSuccess() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');

  useEffect(() => {
    clearCart();

    const deleteCartFromDB = async () => {
      if (!userId) return;

      try {
        await fetch('/api/cart/clear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });
      } catch (err) {
        console.error('Failed to clear cart in DB:', err);
      }
    };

    deleteCartFromDB();

    const timer = setTimeout(() => {
      router.push('/');
    }, 8000);

    return () => clearTimeout(timer);
  }, [router, clearCart, userId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-6 py-12">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-xl">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="text-green-500" size={64} />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="mb-6 text-gray-600">
          Thank you for your purchase. We’ve received your payment.
        </p>
        <div className="mb-6 text-3xl font-extrabold text-purple-600">${amount}</div>

        <p className="mb-2 text-sm text-gray-500">You’ll be redirected to the homepage shortly.</p>

        <button
          onClick={() => router.push('/')}
          className="mt-4 inline-block rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition duration-200 hover:bg-indigo-700"
        >
          Go to Homepage Now
        </button>
      </div>
    </main>
  );
}
