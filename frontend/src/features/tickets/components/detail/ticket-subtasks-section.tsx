'use client';

import * as React from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { cn } from '#/lib/utils';
import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import { Checkbox } from '#/components/ui/checkbox.tsx';
import type { Subtask } from '#/types/tickets';

export interface TicketSubtasksSectionProps {
  subtasks: Subtask[];
  onToggleSubtask: (subtaskId: string) => void;
  onAddSubtask: (title: string) => void;
}

export function TicketSubtasksSection({
  subtasks,
  onToggleSubtask,
  onAddSubtask,
}: TicketSubtasksSectionProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');

  const completedCount = subtasks.filter((s) => s.status === 'zamknięty').length;
  const progressPercent = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="size-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Kryteria akceptacji & Podzadania
          </h3>
        </div>
        <span className="text-xs font-mono font-medium text-muted-foreground">
          {completedCount}/{subtasks.length} ukończono
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Subtasks list */}
      <div className="space-y-1.5">
        {subtasks.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-1">
            Brak zdefiniowanych podzadań lub kryteriów akceptacji.
          </p>
        ) : (
          subtasks.map((st) => {
            const isDone = st.status === 'zamknięty';
            return (
              <div
                key={st.id}
                onClick={() => onToggleSubtask(st.id)}
                className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <Checkbox
                  checked={isDone}
                  onCheckedChange={() => onToggleSubtask(st.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span
                  className={cn(
                    'text-xs font-medium flex-1 transition-all',
                    isDone ? 'line-through text-muted-foreground' : 'text-foreground',
                  )}
                >
                  {st.title}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {st.id}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Add subtask inline form */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
        <Input
          placeholder="Dodaj nowe podzadanie lub kryterium..."
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          className="h-8 text-xs bg-background"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!newSubtaskTitle.trim()}
          className="h-8 px-3 text-xs gap-1 cursor-pointer shrink-0"
        >
          <Plus className="size-3.5" />
          Dodaj
        </Button>
      </form>
    </div>
  );
}
