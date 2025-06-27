'use client';

import { Button } from '@/components/ui/button';
import { Edit, Trash2, X, Upload } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import { useState, useEffect, useCallback } from 'react';
import { Product } from './product-table';
import { toast } from 'sonner';

interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
}

export default function EditProductImagesDialog({
  product,
  onUpdated,
}: {
  product: Product;
  onUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProductImages = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${product.id}/images`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load image list');
    }
  }, [product.id]);

  useEffect(() => {
    loadProductImages();
  }, [loadProductImages]);

  const uploadImage = async (result: unknown, isPrimary: boolean) => {
    setIsLoading(true);
    try {
      if (
        result &&
        typeof result === 'object' &&
        'info' in result &&
        result.info &&
        typeof result.info === 'object' &&
        'secure_url' in result.info
      ) {
        const secureUrl = result.info.secure_url as string;
        if (!secureUrl) {
          throw new Error('No secure_url found');
        }

        const response = await fetch(`/api/products/${product.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: secureUrl,
            alt_text: `${product.name} image`,
            is_primary: isPrimary,
          }),
        });

        if (response.ok) {
          toast.success(`Successfully uploaded ${isPrimary ? 'primary' : 'secondary'} image`);
          await loadProductImages();
          onUpdated?.();
        } else {
          throw new Error('Failed to save image to DB');
        }
      } else {
        throw new Error('Invalid upload result format');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image to database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (imageId: number, imageUrl: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${product.id}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetch('/api/cloudinary/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: imageUrl }),
        });

        await loadProductImages();
        toast.success('Image deleted successfully');
        onUpdated?.();
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setIsLoading(false);
    }
  };

  const primaryImage = images.find((img) => img.is_primary);
  const secondaryImages = images.filter((img) => !img.is_primary);

  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Edit className="mr-2 h-4 w-4" />
        Edit Images
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded bg-white p-6 shadow-lg">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 rounded p-1 text-gray-600 hover:text-black"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Manage Product Images: {product.name}</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Primary Image</h3>
                  {primaryImage ? (
                    <div className="relative w-full">
                      <Image
                        src={primaryImage.url}
                        alt="Primary image"
                        width={300}
                        height={300}
                        className="mb-2 rounded border object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleDelete(primaryImage.id, primaryImage.url)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No primary image</p>
                  )}
                  <CldUploadWidget
                    uploadPreset="ml_default"
                    onSuccess={(result) => uploadImage(result, true)}
                  >
                    {({ open }) => (
                      <Button onClick={() => open()} className="w-full" disabled={isLoading}>
                        <Upload className="mr-2 h-4 w-4" /> Upload New Primary Image
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Secondary Images</h3>
                  {secondaryImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {secondaryImages.map((img) => (
                        <div key={img.id} className="relative">
                          <Image
                            src={img.url}
                            alt="Secondary image"
                            width={150}
                            height={150}
                            className="rounded border object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleDelete(img.id, img.url)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No secondary images</p>
                  )}
                  <CldUploadWidget
                    uploadPreset="ml_default"
                    onSuccess={(result) => uploadImage(result, false)}
                  >
                    {({ open }) => (
                      <Button onClick={() => open()} className="w-full" disabled={isLoading}>
                        <Upload className="mr-2 h-4 w-4" /> Upload New Secondary Image
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
