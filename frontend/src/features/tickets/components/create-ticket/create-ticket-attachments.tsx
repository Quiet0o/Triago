'use client';

import * as React from 'react';
import { FileText, Paperclip, Upload, X } from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';

export interface AttachmentItem {
  name: string;
  size: string;
}

export interface CreateTicketAttachmentsProps {
  attachments: AttachmentItem[];
  onAddAttachment: (file: File) => void;
  onRemoveAttachment: (index: number) => void;
}

export function CreateTicketAttachments({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
}: CreateTicketAttachmentsProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddAttachment(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Paperclip className="size-3.5 text-primary" />
          Załączniki
        </label>
        <span className="text-[11px] text-muted-foreground">Opcjonalnie</span>
      </div>

      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-muted/10 hover:bg-muted/20"
      >
        <div className="flex flex-col items-center justify-center gap-1.5">
          <Upload className="size-5 text-muted-foreground" />
          <p className="text-xs font-medium text-foreground">
            Upuść plik tutaj lub <span className="text-primary underline">wybierz z dysku</span>
          </p>
          <p className="text-[10px] text-muted-foreground">
            Maks. 25 MB na plik (obrazy, logi, specyfikacje)
          </p>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {attachments.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-lg border bg-muted/30 text-xs"
            >
              <FileText className="size-3.5 text-primary shrink-0" />
              <span className="font-medium truncate max-w-[140px]">{file.name}</span>
              <span className="text-[10px] text-muted-foreground">({file.size})</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAttachment(i)}
                className="size-5 p-0 text-muted-foreground hover:text-destructive cursor-pointer ml-1"
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
