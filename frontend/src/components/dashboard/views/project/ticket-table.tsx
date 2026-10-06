'use client';

import { useState } from 'react';
import { flexRender, useTable } from '@tanstack/react-table';
import type { ColumnVisibilityState, RowSelectionState, SortingState } from '@tanstack/react-table';
import type { Ticket } from '../../tickets/types';
import { ticketColumns, ticketTableFeatures } from './table-ticket-columns';
import { Button } from '#/components/ui/button.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx';

export const TicketTable = ({
  tickets,
  sorting,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
  globalFilter,
}: {
  tickets: Ticket[];
  sorting: SortingState;
  onSortingChange: (updater: SortingState | ((previous: SortingState) => SortingState)) => void;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: (
    updater: ColumnVisibilityState | ((previous: ColumnVisibilityState) => ColumnVisibilityState),
  ) => void;
  globalFilter: string;
}) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useTable({
    features: ticketTableFeatures,
    data: tickets,
    columns: ticketColumns,
    state: { sorting, columnVisibility, rowSelection, globalFilter },
    onSortingChange,
    onColumnVisibilityChange,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
        No tickets matching filters.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-b-0 bg-muted/30 hover:bg-transparent">
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
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? ''}
                  </Button>
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
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
            onClick={() => row.toggleSelected()}
            className="group transition-colors hover:bg-muted/40"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="px-2 cursor-pointer py-1.5">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
