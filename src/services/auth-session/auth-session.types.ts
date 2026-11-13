import { z } from 'zod';
import type { SuccessDataAny } from '@kk-garden/shared/errors';

const authSessionSchema = z.object({
  session: z.object({
    id: z.string(),
    expiresAt: z.coerce.date(),
  }),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
    image: z.string().nullable().optional(),
  }),
});

export const authSessionResponseSchema = authSessionSchema.nullable();

export type AuthSession = z.infer<typeof authSessionSchema>;

export type AuthSessionData = {
  session: AuthSession | null;
};

export type AuthSessionResult = SuccessDataAny<AuthSessionData>;
