'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Product } from './product-table';
import { DialogVariantForm } from './dialog-varient';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface SidebarProductProps {
  product: Product;
  refetch?: () => void;
}

const SidebarProduct = ({ product, refetch }: SidebarProductProps) => {
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [brandId, setBrandId] = useState(product.brand_id?.toString() ?? ''); // ✅ fixed here
  const [saleCount, setSaleCount] = useState(product.sale_count?.toString() ?? '0');
  const [description, setDescription] = useState(product.short_description ?? '');
  const [isActive, setIsActive] = useState(product.status ?? false);
  const [gender, setGender] = useState(product.gender ?? 'unisex');

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await axios.get('/api/brands');
      return res.data.data as { id: number; name: string }[];
    },
  });

  const updateField = async (data: Partial<Product> & { brand_id?: number }) => {
    try {
      await axios.patch(`/api/products/${product.id}`, data);
      refetch?.();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleManualSave = async () => {
    try {
      await updateField({
        name,
        slug,
        brand_id: Number(brandId),
        short_description: description,
        sale_count: Number(saleCount),
      });
    } catch (err) {
      console.error('Failed to save manually edited fields:', err);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <EllipsisVertical strokeWidth={1.5} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex min-w-xl flex-col">
        <SheetHeader>
          <SheetTitle>Edit product</SheetTitle>
          <SheetDescription>
            Make changes to your product here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>

        <div className="grid max-h-[80vh] flex-1 auto-rows-min gap-6 overflow-y-auto px-4 py-4">
          {/* Product name */}
          <div className="grid gap-3">
            <Label htmlFor="name">Product name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-sm p-3"
            />
          </div>

          {/* Variants */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Variants</Label>
              <DialogVariantForm mode="add" productId={product.id} onSuccess={refetch} />
            </div>
            <div className="text-muted-foreground text-sm">
              {product.variants.map((variant) => (
                <div key={variant.id} className="grid grid-cols-5 items-center gap-2 border-b py-1">
                  <span>{variant.volume_ml}ml</span>
                  <span>{variant.sku}</span>
                  <span>{variant.price}₫</span>
                  <span>{variant.stock}</span>
                  <DialogVariantForm
                    mode="edit"
                    productId={product.id}
                    defaultValues={variant}
                    onSuccess={refetch}
                    showDeleteButton
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={isActive}
              onCheckedChange={(checked) => {
                setIsActive(checked);
                updateField({ status: checked });
              }}
            />
            <Label htmlFor="status">Active</Label>
          </div>

          {/* Gender */}
          <div className="grid gap-2">
            <Label>Sex</Label>
            <RadioGroup
              value={gender}
              onValueChange={(value) => {
                setGender(value);
                updateField({ gender: value });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unisex" id="unisex" />
                <Label htmlFor="unisex">Unisex</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Slug */}
          <div className="grid gap-3">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="rounded-sm p-3"
            />
          </div>

          {/* Brand Select */}
          <div className="grid gap-3">
            <Label htmlFor="brand">Brand</Label>
            <Select value={brandId} onValueChange={setBrandId}>
              <SelectTrigger className="rounded-sm p-3">
                <SelectValue>
                  {brandsData?.find((b) => b.id.toString() === brandId)?.name ?? 'Select a brand'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {brandsData?.map((b) => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sale Count */}
          <div className="grid gap-3">
            <Label htmlFor="sale">Sale Count</Label>
            <Input
              id="sale"
              type="number"
              value={saleCount}
              onChange={(e) => setSaleCount(e.target.value)}
              className="rounded-sm p-3"
            />
          </div>

          {/* Description */}
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter>
          <Button type="button" onClick={handleManualSave}>
            Save changes
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarProduct;
