import type { AdapterUser as DefaultAdapterUser } from '@auth/core/adapters';
import { users } from '@/db/schema';

declare module '@auth/core/adapters' {
  export interface AdapterUser extends DefaultAdapterUser {
    role: (typeof users.$inferSelect)['role'];
  }
}
