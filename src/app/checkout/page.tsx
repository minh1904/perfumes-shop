'use client';

import { useCartStore } from '@/stores';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutPage from "@/components/checkoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const Page = () => {
  const { getTotalPrice } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "")
  return (
    <div className="min-h-screen bg-white">
      {/* Order Summary full width bg */}
      <div className="w-full bg-[#F6F6F6]">
        <div
          className="mx-auto flex h-18 max-w-[40rem] cursor-pointer items-center justify-between border-y border-gray-200 px-5"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <p className="flex items-center gap-2 text-base font-medium">
            Order summary
            <span>
              {isOpen ? <ChevronUp strokeWidth={1.25} /> : <ChevronDown strokeWidth={1.25} />}
            </span>
          </p>

          <p className="text-xl font-semibold">{getTotalPrice()} $</p>
        </div>
      </div>

      {/* Content Expand full width bg */}
      <div className="w-full overflow-hidden bg-[#EAEDF4] transition-all duration-300">
        <div
          className={`mx-auto max-w-[40rem] px-5 transition-all duration-300 ${
            isOpen ? 'h-32 p-5' : 'h-0 p-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-24 items-center gap-2.5">
              <Image
                src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747561220/miska-sage-GnF5Xpu-764-unsplash_ekecqp.jpg"
                alt="image"
                height={600}
                width={600}
                className="h-full w-auto rounded-2xl object-cover"
              />
              <div className="space-y-1">
                <p>HYALURONIC ACID FACE SERUM</p>
                <p>25ml</p>
                <div className="flex w-24 items-center justify-between">
                  <span className="bg-blacky flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white">
                    -
                  </span>
                  <p className="text-lg">2</p>
                  <span className="bg-blacky flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white">
                    +
                  </span>
                </div>
              </div>
            </div>
            <p className="font-semibold">45$</p>
          </div>
        </div>
      </div>

      {/* Express checkout */}
      <div className="mx-auto mt-5 max-w-[40rem] px-5">
        <p className="text-center text-gray-400">Express checkout</p>
        <div className="mt-5 grid h-15 grid-cols-2 items-center gap-3">
          {/* Paypal */}
          <div className="flex h-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FFC439] font-semibold">
            <svg
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="7.056000232696533 3 37.35095977783203 45"
            >
              <g xmlns="http://www.w3.org/2000/svg" clip-path="url(#a)">
                <path
                  fill="#002991"
                  d="M38.914 13.35c0 5.574-5.144 12.15-12.927 12.15H18.49l-.368 2.322L16.373 39H7.056l5.605-36h15.095c5.083 0 9.082 2.833 10.555 6.77a9.687 9.687 0 0 1 .603 3.58z"
                ></path>
                <path
                  fill="#60CDFF"
                  d="M44.284 23.7A12.894 12.894 0 0 1 31.53 34.5h-5.206L24.157 48H14.89l1.483-9 1.75-11.178.367-2.322h7.497c7.773 0 12.927-6.576 12.927-12.15 3.825 1.974 6.055 5.963 5.37 10.35z"
                ></path>
                <path
                  fill="#008CFF"
                  d="M38.914 13.35C37.31 12.511 35.365 12 33.248 12h-12.64L18.49 25.5h7.497c7.773 0 12.927-6.576 12.927-12.15z"
                ></path>
              </g>
            </svg>{' '}
            Paypal
          </div>

          {/* Google Pay */}
          <div className="bg-blacky flex h-full cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 256 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
            Google Pay
          </div>
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-[40rem] items-center px-5 text-gray-500">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-4">OR</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>
      <div className='mx-auto mt-5 max-w-[40rem] px-5'> <Elements stripe={stripePromise} options={{
        mode: "payment",
        amount: convertToSubcurrency(getTotalPrice()),
        currency: "usd",
      }}>
        <CheckoutPage amount={getTotalPrice()} />
      </Elements></div>
    </div>
  );
};

export default Page;

