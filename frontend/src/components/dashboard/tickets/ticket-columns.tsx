import {
  tableFeatures,
  rowSortingFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  createColumnHelper,
  createCoreRowModel,
  createSortedRowModel,
  createFilteredRowModel,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import type { Ticket } from './types';
import {
  TicketTypeIcon,
  PriorityBadge,
  StatusBadge,
  AssigneeAvatar,
  StoryPointsBadge,
  TicketMeta,
} from './ticket-badges';
import { Checkbox } from '#/components/ui/checkbox.tsx';
import { Badge } from '#/components/ui/badge.tsx';
import { Ellipsis } from 'lucide-react';

// ── Features used by the ticket table ────────────────────────────────
export const ticketTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  coreRowModel: createCoreRowModel(),
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
});

export type TicketTableFeatures = typeof ticketTableFeatures;

const col = createColumnHelper<TicketTableFeatures, Ticket>();
const polishNameCollator = new Intl.Collator('pl-PL', {
  sensitivity: 'base',
});

export const ticketColumns: ColumnDef<TicketTableFeatures, Ticket, any>[] = [
  col.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Zaznacz wszystko"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(event) => event.stopPropagation()}
        aria-label={`Zaznacz ${row.original.id}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),

  col.accessor('type', {
    header: '',
    cell: (info) => <TicketTypeIcon type={info.getValue()} />,
    enableSorting: false,
  }),

  col.accessor('id', {
    header: 'Numer',
    cell: (info) => (
      <span className="font-mono text-xs font-semibold text-muted-foreground whitespace-nowrap">
        {info.getValue()}
      </span>
    ),
  }),

  col.accessor('title', {
    header: 'Tytuł',
    cell: (info) => (
      <span className="text-sm font-medium text-foreground line-clamp-1">
        {info.getValue()}
      </span>
    ),
    enableHiding: false,
  }),

  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),

  col.accessor('priority', {
    header: 'Priorytet',
    cell: (info) => <PriorityBadge priority={info.getValue()} />,
  }),

  col.accessor('assignee', {
    header: 'Osoba',
    cell: (info) => <AssigneeAvatar size="md" person={info.getValue()} />,
    enableSorting: true,
    sortFn: (rowA, rowB) => {
      const nameA = rowA.original.assignee?.name ?? '';
      const nameB = rowB.original.assignee?.name ?? '';

      if (!nameA) return nameB ? 1 : 0;
      if (!nameB) return -1;

      return polishNameCollator.compare(nameA, nameB);
    },
  }),

  col.accessor('storyPoints', {
    header: 'SP',
    cell: (info) => <StoryPointsBadge points={info.getValue()} />,
  }),

  col.accessor('labels', {
    header: 'Etykiety',
    cell: (info) => {
      const labels = info.getValue();
      if (!labels.length) return null;
      return (
        <div className="flex items-center gap-1.5 overflow-hidden">
          {labels.slice(0, 2).map((label: string) => (
            <Badge
              key={label}
              variant="secondary"
              className="px-2 py-0.5 text-[0.6875rem] font-medium text-foreground/80 bg-muted border-border"
            >
              {label}
            </Badge>
          ))}
          {labels.length > 2 && (
            <span className="text-[0.6875rem] font-medium text-muted-foreground">
              +{labels.length - 2}
            </span>
          )}
        </div>
      );
    },
    enableSorting: false,
  }),

  col.display({
    id: 'meta',
    header: '',
    cell: ({ row }) => (
      <TicketMeta
        comments={row.original.comments}
        attachments={row.original.attachments}
      />
    ),
    enableSorting: false,
  }),
  col.display({
    id: 'more actions',
    header: '',
    cell: ({ row }) => (
      <Ellipsis className="size-4 opacity-0 transition-opacity group-hover:opacity-100 group-data-[state=selected]:opacity-100" />
    ),
    enableSorting: false,
  }),
];
