// UserManagementPage.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserTable } from './UserTable';
import { UserDialog } from './UserDialog';

export default function UserManagementPage() {
  const [openDialog, setOpenDialog] = useState(false);

  const { data: users = [], refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      return data.users;
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setOpenDialog(true)}>Add User</Button>
      </div>

      <UserTable users={users} onUpdated={refetch} />

      <UserDialog open={openDialog} onOpenChange={setOpenDialog} onSuccess={refetch} />
    </div>
  );
}
