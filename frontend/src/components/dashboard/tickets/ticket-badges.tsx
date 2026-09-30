import {
  Bug,
  CheckSquare,
  BookOpen,
  ListTree,
  Lightbulb,
  AlertTriangle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Circle,
  Loader2,
  Eye,
  FlaskConical,
  CheckCircle2,
  Ban,
  MessageSquare,
  Paperclip,
} from 'lucide-react';
import { Badge } from '#/components/ui/badge.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx';
import { cn } from 'cn';
import type {
  TicketType,
  TicketPriority,
  TicketStatus,
  TicketPerson,
} from './types';

// ── Type config ──────────────────────────────────────────────────────
const typeConfig: Record<
  TicketType,
  { icon: typeof Bug; label: string; color: string }
> = {
  bug: {
    icon: Bug,
    label: 'Bug',
    color: 'text-rose-600 dark:text-rose-400',
  },
  task: {
    icon: CheckSquare,
    label: 'Task',
    color: 'text-blue-600 dark:text-blue-400',
  },
  story: {
    icon: BookOpen,
    label: 'Story',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  subtask: {
    icon: ListTree,
    label: 'Subtask',
    color: 'text-sky-600 dark:text-sky-400',
  },
  improvement: {
    icon: Lightbulb,
    label: 'Improvement',
    color: 'text-amber-600 dark:text-amber-400',
  },
};

const priorityConfig: Record<
  TicketPriority,
  { icon: typeof ArrowUp; label: string; color: string; bg: string }
> = {
  krytyczny: {
    icon: AlertTriangle,
    label: 'Krytyczny',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  wysoki: {
    icon: ArrowUp,
    label: 'Wysoki',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
  },
  średni: {
    icon: ArrowRight,
    label: 'Średni',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  niski: {
    icon: ArrowDown,
    label: 'Niski',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
};

const statusConfig: Record<
  TicketStatus,
  { icon: typeof Circle; label: string; color: string; bg: string }
> = {
  nowy: {
    icon: Circle,
    label: 'Nowy',
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/20',
  },
  w_toku: {
    icon: Loader2,
    label: 'W toku',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  review: {
    icon: Eye,
    label: 'Review',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
  testowanie: {
    icon: FlaskConical,
    label: 'Testowanie',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  zamknięty: {
    icon: CheckCircle2,
    label: 'Zamknięty',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  zablokowany: {
    icon: Ban,
    label: 'Zablokowany',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
};

// ── Render functions ─────────────────────────────────────────────────
export function TicketTypeIcon({
  type,
  className,
}: {
  type: TicketType;
  className?: string;
}) {
  const cfg = typeConfig[type];
  const Icon = cfg.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon className={cn('size-4 shrink-0', cfg.color, className)} />
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {cfg.label}
      </TooltipContent>
    </Tooltip>
  );
}

export const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const cfg = priorityConfig[priority];
  const Icon = cfg.icon;
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 px-1.5 py-0.5 text-[0.6875rem] font-medium',
        cfg.bg,
        cfg.color
      )}
    >
      <Icon className="size-3" />
      {cfg.label}
    </Badge>
  );
}

export const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 px-1.5 py-0.5 text-[0.6875rem] font-medium',
        cfg.bg,
        cfg.color
      )}
    >
      <Icon className={cn('size-3', status === 'w_toku' && 'animate-spin')} />
      {cfg.label}
    </Badge>
  );
}

export const AssigneeAvatar = ({
  person,
  size = 'sm',
}: {
  person: TicketPerson | null;
  size?: 'sm' | 'md';
}) => {
  if (!person) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar
            className={cn(
              'border border-dashed border-muted-foreground/30',
              size === 'sm' ? 'size-6' : 'size-7'
            )}
          >
            <AvatarFallback
              className={cn(
                'bg-muted text-muted-foreground',
                size === 'sm' ? 'text-[0.6rem]' : 'text-xs'
              )}
            >
              ?
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Nieprzypisany
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar
          className={cn(
            'border',
            size === 'sm' ? 'size-6' : 'size-7'
          )}
        >
          <AvatarImage src={`https://i.pravatar.cc/150?u=${person.email}`} alt={person.name} />
          <AvatarFallback
            className={cn(
              'bg-primary/10 text-primary font-medium',
              size === 'sm' ? 'text-[0.6rem]' : 'text-xs'
            )}
          >
            {person.avatarFallback}
          </AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent side="top" className="px-3 py-2">
        <p className="text-sm font-semibold leading-none mb-1 text-background">{person.name}</p>
        <p className="text-xs leading-none text-background/70">{person.role}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function StoryPointsBadge({ points }: { points: number }) {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded bg-muted text-[0.625rem] font-bold tabular-nums text-muted-foreground ring-1 ring-border">
      {points}
    </span>
  );
}

export function TicketMeta({
  comments,
  attachments,
}: {
  comments: number;
  attachments: number;
}) {
  return (
    <div className="flex items-center gap-2.5 text-muted-foreground">
      {comments > 0 && (
        <span className="inline-flex items-center gap-0.5 text-[0.6875rem]">
          <MessageSquare className="size-3" />
          {comments}
        </span>
      )}
      {attachments > 0 && (
        <span className="inline-flex items-center gap-0.5 text-[0.6875rem]">
          <Paperclip className="size-3" />
          {attachments}
        </span>
      )}
    </div>
  );
}

export { typeConfig, priorityConfig, statusConfig };
