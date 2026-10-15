import * as React from 'react';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppSidebar } from '#/components/layout/app-sidebar.tsx';
import { SiteHeader } from '#/components/layout/site-header.tsx';
import { ProjectView } from '#/features/project/components/project-view';
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar.tsx';
import { TooltipProvider } from '#/components/ui/tooltip.tsx';
import { authQueryOptions } from '#/features/auth/queries';

export const Route = createFileRoute('/project')({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.query({
      ...authQueryOptions,
      staleTime: 'static',
    });
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
  const [globalSearch, setGlobalSearch] = React.useState('');

  return (
    <TooltipProvider>
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
      </SidebarProvider>
    </TooltipProvider>
  );
}
