import type { StaticTexts } from '@/types/static-texts.types';

export const signInViewTexts = {
  brand: '2k-garden',
  eyebrow: 'Not the look - the feel',
  headline: 'Room for things that truly matter',
  description: 'Your own unique digital space',
  tagline: 'Buy something that you really own.',
  title: 'Sign in',
  instructions: 'Choose a sign-in method to continue.',
  modeTabsLabel: 'Choose sign-in or registration',
  loginTab: 'Log in',
  registerTab: 'Register',
  registerTitle: 'Create your account',
  registerInstructions:
    'Use Google or GitHub to create an account. Email registration is unavailable.',
  separator: 'Or',
  disclaimer:
    'By continuing, you agree to use this account responsibly and keep your sign-in details secure.',
} as const satisfies StaticTexts;
