import { ProductDescription } from '@/types/types';
import { sql, SQL } from 'drizzle-orm';

import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  type AnyPgColumn,
  uniqueIndex,
  serial,
  varchar,
  doublePrecision,
  decimal,
  jsonb,
  numeric,
} from 'drizzle-orm/pg-core';

import type { AdapterAccountType } from 'next-auth/adapters';

export const roleEnum = pgEnum('role', ['user', 'admin']);

export const users = pgTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
    password: text('password'),
    role: roleEnum('role').notNull().default('user'),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => [uniqueIndex('emailUniqueIndex').on(lower(table.email))],
);

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  logo_url: text('logo_url'),
  created_at: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  created_at: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: text('slug').unique().notNull(),
  brand_id: integer('brand_id')
    .references(() => brands.id)
    .notNull(),
  category_id: integer('category_id').references(() => categories.id),
  discount: doublePrecision('discount').default(0),
  short_description: text('short_description'),
  description: jsonb('description').$type<ProductDescription | null>(),
  gender: varchar('gender', { length: 10 }),
  top_notes: text('top_notes'),
  middle_notes: text('middle_notes'),
  base_notes: text('base_notes'),
  status: boolean('status').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  sale_count: numeric('sale_count').default('0'),
});

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id')
    .references(() => products.id)
    .notNull(),
  volume_ml: integer('volume_ml').notNull(),
  sku: text('sku').unique().notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
});

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id')
    .references(() => products.id)
    .notNull(),
  url: text('url').notNull(),
  alt_text: text('alt_text'),
  is_primary: boolean('is_primary').default(false),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  product_id: integer('product_id')
    .references(() => products.id)
    .notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow(),
});

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  variant_id: integer('variant_id')
    .references(() => productVariants.id)
    .notNull(),
  quantity: integer('quantity').default(1).notNull(),
  added_at: timestamp('added_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  status: text('status').default('pending'), // pending, paid, shipped, delivered
  total_amount: decimal('total_amount', { precision: 10, scale: 2 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  variant_id: integer('variant_id')
    .references(() => productVariants.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  price_each: decimal('price_each', { precision: 10, scale: 2 }),
});

export const wishlists = pgTable('wishlists', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  product_id: integer('product_id')
    .references(() => products.id)
    .notNull(),
  created_at: timestamp('created_at').defaultNow(),
});
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  full_name: text('full_name').notNull(),
  phone_number: varchar('phone_number', { length: 20 }).notNull(),
  address_line1: text('address_line1').notNull(),
  address_line2: text('address_line2'),
  city: text('city').notNull(),
  state: text('state'),
  postal_code: varchar('postal_code', { length: 20 }),
  country: text('country').notNull(),
  is_default: boolean('is_default').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
