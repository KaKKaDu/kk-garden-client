import { z } from 'zod';

const apiOriginSchema = z.url().refine(
  (value: string): boolean => {
    const url: URL = new URL(value);

    return (
      ['http:', 'https:'].includes(url.protocol) &&
      url.username.length === 0 &&
      url.password.length === 0 &&
      url.pathname === '/' &&
      url.search.length === 0 &&
      url.hash.length === 0
    );
  },
  { message: 'NEXT_PUBLIC_API_BASE_URL must be an absolute HTTP or HTTPS origin.' },
);

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: apiOriginSchema,
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ClientEnvVariable = keyof ClientEnv;
