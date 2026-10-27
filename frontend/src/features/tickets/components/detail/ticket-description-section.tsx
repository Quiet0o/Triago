'use client';

import { Edit3, FileText } from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';
import { BasicTaskEditor } from '#/components/editor/basic-editor.tsx';
import type { Ticket } from '#/types/tickets';

export interface TicketDescriptionSectionProps {
  ticket: Ticket;
  isEditingDesc: boolean;
  descDraft: string;
  descHtmlDraft: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onDraftChange: (text: string, html: string) => void;
}

export function TicketDescriptionSection({
  ticket,
  isEditingDesc,
  descDraft,
  descHtmlDraft,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDraftChange,
}: TicketDescriptionSectionProps) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Opis zadania
          </h3>
        </div>
        {!isEditingDesc && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onStartEdit}
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
          >
            <Edit3 className="size-3.5" />
            Edytuj
          </Button>
        )}
      </div>

      {isEditingDesc ? (
        <div className="space-y-3">
          <BasicTaskEditor
            initialContent={descHtmlDraft || ticket.descriptionHtml || descDraft}
            onChange={onDraftChange}
            placeholder="Wpisz szczegółowy opis zadania..."
            minHeight="min-h-[160px]"
          />
          <div className="flex items-center gap-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancelEdit}
              className="h-8 text-xs cursor-pointer"
            >
              Anuluj
            </Button>
            <Button size="sm" onClick={onSave} className="h-8 px-3 text-xs cursor-pointer">
              Zapisz opis
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-sm leading-relaxed text-foreground/90">
          {ticket.descriptionHtml ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none break-words [&>p]:leading-relaxed [&_img]:rounded-lg [&_img]:my-3 [&_img]:max-h-96 [&_img]:border [&_img]:border-border/60 [&_img]:object-contain [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4"
              dangerouslySetInnerHTML={{ __html: ticket.descriptionHtml }}
            />
          ) : ticket.description ? (
            <div className="whitespace-pre-wrap">{ticket.description}</div>
          ) : (
            <span className="italic text-muted-foreground">Brak opisu zadania.</span>
          )}
        </div>
      )}
    </div>
  );
}
