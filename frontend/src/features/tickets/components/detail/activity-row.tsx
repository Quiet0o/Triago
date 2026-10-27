'use client';

import { ArrowRight, History, Plus, User } from 'lucide-react';
import type { ActivityEvent } from '#/types/tickets';

export interface ActivityRowProps {
  activity: ActivityEvent;
}

export function ActivityRow({ activity }: ActivityRowProps) {
  const renderIcon = () => {
    switch (activity.type) {
      case 'created':
        return (
          <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Plus className="size-3" />
          </div>
        );
      case 'status':
        return (
          <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <ArrowRight className="size-3" />
          </div>
        );
      case 'assignee':
        return (
          <div className="flex size-6 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
            <User className="size-3" />
          </div>
        );
      default:
        return (
          <div className="flex size-6 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground">
            <History className="size-3" />
          </div>
        );
    }
  };

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground py-0.5">
      <div className="size-8 flex items-center justify-center shrink-0">{renderIcon()}</div>
      <div className="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
        <span className="font-semibold text-foreground">{activity.user}</span>
        <span>{activity.action}</span>
        <span className="font-semibold text-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/60 text-[11px]">
          {activity.target}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground shrink-0">{activity.time}</span>
    </div>
  );
}
