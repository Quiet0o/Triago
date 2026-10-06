import * as React from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppSidebar } from '#/components/dashboard/layout/app-sidebar.tsx';
import { SiteHeader } from '#/components/dashboard/layout/site-header.tsx';
import { ProjectView } from '#/components/dashboard/views/project/project-view';
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar.tsx';
import { TooltipProvider } from '#/components/ui/tooltip.tsx';

export const Route = createFileRoute('/project')({
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
