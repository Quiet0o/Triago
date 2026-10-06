'use client';

import { useMemo, useState } from 'react';
import type { ColumnVisibilityState } from '@tanstack/react-table';
import type { Sprint, Ticket } from '../../tickets/types';
import { BacklogTableFilters } from './backlog-table-filters';
import { SprintSection } from './sprint-section';

export const BacklogView = ({
  tickets,
  sprints,
  externalSearch = '',
}: {
  tickets: Ticket[];
  sprints: Sprint[];
  externalSearch?: string;
}) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const globalFilter = externalSearch || localSearch;

  // Apply client-side filters
  const filteredTickets = useMemo(() => {
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
      <BacklogTableFilters
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
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
              globalFilter={globalFilter}
            />
          ),
      )}

      {/* Backlog (no sprint) */}
      {backlogTickets.length > 0 && (
        <SprintSection
          sprint={null}
          tickets={backlogTickets}
          defaultOpen={true}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          globalFilter={globalFilter}
        />
      )}

      {/* Summary bar */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Total: {filteredTickets.length} tickets ·{' '}
          {filteredTickets.reduce((s, t) => s + t.storyPoints, 0)} story points
        </span>
        <span>
          {filteredTickets.filter((t) => t.status === 'zamknięty').length} done ·{' '}
          {filteredTickets.filter((t) => t.status === 'w_toku').length} in progress ·{' '}
          {filteredTickets.filter((t) => t.status === 'zablokowany').length} blocked
        </span>
      </div>
    </div>
  );
};
