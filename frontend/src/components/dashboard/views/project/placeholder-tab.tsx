'use client';

import {
  LayoutGrid,
  Columns3,
  Code2,
  Clock,
  FileText,
  ClipboardList,
} from 'lucide-react';

const placeholderContent: Record<
  string,
  { icon: typeof LayoutGrid; title: string; description: string }
> = {
  summary: {
    icon: LayoutGrid,
    title: 'Summary',
    description:
      'Project overview — statistics, velocity charts, burndown chart, and sprint summary.',
  },
  board: {
    icon: Columns3,
    title: 'Board',
    description: 'Kanban view — drag and drop tickets between status columns.',
  },
  development: {
    icon: Code2,
    title: 'Development',
    description:
      'Repository integration — commits, pull requests, and branches linked to tickets.',
  },
  timeline: {
    icon: Clock,
    title: 'Timeline',
    description:
      'Gantt view — timeline with deadlines, dependencies, and work progress.',
  },
  documents: {
    icon: FileText,
    title: 'Documents',
    description:
      'Knowledge base — documentation, procedures, and FAQ related to the project.',
  },
  forms: {
    icon: ClipboardList,
    title: 'Forms',
    description: 'Ticket form setup — fields, validation rules, and templates.',
  },
};

export const PlaceholderTab = ({ tabId }: { tabId: string }) => {
  const config = placeholderContent[tabId] ?? {
    icon: LayoutGrid,
    title: tabId,
    description: 'This section is currently under development.',
  };

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/15 bg-muted/10 py-20 px-8">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted shadow-sm ring-1 ring-border">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <div className="text-center max-w-md">
        <h3 className="text-sm font-semibold text-foreground capitalize">
          {config.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          {config.description}
        </p>
        <p className="mt-3 text-xs text-muted-foreground/60">Coming soon</p>
      </div>
    </div>
  );
};
