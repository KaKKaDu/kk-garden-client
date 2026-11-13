import { z } from 'zod';
import { ProfileBioSchema, ProfileDisplayNameSchema } from '@kk-garden/shared/schemas';

export const profileEditSchema = z.object({
  displayName: ProfileDisplayNameSchema,
  bio: z
    .string()
    .refine(
      (value) => value.trim().length === 0 || ProfileBioSchema.safeParse(value.trim()).success,
      'Bio must contain 1 to 280 Unicode code points',
    ),
});

export type ProfileEditValues = z.infer<typeof profileEditSchema>;
