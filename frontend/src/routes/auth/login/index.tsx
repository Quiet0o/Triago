import { LoginForm } from '#/features/auth/components/login-form';
import { authQueryOptions } from '#/features/auth/queries';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/login/')({
  beforeLoad: async ({ context }) => {
    if (typeof window === 'undefined') {
      return;
    }

    const user = await context.queryClient.ensureQueryData(authQueryOptions);
    if (user) {
      throw redirect({
        to: '/project',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
