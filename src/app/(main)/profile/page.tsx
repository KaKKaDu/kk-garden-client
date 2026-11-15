import type { ReactNode } from 'react';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm/ProfileEditForm';
import { profilePageClassNames } from './profile-page.styles';

export default function EditProfilePage(): ReactNode {
  return (
    <main className={profilePageClassNames.main}>
      <ProfileEditForm />
    </main>
  );
}
