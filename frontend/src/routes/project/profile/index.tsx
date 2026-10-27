import { createFileRoute } from '@tanstack/react-router';
import { UserProfileView } from '#/features/profile/components/user-profile-view';
import { useAuth } from '#/features/auth/queries';

export const Route = createFileRoute('/project/profile/')({
  component: MyProfilePage,
});

function MyProfilePage() {
  const { user } = useAuth();
  const currentEmail = user?.email ?? 'a.nowak@triago.pl';

  return <UserProfileView userIdOrEmail={currentEmail} />;
}
