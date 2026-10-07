import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Calendar, ChevronsLeft, ChevronsRight, GripVerticalIcon } from 'lucide-react';
import { cn } from 'cn';
import { Button } from '#/components/ui/button.tsx';
import { Card, CardContent, CardHeader } from '#/components/ui/card.tsx';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from '#/components/reui/kanban.tsx';
import type { MockData, Ticket, TicketStatus } from '#/types/tickets';
import {
  AssigneeAvatar,
  PriorityBadge,
  StoryPointsBadge,
  TicketMeta,
  TicketTypeIcon,
} from '../ticket-badges.tsx';
import mockData from '#/data/mock-tickets.json';

export type Task = Ticket;

export type ColumnId = 'backlog' | 'inProgress' | 'review' | 'testing' | 'done';

export const COLUMN_TITLES: Record<ColumnId, string> = {
  backlog: 'Backlog',
  inProgress: 'In Progress',
  review: 'Review',
  testing: 'Testing',
  done: 'Done',
};

const STATUS_TO_COLUMN: Record<TicketStatus, ColumnId> = {
  nowy: 'backlog',
  w_toku: 'inProgress',
  review: 'review',
  testowanie: 'testing',
  zamknięty: 'done',
  zablokowany: 'backlog',
};

function formatDueDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export interface TaskCardProps extends Omit<
  ComponentProps<typeof KanbanItem>,
  'value' | 'children'
> {
  task: Ticket;
  asHandle?: boolean;
  isOverlay?: boolean;
  isDone?: boolean;
}

export function TaskCard({ task, asHandle, isOverlay, isDone = false, ...props }: TaskCardProps) {
  const cardContent = (
    <Card
      className={cn(
        'group relative gap-0 py-0 rounded-lg border bg-card text-card-foreground shadow-xs transition-all hover:border-border hover:shadow-sm select-none',
        isDone && 'opacity-85 bg-card/75',
        isOverlay && 'rotate-1 scale-[1.02] shadow-lg border-primary/40',
      )}
    >
      <CardContent className="space-y-3 p-3.5">
        {/* Top row: Type Icon + Ticket Key on left, PriorityBadge on right */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <TicketTypeIcon type={task.type} />
            <span className="font-mono text-xs font-semibold text-muted-foreground whitespace-nowrap">
              {task.id}
            </span>
          </div>
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Title: struck through when done */}
        <p
          className={cn(
            'line-clamp-2 text-sm font-medium leading-snug',
            isDone ? 'line-through text-muted-foreground/75' : 'text-foreground',
          )}
        >
          {task.title}
        </p>

        {/* Bottom meta row: Story points, comments & attachments, due date, AssigneeAvatar */}
        <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <StoryPointsBadge points={task.storyPoints} />
            <TicketMeta comments={task.comments} attachments={task.attachments} />
            {task.dueDate && (
              <span className="hidden items-center gap-1 text-[0.6875rem] font-medium tabular-nums sm:inline-flex">
                <Calendar className="size-3 text-muted-foreground/70" />
                <time>{formatDueDate(task.dueDate)}</time>
              </span>
            )}
          </div>
          <AssigneeAvatar person={task.assignee} size="md" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <KanbanItem value={task.id} {...props}>
      {asHandle && !isOverlay ? <KanbanItemHandle>{cardContent}</KanbanItemHandle> : cardContent}
    </KanbanItem>
  );
}

export interface TaskColumnProps extends Omit<ComponentProps<typeof KanbanColumn>, 'children'> {
  value: ColumnId;
  tasks: Ticket[];
  isOverlay?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function TaskColumn({
  value,
  tasks,
  isOverlay,
  isCollapsed = false,
  onToggleCollapse,
  ...props
}: TaskColumnProps) {
  const columnTotalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const isDoneColumn = value === 'done';

  if (isCollapsed) {
    return (
      <KanbanColumn
        value={value}
        className="flex flex-col w-12 min-w-12 max-w-12 shrink-0 select-none max-h-[calc(100vh-210px)]"
        {...props}
      >
        <Card
          className="gap-0 py-0 border bg-muted/20 hover:bg-muted/40 shadow-2xs flex flex-col h-full max-h-[calc(100vh-210px)] items-center justify-between p-2 transition-colors"
          title={`Rozwiń lub przeciągnij kolumnę ${COLUMN_TITLES[value]}`}
        >
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse?.();
            }}
            className="size-7 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            title={`Rozwiń kolumnę ${COLUMN_TITLES[value]}`}
          >
            <ChevronsRight className="size-4" />
          </Button>

          <KanbanColumnHandle className="flex-1 flex items-center justify-center py-4 cursor-grab active:cursor-grabbing opacity-100 w-full">
            <span className="[writing-mode:vertical-lr] rotate-180 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap select-none">
              {COLUMN_TITLES[value]}
            </span>
          </KanbanColumnHandle>

          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums text-muted-foreground ring-1 ring-border shrink-0">
            {tasks.length}
          </span>
        </Card>
      </KanbanColumn>
    );
  }

  return (
    <KanbanColumn
      value={value}
      className="flex flex-col w-[300px] min-w-[300px] shrink-0 max-h-[calc(100vh-210px)]"
      {...props}
    >
      <Card className="gap-0 py-0 border bg-muted/20 shadow-2xs flex flex-col h-full max-h-[calc(100vh-210px)] overflow-hidden">
        {/* Fixed Header */}
        <CardHeader className="flex flex-row items-center justify-between px-3.5 py-3 shrink-0 border-b border-border/40 bg-muted/30">
          <KanbanColumnHandle className="flex items-center gap-2 cursor-grab active:cursor-grabbing flex-1 opacity-100 select-none">
            <span className="text-sm font-semibold text-foreground">{COLUMN_TITLES[value]}</span>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums text-muted-foreground ring-1 ring-border">
              {tasks.length}
            </span>
            {columnTotalPoints > 0 && (
              <span className="text-[0.6875rem] font-medium tabular-nums text-muted-foreground">
                {columnTotalPoints} SP
              </span>
            )}
          </KanbanColumnHandle>
          <div className="flex items-center gap-0.5">
            <KanbanColumnHandle
              render={(handleProps) => (
                <Button
                  {...handleProps}
                  size="icon-xs"
                  variant="ghost"
                  className={cn(
                    'size-6 text-muted-foreground/70 hover:text-foreground cursor-grab active:cursor-grabbing',
                    handleProps.className,
                  )}
                  title="Przeciągnij kolumnę"
                >
                  <GripVerticalIcon className="size-3.5" />
                </Button>
              )}
            />
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={onToggleCollapse}
              className="size-6 text-muted-foreground/70 hover:text-foreground"
              title={`Zwiń kolumnę ${COLUMN_TITLES[value]}`}
            >
              <ChevronsLeft className="size-3.5" />
            </Button>
          </div>
        </CardHeader>

        {/* Scrollable Content inside column */}
        <CardContent className="p-2.5 overflow-y-auto flex-1 min-h-0">
          <KanbanColumnContent value={value} className="flex flex-col gap-2.5 min-h-[140px] pb-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isDone={isDoneColumn || task.status === 'zamknięty'}
                asHandle={!isOverlay}
                isOverlay={isOverlay}
              />
            ))}
          </KanbanColumnContent>
        </CardContent>
      </Card>
    </KanbanColumn>
  );
}

export function ProjectKanbanBoard({
  tickets = (mockData as MockData).tickets,
}: {
  tickets?: Ticket[];
}) {
  const [collapsedColumns, setCollapsedColumns] = useState<Record<string, boolean>>({});

  const [columns, setColumns] = useState<Record<string, Ticket[]>>(() => {
    const initialColumns: Record<ColumnId, Ticket[]> = {
      backlog: [],
      inProgress: [],
      review: [],
      testing: [],
      done: [],
    };

    for (const ticket of tickets) {
      const columnId = STATUS_TO_COLUMN[ticket.status];
      initialColumns[columnId].push(ticket);
    }

    return initialColumns;
  });

  const toggleCollapse = (columnId: string) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return (
    <Kanban
      id="project-kanban"
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className="flex gap-4 overflow-x-auto pb-4 items-start min-w-full">
        {(Object.keys(columns) as ColumnId[]).map((columnId) => (
          <TaskColumn
            key={columnId}
            value={columnId}
            tasks={columns[columnId] ?? []}
            isCollapsed={!!collapsedColumns[columnId]}
            onToggleCollapse={() => toggleCollapse(columnId)}
          />
        ))}
      </KanbanBoard>
      <KanbanOverlay>
        {({ value, variant }) => {
          if (variant === 'column') {
            const colId = value as ColumnId;
            return (
              <div className="w-[300px] pointer-events-none opacity-90 shadow-2xl rotate-1">
                <TaskColumn value={colId} tasks={columns[colId] ?? []} isOverlay />
              </div>
            );
          }
          const task = Object.values(columns)
            .flat()
            .find((t) => t.id === value);
          if (!task) return null;
          return (
            <div className="w-[280px] pointer-events-none opacity-90 shadow-xl rotate-1">
              <TaskCard task={task} isOverlay />
            </div>
          );
        }}
      </KanbanOverlay>
    </Kanban>
  );
}

export const Pattern = ProjectKanbanBoard;
export const KanbanBoardView = ProjectKanbanBoard;
