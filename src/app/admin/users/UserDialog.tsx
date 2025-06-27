// UserDialog.tsx
'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface UserFormData {
  name: string;
  email: string;
  role: string;
  password?: string;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
  };
}

export function UserDialog({ open, onOpenChange, onSuccess, initialData }: UserDialogProps) {
  const [form, setForm] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        password: '',
      });
    }
  }, [initialData]);

  const handleChange = (key: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/users/${initialData.id}` : '/api/users';

      const body: Partial<UserFormData> = {
        name: form.name,
        email: form.email,
        role: form.role,
      };

      if (!initialData || (form.password && form.password.trim() !== '')) {
        body.password = form.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed');

      toast.success(`User ${initialData ? 'updated' : 'created'} successfully`);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.log(err);
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          <div>
            <Label>{initialData ? 'New Password (optional)' : 'Password'}</Label>
            <Input
              type="password"
              placeholder={initialData ? 'Leave blank to keep current password' : ''}
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(val) => handleChange('role', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {initialData ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
