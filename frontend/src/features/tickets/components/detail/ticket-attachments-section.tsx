'use client';

import * as React from 'react';
import { FileText, Paperclip, Plus, Trash2 } from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface TicketAttachmentsSectionProps {
  attachments: AttachmentItem[];
  onRemoveAttachment: (id: string) => void;
  onAddAttachment?: (file: File) => void;
}

export function TicketAttachmentsSection({
  attachments,
  onRemoveAttachment,
  onAddAttachment,
}: TicketAttachmentsSectionProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAddAttachment) {
      onAddAttachment(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="size-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Załączniki ({attachments.length})
          </h3>
        </div>
        <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-7 text-xs gap-1 cursor-pointer"
        >
          <Plus className="size-3.5" />
          Dodaj załącznik
        </Button>
      </div>

      {attachments.length === 0 ? (
        <p className="text-xs text-muted-foreground italic py-1">
          Brak załączonych plików w tym zadaniu.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="size-7 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FileText className="size-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">{file.size}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAttachment(file.id)}
                className="size-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                title="Usuń plik"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
