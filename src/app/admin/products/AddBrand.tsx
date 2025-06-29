'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface Brand {
  id: number;
  name: string;
}

export function AddBrand() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ id: null as number | null, name: '' });
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  // Load all brands
  const loadBrands = async () => {
    try {
      const res = await axios.get('/api/brands');
      setBrands(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load brands');
    }
  };

  useEffect(() => {
    if (dialogOpen) loadBrands();
  }, [dialogOpen]);

  const handleSubmit = async () => {
    try {
      if (!form.name.trim()) {
        toast.error('Brand name is required');
        return;
      }

      if (form.id) {
        await axios.put(`/api/brands/${form.id}`, { name: form.name });
        toast.success('Brand updated');
      } else {
        await axios.post('/api/brands', { name: form.name });
        toast.success('Brand created');
      }

      setForm({ id: null, name: '' });
      loadBrands();
    } catch (err) {
      toast.error('Failed to save brand');
    }
  };

  const handleEdit = (brand: Brand) => {
    setForm(brand);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/brands/${deleteTarget.id}`);
      toast.success('Brand deleted');
      setDeleteTarget(null);
      loadBrands();
    } catch (err) {
      toast.error('Failed to delete brand');
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add brand</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] w-full max-w-[80vw] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Brands</DialogTitle>
            <DialogDescription>Add, edit or delete brands below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Brand Form */}
            <div className="grid gap-3">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                placeholder="Enter brand name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit}>{form.id ? 'Update' : 'Add'}</Button>
                {form.id && (
                  <Button variant="secondary" onClick={() => setForm({ id: null, name: '' })}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Brand List */}
            <div className="space-y-2">
              {brands.map((brand) => (
                <Card key={brand.id} className="border px-3 py-2">
                  <CardContent className="flex items-center justify-between p-0 py-1">
                    <span>{brand.name}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(brand)}>
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteTarget(brand)}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete brand: <strong>{brand.name}</strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={handleDelete}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
