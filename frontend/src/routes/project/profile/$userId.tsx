import { createFileRoute } from '@tanstack/react-router';
import { UserProfileView } from '#/features/profile/components/user-profile-view';

export const Route = createFileRoute('/project/profile/$userId')({
  component: UserProfilePage,
});

function UserProfilePage() {
  const { userId } = Route.useParams();
  return <UserProfileView userIdOrEmail={userId} />;
}
