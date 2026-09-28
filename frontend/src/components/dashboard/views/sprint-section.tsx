'use client';

import * as React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Zap,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  useTable,
  flexRender,
  type SortingState,
  type ColumnVisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';
import type { Ticket, Sprint } from '../tickets/types';
import {
  ticketColumns,
  ticketTableFeatures,
} from '../tickets/ticket-columns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx';
import { Button } from '#/components/ui/button.tsx';

// ── Sprint section header ────────────────────────────────────────────
function SprintHeader({
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
}) {
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
              AKTYWNY
            </span>
          )}
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums text-muted-foreground ring-1 ring-border">
            {ticketCount} zgłoszeń
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
}

// ── Sprint ticket table ──────────────────────────────────────────────
function SprintTicketTable({
  tickets,
  sorting,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
  globalFilter,
}: {
  tickets: Ticket[];
  sorting: SortingState;
  onSortingChange: (updater: SortingState | ((prev: SortingState) => SortingState)) => void;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: (updater: ColumnVisibilityState | ((prev: ColumnVisibilityState) => ColumnVisibilityState)) => void;
  globalFilter: string;
}) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useTable({
    features: ticketTableFeatures,
    data: tickets,
    columns: ticketColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange,
    onColumnVisibilityChange,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
        Brak zgłoszeń pasujących do filtrów.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        {headerGroups.map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="hover:bg-transparent border-b-0 bg-muted/30"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="h-8 px-2 text-[0.6875rem] font-medium text-muted-foreground"
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <Button
                    variant="ghost"
                    className="-ml-2 h-7 px-2 text-[0.6875rem] font-medium text-muted-foreground hover:text-foreground"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted() as string] ?? ''}
                  </Button>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
            className="group transition-colors hover:bg-muted/40 cursor-pointer"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="px-2 py-1.5">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ── Sprint section (collapsible) ─────────────────────────────────────
export function SprintSection({
  sprint,
  tickets,
  defaultOpen = true,
  sorting,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
  globalFilter,
}: {
  sprint: Sprint | null;
  tickets: Ticket[];
  defaultOpen?: boolean;
  sorting: SortingState;
  onSortingChange: (updater: SortingState | ((prev: SortingState) => SortingState)) => void;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: (updater: ColumnVisibilityState | ((prev: ColumnVisibilityState) => ColumnVisibilityState)) => void;
  globalFilter: string;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
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
          <SprintTicketTable
            tickets={tickets}
            sorting={sorting}
            onSortingChange={onSortingChange}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={onColumnVisibilityChange}
            globalFilter={globalFilter}
          />
        </div>
      )}
    </div>
  );
}
