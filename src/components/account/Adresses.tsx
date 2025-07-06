'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Address } from '@/types/types';

import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const fallback = (value?: string | null) => (value && value.trim() !== '' ? value : 'Unknown');

const Adresses = () => {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await axios.get(`/api/adresses/user/${session.user.id}`);
        setAddresses(res.data);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      }
    };

    fetchAddresses();
  }, [session?.user?.id]);

  const handleChange = (field: keyof Address, value: string) => {
    if (!selectedAddress) return;
    setSelectedAddress({ ...selectedAddress, [field]: value });
  };

  const handleSave = async () => {
    if (!selectedAddress || !session?.user?.id) return;

    try {
      await axios.put(`/api/adresses/user/${session.user.id}`, selectedAddress);

      setAddresses((prev) =>
        prev.map((addr) => (addr.id === selectedAddress.id ? selectedAddress : addr)),
      );
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to update address', err);
    }
  };

  return (
    <div className="flex min-h-64 flex-col justify-between border p-4 md:col-span-3 md:p-5">
      <div>
        <p className="mb-3 text-2xl font-normal uppercase">Addresses</p>

        {addresses.length === 0 && <p>No addresses found.</p>}

        {addresses.map((addr) => (
          <div key={addr.id} className="mb-4 gap-52 lg:flex">
            <div>
              <p className="font-normal">NAME</p>
              <p className="font-roslindale-medium-italic text-2xl">{fallback(addr.full_name)}</p>

              <p className="mt-2 font-normal">EMAIL</p>
              <p className="font-roslindale-medium-italic text-2xl">
                {fallback(session?.user?.email)}
              </p>

              <p className="mt-2 font-normal">Phone</p>
              <p className="font-roslindale-medium-italic text-2xl">
                {fallback(addr.phone_number)}
              </p>

              <p className="mt-2 font-normal">Country</p>
              <p className="font-roslindale-medium-italic text-2xl">{fallback(addr.country)}</p>
            </div>

            <div>
              <p className="mt-2 font-normal">City</p>
              <p className="font-roslindale-medium-italic text-2xl">{fallback(addr.city)}</p>

              <p className="mt-2 font-normal">Address 1</p>
              <p className="font-roslindale-medium-italic text-2xl">
                {fallback(addr.address_line1)}
              </p>

              <p className="mt-2 font-normal">Address 2</p>
              <p className="font-roslindale-medium-italic text-2xl">
                {fallback(addr.address_line2)}
              </p>

              <p className="mt-2 font-normal">Postal Code</p>
              <p className="font-roslindale-medium-italic text-2xl">{fallback(addr.postal_code)}</p>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <p
                    onClick={() => {
                      setSelectedAddress(addr);
                      setIsOpen(true);
                    }}
                    className="mt-3 cursor-pointer text-blue-500 underline"
                  >
                    Edit
                  </p>
                </SheetTrigger>

                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit Address</SheetTitle>
                  </SheetHeader>

                  <div className="mt-4 flex flex-col gap-3">
                    <Input
                      placeholder="Full Name"
                      value={selectedAddress?.full_name || ''}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                    />
                    <Input
                      placeholder="Phone Number"
                      value={selectedAddress?.phone_number || ''}
                      onChange={(e) => handleChange('phone_number', e.target.value)}
                    />
                    <Input
                      placeholder="City"
                      value={selectedAddress?.city || ''}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                    <Input
                      placeholder="Address Line 1"
                      value={selectedAddress?.address_line1 || ''}
                      onChange={(e) => handleChange('address_line1', e.target.value)}
                    />
                    <Input
                      placeholder="Address Line 2"
                      value={selectedAddress?.address_line2 || ''}
                      onChange={(e) => handleChange('address_line2', e.target.value)}
                    />
                    <Input
                      placeholder="Postal Code"
                      value={selectedAddress?.postal_code || ''}
                      onChange={(e) => handleChange('postal_code', e.target.value)}
                    />
                    <Input
                      placeholder="Country"
                      value={selectedAddress?.country || ''}
                      onChange={(e) => handleChange('country', e.target.value)}
                    />

                    <Button className="mt-4" onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Adresses;
