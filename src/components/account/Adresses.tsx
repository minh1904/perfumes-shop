'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // nếu có login flow
import { Address } from '@/types/types';

const Adresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get('/api/adresses');
        setAddresses(res.data);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div className="flex min-h-64 flex-col justify-between border p-4 md:col-span-3 md:p-5">
      <div>
        <p className="mb-3 text-2xl font-normal uppercase">adresses</p>

        {addresses.length === 0 && <p>No addresses found.</p>}

        {addresses.map((addr, index) => (
          <div key={index} className="mb-4 gap-52 lg:flex">
            <div>
              {' '}
              <div>
                <p className="font-normal">NAME</p>
                <p className="font-roslindale-medium-italic text-2xl">{addr.full_name}</p>
              </div>
              <div>
                {' '}
                <p className="mt-2 font-normal">EMAIL</p>
                <p className="font-roslindale-medium-italic text-2xl">
                  {session?.user?.email || 'Unknown'}
                </p>
              </div>
              <div>
                {' '}
                <p className="mt-2 font-normal">Phone</p>
                <p className="font-roslindale-medium-italic text-2xl">
                  {addr.phone_number || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="mt-2 font-normal">Country</p>
                <p className="font-roslindale-medium-italic text-2xl">
                  {addr.country || 'Unknown'}
                </p>
              </div>
            </div>
            <div>
              <div>
                <p className="mt-2 font-normal">City</p>
                <p className="font-roslindale-medium-italic text-2xl">{addr.city || 'Unknown'}</p>
              </div>
              <div>
                <p className="mt-2 font-normal">Address 1</p>
                <p className="font-roslindale-medium-italic text-2xl">
                  {addr.address_line1 || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="mt-2 font-normal">Address 2</p>
                <p className="font-roslindale-medium-italic text-2xl">
                  {addr.address_line2 || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="mt-2 font-normal">Postal Code</p>
                <p className="font-roslindale-medium-italic text-2xl">
                  {addr.postal_code || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="cursor-pointer font-normal underline">Edit</p>
    </div>
  );
};

export default Adresses;
