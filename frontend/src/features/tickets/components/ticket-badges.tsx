import {
  Ban,
  BookOpen,
  Bug,
  CheckCircle2,
  CheckSquare,
  ChevronsUp,
  ChevronUp,
  Circle,
  Eye,
  FlaskConical,
  Lightbulb,
  ListTree,
  Loader2,
  MessageSquare,
  Minus,
  Paperclip,
  Zap,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Badge } from '#/components/ui/badge.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip.tsx';
import { cn } from '#/lib/utils';
import type { TicketPerson, TicketPriority, TicketStatus, TicketType } from '#/types/tickets';
import { CriticalIcon } from '#/components/ui/icons/critical';
import { getUserAvatarUrl } from '#/lib/avatar';

// ── Type config ──────────────────────────────────────────────────────
const typeConfig: Record<TicketType, { icon: typeof Bug; label: string; color: string }> = {
  epic: {
    icon: Zap,
    label: 'Epic',
    color: 'text-purple-600 dark:text-purple-400',
  },
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
  {
    icon: typeof ChevronsUp | typeof ChevronUp | typeof Minus | typeof CriticalIcon;
    label: string;
    color: string;
    bg: string;
  }
> = {
  krytyczny: {
    icon: CriticalIcon,
    label: 'Critical',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  wysoki: {
    icon: ChevronsUp,
    label: 'High',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
  },
  średni: {
    icon: ChevronUp,
    label: 'Medium',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  niski: {
    icon: Minus,
    label: 'Low',
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
    label: 'New',
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/20',
  },
  w_toku: {
    icon: Loader2,
    label: 'In Progress',
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
    label: 'Testing',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  zamknięty: {
    icon: CheckCircle2,
    label: 'Closed',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  zablokowany: {
    icon: Ban,
    label: 'Blocked',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
};

// ── Render functions ─────────────────────────────────────────────────
export function TicketTypeIcon({ type, className }: { type: TicketType; className?: string }) {
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
      className={cn('gap-1 px-1.5 py-0.5 text-[0.6875rem] font-medium', cfg.bg, cfg.color)}
    >
      <Icon className="size-3" />
      {cfg.label}
    </Badge>
  );
};

export const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <Badge
      variant="outline"
      className={cn('gap-1 px-1.5 py-0.5 text-[0.6875rem] font-medium', cfg.bg, cfg.color)}
    >
      <Icon className={cn('size-3', status === 'w_toku' && 'animate-spin')} />
      {cfg.label}
    </Badge>
  );
};

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
              size === 'sm' ? 'size-6' : 'size-7',
            )}
          >
            <AvatarFallback
              className={cn(
                'bg-muted text-muted-foreground',
                size === 'sm' ? 'text-[0.6rem]' : 'text-xs',
              )}
            >
              ?
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Unassigned
        </TooltipContent>
      </Tooltip>
    );
  }

  const avatarUrl = getUserAvatarUrl(person);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to="/project/profile/$userId"
          params={{ userId: person.email }}
          onClick={(e) => e.stopPropagation()}
          className="inline-block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:opacity-85 transition-opacity cursor-pointer shrink-0"
        >
          <Avatar className={cn('border', size === 'sm' ? 'size-6' : 'size-7')}>
            {avatarUrl && <AvatarImage src={avatarUrl} alt={person.name} />}
            <AvatarFallback
              className={cn(
                'bg-primary/10 text-primary font-medium',
                size === 'sm' ? 'text-[0.6rem]' : 'text-xs',
              )}
            >
              {person.avatarFallback}
            </AvatarFallback>
          </Avatar>
        </Link>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={6}
        className="p-3 text-xs bg-popover text-popover-foreground border border-border/80 shadow-xl rounded-xl min-w-[150px]"
      >
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
          <Avatar className="size-6 shrink-0">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={person.name} />}
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
              {person.avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-foreground truncate leading-tight">
              {person.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{person.role}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">
          <span>Zobacz profil</span>
          <span className="text-xs">↗</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export function StoryPointsBadge({ points }: { points: number }) {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded bg-muted text-[0.625rem] font-bold tabular-nums text-muted-foreground ring-1 ring-border">
      {points}
    </span>
  );
}

export function TicketMeta({ comments, attachments }: { comments: number; attachments: number }) {
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

export function EpicBadge({
  epicId,
  epicTitle,
}: {
  epicId?: string | null;
  epicTitle?: string | null;
}) {
  if (!epicId) return null;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 max-w-[130px] truncate">
      <Zap className="size-2.5 shrink-0" />
      <span className="truncate">{epicTitle || epicId}</span>
    </span>
  );
}

export { typeConfig, priorityConfig, statusConfig };
