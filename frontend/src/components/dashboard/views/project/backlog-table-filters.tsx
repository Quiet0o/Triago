'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Filter, Plus, Search, SlidersHorizontal } from 'lucide-react';
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

export const BacklogTableFilters = ({
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
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: Dispatch<SetStateAction<ColumnVisibilityState>>;
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Szukaj zgłoszeń..."
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
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="nowy">Nowy</SelectItem>
            <SelectItem value="w_toku">W toku</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="testowanie">Testowanie</SelectItem>
            <SelectItem value="zamknięty">Zamknięty</SelectItem>
            <SelectItem value="zablokowany">Zablokowany</SelectItem>
          </SelectContent>
        </Select>

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

        <AvatarGroup>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/maxleiter.png"
              alt="@maxleiter"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </div>

      <div className="flex items-center gap-2">
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
            ].map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="text-xs"
                checked={columnVisibility[column.id] !== false}
                onCheckedChange={(checked) =>
                  onColumnVisibilityChange((previous) => ({
                    ...previous,
                    [column.id]: !!checked,
                  }))
                }
              >
                {column.label}
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
