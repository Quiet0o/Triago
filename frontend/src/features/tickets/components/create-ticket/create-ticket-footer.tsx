'use client';

import * as React from 'react';
import { Check, Command, Loader2 } from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';
import { Checkbox } from '#/components/ui/checkbox.tsx';

export interface CreateTicketFooterProps {
  createAnother: boolean;
  onCreateAnotherChange: (value: boolean) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function CreateTicketFooter({
  createAnother,
  onCreateAnotherChange,
  isSubmitting,
  onCancel,
  onSubmit,
}: CreateTicketFooterProps) {
  return (
    <div className="border-t bg-muted/20 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-4">
        {/* Create another checkbox */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground select-none hover:text-foreground">
          <Checkbox
            checked={createAnother}
            onCheckedChange={(val) => onCreateAnotherChange(!!val)}
          />
          <span>Utwórz kolejne zadanie po zapisaniu</span>
        </label>

        {/* Shortcut hint */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground/70">
          <span className="inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            <Command className="size-2.5" /> Enter
          </span>
          <span>aby zapisać</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-8 text-xs cursor-pointer"
        >
          Anuluj
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-8 px-4 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Tworzenie...
            </>
          ) : (
            <>
              <Check className="size-3.5" />
              Utwórz zadanie
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
