import { authSessionResponseSchema, type AuthSession } from './auth-session.types';

export const parseAuthSessionResponse = (responseBody: unknown): AuthSession | null => {
  const parsedResponse: ReturnType<typeof authSessionResponseSchema.safeParse> =
    authSessionResponseSchema.safeParse(responseBody);

  if (!parsedResponse.success) {
    throw new Error(parsedResponse.error.message);
  }

  return parsedResponse.data;
};
