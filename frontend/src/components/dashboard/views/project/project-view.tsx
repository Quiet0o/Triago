'use client';

import {
  LayoutGrid,
  List,
  Columns3,
  Code2,
  Clock,
  FileText,
  ClipboardList,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs.tsx';
import { BacklogView } from './backlog-view';
import { PlaceholderTab } from './placeholder-tab';
import type { MockData } from '../../tickets/types';
import mockData from '../../data/mock-tickets.json';

const data = mockData as MockData;

const projectTabs = [
  { id: 'summary', label: 'Summary', icon: LayoutGrid },
  { id: 'backlog', label: 'Backlog', icon: List },
  { id: 'board', label: 'Board', icon: Columns3 },
  { id: 'development', label: 'Development', icon: Code2 },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'forms', label: 'Forms', icon: ClipboardList },
] as const;

export function ProjectView({
  externalSearch = '',
}: {
  externalSearch?: string;
}) {
  return (
    <Tabs defaultValue="backlog" className="flex flex-col gap-0">
      {/* ── Project tab bar ─────────────────────────────────────────── */}
      <div className="border-b">
        <TabsList variant="line" className="h-10 gap-0 px-0">
          {projectTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="cursor-pointer gap-1.5 rounded-none px-3 text-[0.8125rem] data-[state=active]:shadow-none"
              >
                <Icon className="size-3.5" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <div className="pt-4">
        <TabsContent value="backlog" className="mt-0">
          <BacklogView
            tickets={data.tickets}
            sprints={data.sprints}
            externalSearch={externalSearch}
          />
        </TabsContent>

        {projectTabs
          .filter((t) => t.id !== 'backlog')
          .map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <PlaceholderTab tabId={tab.id} />
            </TabsContent>
          ))}
      </div>
    </Tabs>
  );
}
