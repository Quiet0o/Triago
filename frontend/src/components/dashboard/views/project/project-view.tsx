'use client';

import * as React from 'react';
import {
  LayoutGrid,
  List,
  Columns3,
  Code2,
  Clock,
  FileText,
} from 'lucide-react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs.tsx';

export const projectTabs = [
  { id: 'summary', label: 'Summary', icon: LayoutGrid },
  { id: 'backlog', label: 'Backlog', icon: List },
  { id: 'board', label: 'Board', icon: Columns3 },
  { id: 'development', label: 'Development', icon: Code2 },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'documents', label: 'Documents', icon: FileText },
] as const;

export type ProjectTabId = (typeof projectTabs)[number]['id'];

const ProjectSearchContext = React.createContext<string>('');
export const useProjectSearch = () => React.useContext(ProjectSearchContext);

export function ProjectView({
  externalSearch = '',
  children,
}: {
  externalSearch?: string;
  children?: React.ReactNode;
}) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const activeTab =
    projectTabs.find((tab) => pathname.includes(`/project/${tab.id}`))?.id ??
    'backlog';

  return (
    <ProjectSearchContext.Provider value={externalSearch}>
      <Tabs value={activeTab} className="flex flex-col gap-0">
        {/* ── Project tab bar ─────────────────────────────────────────── */}
        <div className="border-b">
          <TabsList variant="line" className="h-10 gap-0 px-0">
            {projectTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  asChild
                  className="cursor-pointer gap-1.5 rounded-none px-3 text-[0.8125rem] data-[state=active]:shadow-none"
                >
                  <Link to={`/project/${tab.id}/`}>
                    <Icon className="size-3.5" />
                    {tab.label}
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="pt-4">{children ?? <Outlet />}</div>
      </Tabs>
    </ProjectSearchContext.Provider>
  );
}
