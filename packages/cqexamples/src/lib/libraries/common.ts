import { z } from 'zod';

export const quantitySchema = z.object({
  unit: z.string().nullable(),
  value: z.number(),
});
