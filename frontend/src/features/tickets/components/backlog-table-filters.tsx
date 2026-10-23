'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import type { ColumnVisibilityState } from '@tanstack/react-table';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '#/components/ui/avatar';
import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx';
import { ColumnVisibilityMenu } from './column-visibility-menu';
import { useCreateTicketModal } from '#/features/tickets/context/create-ticket-context';

export interface BacklogTableFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: Dispatch<SetStateAction<ColumnVisibilityState>>;
}

export const BacklogTableFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  columnVisibility,
  onColumnVisibilityChange,
}: BacklogTableFiltersProps) => {
  const { openCreateModal } = useCreateTicketModal();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-8 bg-background pl-8 text-xs"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <Filter className="mr-1.5 size-3" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="nowy">New</SelectItem>
            <SelectItem value="w_toku">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="testowanie">Testing</SelectItem>
            <SelectItem value="zamknięty">Closed</SelectItem>
            <SelectItem value="zablokowany">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <Filter className="mr-1.5 size-3" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="krytyczny">Critical</SelectItem>
            <SelectItem value="wysoki">High</SelectItem>
            <SelectItem value="średni">Medium</SelectItem>
            <SelectItem value="niski">Low</SelectItem>
          </SelectContent>
        </Select>

        <AvatarGroup>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </div>

      <div className="flex items-center gap-2">
        <ColumnVisibilityMenu
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
        />
        <Button
          size="sm"
          onClick={() => openCreateModal()}
          className="h-8 gap-1.5 text-xs cursor-pointer"
        >
          <Plus className="size-3.5" />
          New ticket
        </Button>
      </div>
    </div>
  );
};
