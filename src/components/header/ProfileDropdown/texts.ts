import type { StaticTexts } from '@/types/static-texts.types';

export const headerProfileDropdownTexts = {
  openProfileMenu: 'Open profile menu',
  profile: 'Profile',
  account: 'Account',
  profileError: 'Could not load profile.',
  copyLookupCode: 'Copy lookup code',
  lookupCodeCopied: 'Lookup code copied.',
  lookupCodeCopyError: 'Could not copy lookup code.',
  editProfile: 'Edit profile',
  logout: 'Log out',
  signingOut: 'Signing out...',
  logoutError: 'Could not log out. Please try again.',
} as const satisfies StaticTexts;
