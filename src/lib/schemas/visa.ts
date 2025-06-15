import { z } from 'zod';

export const visaSchema = z.object({
  card_number: z.string().regex(/^\d{16}$/, 'Card number must be exactly 16 digits'),
  cardholder_name: z
    .string()
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(100, 'Cardholder name cannot exceed 100 characters'),
  expiry_date: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry date must be in MM/YY format'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

export type TVisaSchema = z.infer<typeof visaSchema>;
