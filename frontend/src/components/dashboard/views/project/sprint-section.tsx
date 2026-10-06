'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Zap,
} from 'lucide-react';
import type {
  ColumnVisibilityState,
  SortingState,
} from '@tanstack/react-table';
import type { Ticket, Sprint } from '../../tickets/types';
import { TicketTable } from './ticket-table';

const SprintHeader = ({
  sprint,
  ticketCount,
  totalPoints,
  isOpen,
  onToggle,
}: {
  sprint: Sprint | null;
  ticketCount: number;
  totalPoints: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const isBacklog = !sprint;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="group flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
    >
      {isOpen ? (
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform" />
      ) : (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform" />
      )}

      {isBacklog ? (
        <>
          <span className="text-sm font-semibold text-foreground">Backlog</span>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums text-muted-foreground ring-1 ring-border">
            {ticketCount}
          </span>
        </>
      ) : (
        <>
          {sprint.status === 'active' ? (
            <Zap className="size-3.5 shrink-0 text-emerald-500" />
          ) : (
            <CheckCircle2 className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="text-sm font-semibold text-foreground">
            {sprint.name}
          </span>
          {sprint.status === 'active' && (
            <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[0.625rem] font-semibold text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
              ACTIVE
            </span>
          )}
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums text-muted-foreground ring-1 ring-border">
            {ticketCount} tickets
          </span>
          <span className="hidden items-center gap-1 text-[0.6875rem] text-muted-foreground sm:inline-flex">
            <Calendar className="size-3" />
            {sprint.startDate} → {sprint.endDate}
          </span>
          <span className="ml-auto text-[0.6875rem] font-medium tabular-nums text-muted-foreground">
            {totalPoints} SP
          </span>
        </>
      )}
    </button>
  );
};

export const SprintSection = ({
  sprint,
  tickets,
  defaultOpen = true,

  columnVisibility,
  onColumnVisibilityChange,
  globalFilter,
}: {
  sprint: Sprint | null;
  tickets: Ticket[];
  defaultOpen?: boolean;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: (
    updater:
      | ColumnVisibilityState
      | ((prev: ColumnVisibilityState) => ColumnVisibilityState)
  ) => void;
  globalFilter: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [sorting, setSorting] = useState<SortingState>([]);
  const totalPoints = tickets.reduce((sum, t) => sum + t.storyPoints, 0);

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <SprintHeader
        sprint={sprint}
        ticketCount={tickets.length}
        totalPoints={totalPoints}
        isOpen={isOpen}
        onToggle={() => setIsOpen((o) => !o)}
      />
      {isOpen && (
        <div className="border-t">
          <TicketTable
            tickets={tickets}
            sorting={sorting}
            onSortingChange={setSorting}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={onColumnVisibilityChange}
            globalFilter={globalFilter}
          />
        </div>
      )}
    </div>
  );
};
