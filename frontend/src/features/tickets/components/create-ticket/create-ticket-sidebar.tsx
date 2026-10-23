'use client';

import * as React from 'react';
import { Calendar, UserCheck } from 'lucide-react';
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
import type {
  TicketPerson,
  TicketPriority,
  TicketStatus,
} from '#/types/tickets';
import { AssigneeAvatar, PriorityBadge, StatusBadge } from '../ticket-badges';

export const STORY_POINTS_OPTIONS = [1, 2, 3, 5, 8, 13];
export const PRESET_LABELS = ['frontend', 'backend', 'api', 'ui/ux', 'bug', 'auth', 'database', 'security'];

export interface CreateTicketSidebarProps {
  status: TicketStatus;
  onStatusChange: (status: TicketStatus) => void;
  priority: TicketPriority;
  onPriorityChange: (priority: TicketPriority) => void;
  assigneeEmail: string;
  onAssigneeChange: (email: string) => void;
  onAssignToMe: () => void;
  sprint: string;
  onSprintChange: (sprint: string) => void;
  storyPoints: number | '';
  onStoryPointsChange: (points: number | '') => void;
  dueDate: string;
  onDueDateChange: (date: string) => void;
  selectedLabels: string[];
  onToggleLabel: (label: string) => void;
  onAddCustomLabel: (label: string) => void;
  teamMembers: TicketPerson[];
  reporter: TicketPerson;
}

export function CreateTicketSidebar({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  assigneeEmail,
  onAssigneeChange,
  onAssignToMe,
  sprint,
  onSprintChange,
  storyPoints,
  onStoryPointsChange,
  dueDate,
  onDueDateChange,
  selectedLabels,
  onToggleLabel,
  onAddCustomLabel,
  teamMembers,
  reporter,
}: CreateTicketSidebarProps) {
  const [customLabelInput, setCustomLabelInput] = React.useState('');

  const handleCustomLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customLabelInput.trim()) {
      e.preventDefault();
      onAddCustomLabel(customLabelInput.trim().toLowerCase());
      setCustomLabelInput('');
    }
  };

  const selectedAssignee = teamMembers.find((m) => m.email === assigneeEmail) ?? null;

  return (
    <div className="bg-muted/10 border-t md:border-t-0 md:border-l p-6 space-y-5 overflow-y-auto overflow-x-hidden">
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Właściwości zadania
        </h4>

        <div className="space-y-4">
          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Status początkowy</label>
            <Select value={status} onValueChange={(val) => onStatusChange(val as TicketStatus)}>
              <SelectTrigger className="w-full bg-background h-8.5 text-xs cursor-pointer">
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
            <label className="text-xs font-medium text-foreground">Priorytet</label>
            <Select
              value={priority}
              onValueChange={(val) => onPriorityChange(val as TicketPriority)}
            >
              <SelectTrigger className="w-full bg-background h-8.5 text-xs cursor-pointer">
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Osoba przypisana</label>
              <button
                type="button"
                onClick={onAssignToMe}
                className="text-[10px] text-primary hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
              >
                <UserCheck className="size-3" />
                Przypisz do mnie
              </button>
            </div>
            <Select value={assigneeEmail} onValueChange={onAssigneeChange}>
              <SelectTrigger className="w-full bg-background h-8.5 text-xs cursor-pointer">
                <div className="flex items-center gap-2 truncate">
                  <AssigneeAvatar size="sm" person={selectedAssignee} />
                  <span className="truncate">
                    {selectedAssignee ? selectedAssignee.name : 'Nieprzypisane'}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Nieprzypisane</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.email} value={member.email}>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5">
                        <AvatarFallback className="text-[9px]">
                          {member.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sprint */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Sprint</label>
            <Select value={sprint} onValueChange={onSprintChange}>
              <SelectTrigger className="w-full bg-background h-8.5 text-xs cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sprint-4">Sprint 4 — Wrzesień (Aktywny)</SelectItem>
                <SelectItem value="sprint-5">Sprint 5 — Październik (Planowany)</SelectItem>
                <SelectItem value="none">Backlog (brak sprintu)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Story Points */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Story Points</label>
            <div className="flex items-center gap-1.5">
              {STORY_POINTS_OPTIONS.map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => onStoryPointsChange(pts)}
                  className={`size-7 rounded text-xs font-medium border transition-colors cursor-pointer ${
                    storyPoints === pts
                      ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                      : 'bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {pts}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <Calendar className="size-3 text-muted-foreground" />
              Termin realizacji
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              className="h-8.5 text-xs bg-background"
            />
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Etykiety</label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_LABELS.map((label) => {
                const isSelected = selectedLabels.includes(label);
                return (
                  <Badge
                    key={label}
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => onToggleLabel(label)}
                    className="text-[10px] cursor-pointer transition-all select-none"
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>
            <Input
              placeholder="+ Dodaj własną etykietę (Enter)..."
              value={customLabelInput}
              onChange={(e) => setCustomLabelInput(e.target.value)}
              onKeyDown={handleCustomLabelKeyDown}
              className="h-7 text-[11px] bg-background"
            />
          </div>
        </div>
      </div>

      {/* Reporter info */}
      <div className="border-t pt-4">
        <label className="text-[11px] font-medium text-muted-foreground block mb-2">
          Zgłaszający
        </label>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-background border">
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px] font-semibold">
              {reporter.avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{reporter.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{reporter.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
