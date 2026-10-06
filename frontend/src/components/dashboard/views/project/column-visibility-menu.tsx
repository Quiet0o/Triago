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
  { id: 'id', label: 'Key' },
  { id: 'status', label: 'Status' },
  { id: 'priority', label: 'Priority' },
  { id: 'assignee', label: 'Assignee' },
  { id: 'storyPoints', label: 'Story Points' },
  { id: 'labels', label: 'Labels' },
  { id: 'meta', label: 'Activity' },
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
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs">
          Visible columns
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
};
