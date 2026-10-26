'use client';

import { Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Share2,
  Zap,
} from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';
import { Badge } from '#/components/ui/badge.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx';
import type { Ticket } from '#/types/tickets';

export interface TicketDetailHeaderProps {
  ticket: Ticket;
  sprintName?: string;
  copiedKey: boolean;
  copiedLink: boolean;
  onCopyKey: () => void;
  onCopyLink: () => void;
}

export function TicketDetailHeader({
  ticket,
  sprintName = 'Sprint 4',
  copiedKey,
  copiedLink,
  onCopyKey,
  onCopyLink,
}: TicketDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-4 border-b pb-4 flex-wrap">
      <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/project/backlog' })}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span className="hidden sm:inline">Backlog</span>
        </Button>

        <span className="text-muted-foreground/50">/</span>

        {/* Epic badge & link if ticket is assigned to an epic */}
        {ticket.epicId && (
          <>
            <Link
              to="/project/tickets/$ticketId"
              params={{ ticketId: ticket.epicId }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-medium transition-colors cursor-pointer group"
              title="Przejdź do Epika"
            >
              <Zap className="size-3 text-purple-600 dark:text-purple-400 fill-purple-500/30 shrink-0" />
              <span className="font-mono font-semibold">{ticket.epicId}</span>
              {ticket.epicTitle && (
                <span className="truncate max-w-[140px] text-muted-foreground group-hover:text-foreground transition-colors">
                  {ticket.epicTitle}
                </span>
              )}
              <ExternalLink className="size-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
            <span className="text-muted-foreground/50">/</span>
          </>
        )}

        <span className="font-mono text-xs font-semibold text-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/60">
          {ticket.id}
        </span>

        <Badge variant="outline" className="text-xs font-normal">
          {sprintName}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyKey}
              className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
            >
              {copiedKey ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>{copiedKey ? 'Skopiowano ID' : 'Kopiuj ID'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Skopiuj identyfikator zadania</TooltipContent>
        </Tooltip>

        <Button
          variant="outline"
          size="sm"
          onClick={onCopyLink}
          className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
        >
          {copiedLink ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Share2 className="size-3.5" />
          )}
          <span>{copiedLink ? 'Skopiowano link' : 'Udostępnij'}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 cursor-pointer">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Zmień sprint</DropdownMenuItem>
            <DropdownMenuItem>Eksportuj do PDF</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Usuń zadanie</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
