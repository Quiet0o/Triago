import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/project/app')({
  beforeLoad: () => {
    throw redirect({ to: '/project/backlog' });
  },
  component: () => null,
});
