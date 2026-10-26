'use client';

import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { Link2, Unlink2, Zap } from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx';
import type { Ticket } from '#/types/tickets';
import {
  PriorityBadge,
  StatusBadge,
  TicketTypeIcon,
} from '../ticket-badges';

export interface TicketEpicTasksSectionProps {
  attachedTickets: Ticket[];
  availableTicketsToAttach: Ticket[];
  onAttachTicket: (ticketId: string) => void;
  onDetachTicket: (ticketId: string) => void;
}

export function TicketEpicTasksSection({
  attachedTickets,
  availableTicketsToAttach,
  onAttachTicket,
  onDetachTicket,
}: TicketEpicTasksSectionProps) {
  const [selectedTicketToAttach, setSelectedTicketToAttach] = React.useState<string>('');

  const completedCount = attachedTickets.filter((t) => t.status === 'zamknięty').length;
  const totalCount = attachedTickets.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const totalPoints = attachedTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
  const completedPoints = attachedTickets
    .filter((t) => t.status === 'zamknięty')
    .reduce((acc, t) => acc + (t.storyPoints || 0), 0);

  const handleAttach = () => {
    if (!selectedTicketToAttach) return;
    onAttachTicket(selectedTicketToAttach);
    setSelectedTicketToAttach('');
  };

  return (
    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.03] to-transparent p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-600">
            <Zap className="size-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Zadania powiązane z Epikiem
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Zarządzaj zakresem prac i śledź całościowy postęp tej inicjatywy
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-semibold text-purple-600">
            {completedCount}/{totalCount} ukończono
          </span>
          {totalPoints > 0 && (
            <p className="text-[10px] text-muted-foreground font-mono">
              {completedPoints}/{totalPoints} SP
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Attached Tickets List */}
      <div className="space-y-2">
        {attachedTickets.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Ten epik nie ma jeszcze podpiętych żadnych zadań.
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-0.5">
              Wybierz istniejące zadanie poniżej, aby powiązać je z tym epikiem.
            </p>
          </div>
        ) : (
          attachedTickets.map((child) => {
            const isDone = child.status === 'zamknięty';
            return (
              <div
                key={child.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <TicketTypeIcon type={child.type} />
                  <Link
                    to="/project/tickets/$ticketId"
                    params={{ ticketId: child.id }}
                    className="font-mono text-xs font-semibold text-primary hover:underline shrink-0"
                  >
                    {child.id}
                  </Link>
                  <span
                    className={`text-xs font-medium truncate ${
                      isDone ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {child.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={child.status} />
                  <PriorityBadge priority={child.priority} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDetachTicket(child.id)}
                    className="size-7 p-0 opacity-40 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                    title="Odłącz zadanie od tego epika"
                  >
                    <Unlink2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Attach Existing Ticket Controls */}
      <div className="pt-2 border-t border-purple-500/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 min-w-0">
          <Select
            value={selectedTicketToAttach}
            onValueChange={setSelectedTicketToAttach}
          >
            <SelectTrigger className="w-full bg-background h-8 text-xs cursor-pointer">
              <SelectValue placeholder="Wybierz istniejące zadanie do podpięcia..." />
            </SelectTrigger>
            <SelectContent>
              {availableTicketsToAttach.length === 0 ? (
                <div className="p-2 text-center text-xs text-muted-foreground">
                  Brak dostępnych zadań do powiązania
                </div>
              ) : (
                availableTicketsToAttach.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex items-center gap-2">
                      <TicketTypeIcon type={t.type} />
                      <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                      <span className="truncate max-w-[260px]">{t.title}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          size="sm"
          disabled={!selectedTicketToAttach}
          onClick={handleAttach}
          className="h-8 px-3 text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shrink-0"
        >
          <Link2 className="size-3.5" />
          Podepnij do Epika
        </Button>
      </div>
    </div>
  );
}
