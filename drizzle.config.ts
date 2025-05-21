import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd(), true);
config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
