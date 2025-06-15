// app/admin/layout.tsx
import AdminLayout from '@/components/layout/admin';
import { ReactNode } from 'react';

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
