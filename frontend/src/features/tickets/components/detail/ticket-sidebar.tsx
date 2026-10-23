'use client';

import * as React from 'react';
import { Calendar, CheckSquare, Clock, Tag, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '#/components/ui/avatar.tsx';
import { Badge } from '#/components/ui/badge.tsx';
import { Input } from '#/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx';
import { cn } from '#/lib/utils';
import type {
  Sprint,
  Ticket,
  TicketPerson,
  TicketPriority,
  TicketStatus,
  TicketType,
} from '#/types/tickets';
import {
  PriorityBadge,
  StatusBadge,
  StoryPointsBadge,
  TicketTypeIcon,
} from '../ticket-badges';

export interface TicketSidebarProps {
  ticket: Ticket;
  teamMembers: TicketPerson[];
  sprints: Sprint[];
  onTypeChange: (type: TicketType) => void;
  onStatusChange: (status: TicketStatus) => void;
  onPriorityChange: (priority: TicketPriority) => void;
  onAssigneeChange: (assignee: TicketPerson | null) => void;
  onSprintChange: (sprintId: string | null) => void;
  onStoryPointsChange: (points: number) => void;
  onDueDateChange: (dueDate: string) => void;
}

export function TicketSidebar({
  ticket,
  teamMembers,
  sprints,
  onTypeChange,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onSprintChange,
  onStoryPointsChange,
  onDueDateChange,
}: TicketSidebarProps) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-5 shadow-xs sticky top-20">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Właściwości zadania
      </h3>

      {/* Typ zadania - RIGHT AT THE TOP */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Typ zadania</label>
        <Select
          value={ticket.type}
          onValueChange={(val) => onTypeChange(val as TicketType)}
        >
          <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="task">
              <div className="flex items-center gap-2">
                <CheckSquare className="size-3.5 text-blue-500" />
                <span>Zadanie (Task)</span>
              </div>
            </SelectItem>
            <SelectItem value="bug">
              <div className="flex items-center gap-2">
                <TicketTypeIcon type="bug" />
                <span>Błąd (Bug)</span>
              </div>
            </SelectItem>
            <SelectItem value="story">
              <div className="flex items-center gap-2">
                <TicketTypeIcon type="story" />
                <span>Historyjka (Story)</span>
              </div>
            </SelectItem>
            <SelectItem value="improvement">
              <div className="flex items-center gap-2">
                <TicketTypeIcon type="improvement" />
                <span>Usprawnienie (Improvement)</span>
              </div>
            </SelectItem>
            <SelectItem value="subtask">
              <div className="flex items-center gap-2">
                <TicketTypeIcon type="subtask" />
                <span>Podzadanie (Subtask)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Status</label>
        <Select
          value={ticket.status}
          onValueChange={(val) => onStatusChange(val as TicketStatus)}
        >
          <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nowy">
              <StatusBadge status="nowy" />
            </SelectItem>
            <SelectItem value="w_toku">
              <StatusBadge status="w_toku" />
            </SelectItem>
            <SelectItem value="review">
              <StatusBadge status="review" />
            </SelectItem>
            <SelectItem value="testowanie">
              <StatusBadge status="testowanie" />
            </SelectItem>
            <SelectItem value="zamknięty">
              <StatusBadge status="zamknięty" />
            </SelectItem>
            <SelectItem value="zablokowany">
              <StatusBadge status="zablokowany" />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Priorytet</label>
        <Select
          value={ticket.priority}
          onValueChange={(val) => onPriorityChange(val as TicketPriority)}
        >
          <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="krytyczny">
              <PriorityBadge priority="krytyczny" />
            </SelectItem>
            <SelectItem value="wysoki">
              <PriorityBadge priority="wysoki" />
            </SelectItem>
            <SelectItem value="średni">
              <PriorityBadge priority="średni" />
            </SelectItem>
            <SelectItem value="niski">
              <PriorityBadge priority="niski" />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignee */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Przypisana osoba</label>
        <Select
          value={ticket.assignee?.email ?? 'unassigned'}
          onValueChange={(val) => {
            const found = teamMembers.find((m) => m.email === val) ?? null;
            onAssigneeChange(found);
          }}
        >
          <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="size-3.5" />
                <span>Nieprzypisane</span>
              </div>
            </SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.email} value={member.email}>
                <div className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarFallback className="text-[10px]">
                      {member.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-xs">{member.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reporter */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Zgłaszający</label>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 text-xs">
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px]">
              {ticket.reporter.avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{ticket.reporter.name}</p>
            <p className="text-[10px] text-muted-foreground">{ticket.reporter.role}</p>
          </div>
        </div>
      </div>

      {/* Sprint */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Sprint</label>
        <Select
          value={ticket.sprint ?? 'none'}
          onValueChange={(val) => onSprintChange(val === 'none' ? null : val)}
        >
          <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} {s.status === 'active' ? '(Aktywny)' : ''}
              </SelectItem>
            ))}
            <SelectItem value="none">Backlog (Bez sprintu)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Story Points */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">Story Points</label>
          <StoryPointsBadge points={ticket.storyPoints} />
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {[1, 2, 3, 5, 8, 13].map((pts) => (
            <button
              key={pts}
              type="button"
              onClick={() => onStoryPointsChange(pts)}
              className={cn(
                'h-7 rounded border text-xs font-medium transition-all cursor-pointer flex items-center justify-center',
                ticket.storyPoints === pts
                  ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'border-border bg-background hover:bg-muted text-muted-foreground',
              )}
            >
              {pts}
            </button>
          ))}
        </div>
      </div>

      {/* Due date */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Calendar className="size-3" />
          Termin ukończenia
        </label>
        <Input
          type="date"
          value={ticket.dueDate ?? ''}
          onChange={(e) => onDueDateChange(e.target.value)}
          className="h-8 text-xs bg-background"
        />
      </div>

      {/* Time Tracking */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" />
            Szacowany czas
          </label>
          <span className="font-mono font-medium text-foreground">
            {ticket.timeSpent ?? '0h'} / {ticket.timeEstimate}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[75%]" />
        </div>
      </div>

      {/* Labels */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Tag className="size-3" />
          Etykiety
        </label>
        <div className="flex flex-wrap gap-1">
          {ticket.labels.map((lbl) => (
            <Badge
              key={lbl}
              variant="secondary"
              className="py-0.5 px-2 text-[11px] bg-primary/10 text-primary border-primary/20"
            >
              {lbl}
            </Badge>
          ))}
        </div>
      </div>

      {/* System metadata */}
      <div className="pt-3 border-t text-[11px] text-muted-foreground space-y-1">
        <p>
          Utworzono:{' '}
          <span className="text-foreground">
            {new Date(ticket.createdAt).toLocaleDateString('pl-PL')}
          </span>
        </p>
        <p>
          Zaktualizowano:{' '}
          <span className="text-foreground">
            {new Date(ticket.updatedAt).toLocaleDateString('pl-PL')}
          </span>
        </p>
      </div>
    </div>
  );
}
