'use client';

import * as React from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Filter,
} from 'lucide-react';
import type { SortingState, ColumnVisibilityState } from '@tanstack/react-table';
import type { Ticket, Sprint } from '../tickets/types';
import { SprintSection } from './sprint-section';
import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx';

// ── Backlog toolbar ──────────────────────────────────────────────────
function BacklogToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  columnVisibility,
  onColumnVisibilityChange,
}: {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (val: string) => void;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: React.Dispatch<
    React.SetStateAction<ColumnVisibilityState>
  >;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Szukaj zgłoszeń..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-8 text-xs bg-background"
          />
        </div>

        {/* Status filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <Filter className="mr-1.5 size-3" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="nowy">Nowy</SelectItem>
            <SelectItem value="w_toku">W toku</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="testowanie">Testowanie</SelectItem>
            <SelectItem value="zamknięty">Zamknięty</SelectItem>
            <SelectItem value="zablokowany">Zablokowany</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority filter */}
        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <Filter className="mr-1.5 size-3" />
            <SelectValue placeholder="Priorytet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="krytyczny">Krytyczny</SelectItem>
            <SelectItem value="wysoki">Wysoki</SelectItem>
            <SelectItem value="średni">Średni</SelectItem>
            <SelectItem value="niski">Niski</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <SlidersHorizontal className="size-3.5" />
              Kolumny
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="text-xs">
              Widoczne kolumny
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { id: 'id', label: 'Klucz' },
              { id: 'status', label: 'Status' },
              { id: 'priority', label: 'Priorytet' },
              { id: 'assignee', label: 'Osoba' },
              { id: 'storyPoints', label: 'Story Points' },
              { id: 'labels', label: 'Etykiety' },
              { id: 'meta', label: 'Aktywność' },
            ].map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                className="text-xs"
                checked={columnVisibility[col.id] !== false}
                onCheckedChange={(checked) =>
                  onColumnVisibilityChange((prev: ColumnVisibilityState) => ({
                    ...prev,
                    [col.id]: !!checked,
                  }))
                }
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Plus className="size-3.5" />
          Nowe zgłoszenie
        </Button>
      </div>
    </div>
  );
}

// ── Backlog view (main) ──────────────────────────────────────────────
export function BacklogView({
  tickets,
  sprints,
  externalSearch = '',
}: {
  tickets: Ticket[];
  sprints: Sprint[];
  externalSearch?: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});
  const [localSearch, setLocalSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [priorityFilter, setPriorityFilter] = React.useState('all');

  const globalFilter = externalSearch || localSearch;

  // Apply client-side filters
  const filteredTickets = React.useMemo(() => {
    let result = tickets;

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    return result;
  }, [tickets, statusFilter, priorityFilter]);

  // Group by sprint
  const activeSprint = sprints.find((s) => s.status === 'active') ?? null;
  const completedSprints = sprints.filter((s) => s.status === 'completed');
  const backlogTickets = filteredTickets.filter((t) => t.sprint === null);
  const activeSprintTickets = activeSprint
    ? filteredTickets.filter((t) => t.sprint === activeSprint.id)
    : [];
  const completedSprintGroups = completedSprints.map((sprint) => ({
    sprint,
    tickets: filteredTickets.filter((t) => t.sprint === sprint.id),
  }));

  return (
    <div className="flex flex-col gap-4">
      <BacklogToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />

      {/* Active sprint */}
      {activeSprint && activeSprintTickets.length > 0 && (
        <SprintSection
          sprint={activeSprint}
          tickets={activeSprintTickets}
          defaultOpen={true}
          sorting={sorting}
          onSortingChange={setSorting}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          globalFilter={globalFilter}
        />
      )}

      {/* Completed sprints */}
      {completedSprintGroups.map(
        ({ sprint, tickets: sprintTickets }) =>
          sprintTickets.length > 0 && (
            <SprintSection
              key={sprint.id}
              sprint={sprint}
              tickets={sprintTickets}
              defaultOpen={false}
              sorting={sorting}
              onSortingChange={setSorting}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
              globalFilter={globalFilter}
            />
          )
      )}

      {/* Backlog (no sprint) */}
      {backlogTickets.length > 0 && (
        <SprintSection
          sprint={null}
          tickets={backlogTickets}
          defaultOpen={true}
          sorting={sorting}
          onSortingChange={setSorting}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          globalFilter={globalFilter}
        />
      )}

      {/* Summary bar */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Łącznie: {filteredTickets.length} zgłoszeń ·{' '}
          {filteredTickets.reduce((s, t) => s + t.storyPoints, 0)} story points
        </span>
        <span>
          {filteredTickets.filter((t) => t.status === 'zamknięty').length} zamkniętych ·{' '}
          {filteredTickets.filter((t) => t.status === 'w_toku').length} w toku ·{' '}
          {filteredTickets.filter((t) => t.status === 'zablokowany').length} zablokowanych
        </span>
      </div>
    </div>
  );
}
