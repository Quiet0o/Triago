import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { AppSidebar } from '#/components/dashboard/app-sidebar.tsx';
import { SiteHeader } from '#/components/dashboard/site-header.tsx';
import { DataTable } from '#/components/dashboard/data-table.tsx';
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar.tsx';
import { TooltipProvider } from '#/components/ui/tooltip.tsx';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  const [globalSearch, setGlobalSearch] = React.useState('');

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
          />
          <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
            <DataTable externalSearch={globalSearch} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
