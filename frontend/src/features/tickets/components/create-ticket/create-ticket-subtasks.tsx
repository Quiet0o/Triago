'use client';

import * as React from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import { Checkbox } from '#/components/ui/checkbox.tsx';
import { cn } from '#/lib/utils';

export interface CreateSubtaskItem {
  id: string;
  title: string;
  done: boolean;
}

export interface CreateTicketSubtasksProps {
  subtasks: CreateSubtaskItem[];
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (id: string) => void;
  onRemoveSubtask: (id: string) => void;
}

export function CreateTicketSubtasks({
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onRemoveSubtask,
}: CreateTicketSubtasksProps) {
  const [titleInput, setTitleInput] = React.useState('');

  const handleAdd = () => {
    if (!titleInput.trim()) return;
    onAddSubtask(titleInput.trim());
    setTitleInput('');
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <CheckSquare className="size-3.5 text-primary" />
          Kryteria akceptacji / Podzadania
        </label>
        {subtasks.length > 0 && (
          <span className="text-[11px] text-muted-foreground font-medium">
            {subtasks.filter((s) => s.done).length}/{subtasks.length} ukończono
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <div className="space-y-1.5 rounded-lg border bg-muted/20 p-2">
          {subtasks.map((st) => (
            <div
              key={st.id}
              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/40 transition-colors group"
            >
              <Checkbox
                checked={st.done}
                onCheckedChange={() => onToggleSubtask(st.id)}
                className="cursor-pointer"
              />
              <span
                className={cn(
                  'text-xs flex-1 transition-all',
                  st.done ? 'line-through text-muted-foreground' : 'text-foreground',
                )}
              >
                {st.title}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSubtask(st.id)}
                className="size-6 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive cursor-pointer transition-opacity"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          placeholder="np. Walidacja formularza po stronie klienta..."
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="h-8 text-xs bg-background"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={!titleInput.trim()}
          className="h-8 px-2.5 text-xs gap-1 cursor-pointer shrink-0"
        >
          <Plus className="size-3" />
          Dodaj
        </Button>
      </div>
    </div>
  );
}
