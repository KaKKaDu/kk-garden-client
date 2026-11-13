import type { ReactNode } from 'react';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm/ProfileEditForm';

export default function EditProfilePage(): ReactNode {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <ProfileEditForm />
    </main>
  );
}
