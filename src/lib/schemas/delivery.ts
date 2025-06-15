import { z } from 'zod';

export const addressSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  phone_number: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(20, 'Phone number cannot exceed 20 digits'),
  address_line1: z
    .string()
    .min(5, 'Address Line 1 must be at least 5 characters')
    .max(255, 'Address Line 1 cannot exceed 255 characters'),
  address_line2: z
    .string()
    .max(255, 'Address Line 2 cannot exceed 255 characters')
    .optional()
    .nullable(),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City cannot exceed 100 characters'),
  state: z.string().max(100, 'State cannot exceed 100 characters').optional().nullable(),
  postal_code: z.string().max(20, 'Postal code cannot exceed 20 characters').optional().nullable(),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country cannot exceed 100 characters'),
  is_default: z.boolean().optional(),
});

export type TAddressSchema = z.infer<typeof addressSchema>;
