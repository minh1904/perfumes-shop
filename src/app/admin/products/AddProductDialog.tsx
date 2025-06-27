// Full version of AddProductDialog with variant management like edit screen
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface Brand {
  id: number;
  name: string;
}
interface Variant {
  volume_ml: string;
  sku: string;
  price: string;
  stock: string;
}

export default function AddProductDialog() {
  const [show, setShow] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    brandId: '',
    gender: 'unisex',
    isActive: false,
    saleCount: '0',
    description: '',
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await axios.get('/api/brands');
      return res.data.data as Brand[];
    },
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { volume_ml: '', sku: '', price: '', stock: '' }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/products', {
        name: form.name,
        slug: form.slug,
        brand_id: Number(form.brandId),
        short_description: form.description,
        sale_count: Number(form.saleCount),
        gender: form.gender,
        status: form.isActive,
        product_variants: variants,
      });

      toast.success('Product created successfully');
      window.location.reload();
    } catch (err) {
      toast.error('Failed to create product');
      console.error(err);
    }
  };

  return (
    <>
      <Button onClick={() => setShow(true)}>Add Product</Button>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-md bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <Button variant="ghost" onClick={() => setShow(false)}>
                Close
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} />
                <Label>Brand</Label>
                <Select value={form.brandId} onValueChange={(val) => handleChange('brandId', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label>Gender</Label>
                <RadioGroup
                  value={form.gender}
                  onValueChange={(val) => handleChange('gender', val)}
                >
                  {['male', 'female', 'unisex'].map((g) => (
                    <div key={g} className="flex items-center space-x-2">
                      <RadioGroupItem value={g} id={g} />
                      <Label htmlFor={g}>{g}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex items-center gap-2">
                  <Switch
                    id="status"
                    checked={form.isActive}
                    onCheckedChange={(val) => handleChange('isActive', val)}
                  />
                  <Label htmlFor="status">Active</Label>
                </div>
                <Label>Sales Count</Label>
                <Input
                  type="number"
                  value={form.saleCount}
                  onChange={(e) => handleChange('saleCount', e.target.value)}
                />
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
                <Button onClick={handleSubmit}>Save Product</Button>
              </div>
              <div className="space-y-4">
                <Label>Variants</Label>
                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-5 items-center gap-2">
                    <Input
                      placeholder="ml"
                      value={v.volume_ml}
                      onChange={(e) => handleVariantChange(i, 'volume_ml', e.target.value)}
                    />
                    <Input
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                    />
                    <Input
                      placeholder="Price"
                      value={v.price}
                      onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                    />
                    <Input
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                    />
                    <Button size="sm" variant="destructive" onClick={() => handleRemoveVariant(i)}>
                      Delete
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddVariant}>
                  + Add variant
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
