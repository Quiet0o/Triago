import * as React from 'react';
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { AppSidebar } from '#/components/layout/app-sidebar.tsx';
import { SiteHeader } from '#/components/layout/site-header.tsx';
import { ProjectView } from '#/features/project/components/project-view';
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar.tsx';
import { TooltipProvider } from '#/components/ui/tooltip.tsx';
import { authQueryOptions, useAuth } from '#/features/auth/queries';
import { CreateTicketProvider } from '#/features/tickets/context/create-ticket-context';
import { CreateTicketModal } from '#/features/tickets/components/create-ticket-modal';

export const Route = createFileRoute('/project')({
  beforeLoad: async ({ context, location }) => {
    // During server-side rendering, cookies and browser storage are not available.
    // We allow initial render on server and enforce client-side auth validation.
    if (typeof window === 'undefined') {
      return;
    }

    const user = await context.queryClient.ensureQueryData(authQueryOptions);
    if (!user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      });
    }

    return { user };
  },
  component: ProjectLayout,
});

function ProjectLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [globalSearch, setGlobalSearch] = React.useState('');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted && !user) {
      void navigate({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      });
    }
  }, [isMounted, user, navigate, location.href]);

  if (!isMounted || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <CreateTicketProvider>
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader searchQuery={globalSearch} onSearchChange={setGlobalSearch} />
            <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
              <ProjectView externalSearch={globalSearch}>
                <Outlet />
              </ProjectView>
            </main>
          </SidebarInset>
          <CreateTicketModal />
        </SidebarProvider>
      </CreateTicketProvider>
    </TooltipProvider>
  );
}
