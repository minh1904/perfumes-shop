'use client';
import { signoutUserAction } from '@/actions/sign-out-action';
import Adresses from '@/components/account/Adresses';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

const select = [
  { select: 'Contact Information', label: 'contact-information' },
  { select: 'Adresses', label: 'adresses' },
  { select: 'Orders', label: 'orders' },
];

const clickHandle = async () => {
  await signoutUserAction();
  window.location.href = '/';
};

const Page = () => {
  const [selected, setSelected] = useState<string>('contact-information');
  const { data: session } = useSession();

  return (
    <div className="mx-5 min-h-screen py-5">
      <p className="mt-20 text-xl font-medium">Welcome, {session?.user?.name}!</p>

      {/* Responsive Grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-6">
        {/* Sidebar */}
        <div className="flex flex-col justify-between md:max-h-64 md:min-h-64 md:border md:p-5">
          <div className="flex flex-row gap-4 md:flex-col md:gap-2">
            {select.map((item) => (
              <div key={item.label}>
                <p
                  onClick={() => setSelected(item.label)}
                  className={`relative inline-block cursor-pointer font-normal transition-colors duration-200 ${
                    selected === item.label ? 'text-blacky font-bold' : 'text-gray-700'
                  } after:bg-blacky after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:transition-transform after:duration-300 ${
                    selected === item.label ? 'after:scale-x-100' : 'after:scale-x-0'
                  }`}
                >
                  {item.select}
                </p>
              </div>
            ))}
          </div>

          <p
            onClick={clickHandle}
            className="mt-5 cursor-pointer font-normal text-red-500 underline"
          >
            Sign out
          </p>
        </div>

        {/* Main Content */}

        {selected === 'contact-information' && (
          <div className="flex min-h-64 flex-col justify-between border p-4 md:col-span-3 md:p-5">
            <div>
              <p className="mb-3 text-2xl font-normal">CONTACT INFORMATION</p>
              <p className="font-normal">NAME</p>
              <p className="font-roslindale-medium-italic text-2xl">{session?.user?.name}</p>
              <p className="mt-2 font-normal">EMAIL</p>
              <p className="font-roslindale-medium-italic text-2xl">{session?.user?.email}</p>
            </div>
            <p className="cursor-pointer font-normal underline">Edit</p>
          </div>
        )}
        {selected === 'adresses' && <Adresses />}
        {selected === 'orders' && <p>Orders content here...</p>}
      </div>
    </div>
  );
};

export default Page;
