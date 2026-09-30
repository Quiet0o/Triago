'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { ColumnVisibilityState } from '@tanstack/react-table';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx';

const columns = [
  { id: 'id', label: 'Klucz' },
  { id: 'status', label: 'Status' },
  { id: 'priority', label: 'Priorytet' },
  { id: 'assignee', label: 'Osoba' },
  { id: 'storyPoints', label: 'Story Points' },
  { id: 'labels', label: 'Etykiety' },
  { id: 'meta', label: 'Aktywność' },
] as const;

export const ColumnVisibilityMenu = ({
  columnVisibility,
  onColumnVisibilityChange,
}: {
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: Dispatch<SetStateAction<ColumnVisibilityState>>;
}) => {
  return (
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
        {columns.map((column) => (
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
  );
}