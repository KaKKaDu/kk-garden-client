import { z } from 'zod';
import { signInOtpLength } from '../constants/sign-in.constants';

const signInOtpPattern: RegExp = new RegExp(`^\\d{${signInOtpLength}}$`);

export const signInEmailSchema = z.object({
  email: z.email('Enter a valid email address.'),
});

export const signInOtpSchema = z.object({
  otp: z.string().regex(signInOtpPattern, `Enter the ${signInOtpLength}-digit code.`),
});

export type SignInEmailValues = z.infer<typeof signInEmailSchema>;
export type SignInOtpValues = z.infer<typeof signInOtpSchema>;
