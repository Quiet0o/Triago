'use client';

import * as React from 'react';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '#/components/ui/avatar.tsx';
import { Button } from '#/components/ui/button.tsx';
import { BasicTaskEditor } from '#/components/editor/basic-editor.tsx';

export interface CommentComposerProps {
  onSubmit: (text: string, html: string) => void;
  userFallback?: string;
}

export function CommentComposer({ onSubmit, userFallback = 'ZU' }: CommentComposerProps) {
  const [textDraft, setTextDraft] = React.useState('');
  const [htmlDraft, setHtmlDraft] = React.useState('');
  const [editorKey, setEditorKey] = React.useState(0);

  const hasContent = Boolean(textDraft.trim() || htmlDraft.includes('<img'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasContent) return;
    onSubmit(textDraft, htmlDraft);
    setTextDraft('');
    setHtmlDraft('');
    setEditorKey((k) => k + 1);
  };

  const handleCancel = () => {
    setTextDraft('');
    setHtmlDraft('');
    setEditorKey((k) => k + 1);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 pt-3 border-t">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
          {userFallback}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2.5 min-w-0">
        <BasicTaskEditor
          key={editorKey}
          placeholder="Napisz komentarz... (obsługuje formatowanie ProseKit, listy, kod oraz zdjęcia)"
          onChange={(text, html) => {
            setTextDraft(text);
            setHtmlDraft(html);
          }}
          minHeight="min-h-[80px]"
          className="border-border/80 focus-within:border-primary/60"
        />
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] text-muted-foreground">
            Wspiera formatowanie tekstu ProseKit, kod, listy oraz dodawanie zdjęć.
          </span>
          <div className="flex items-center gap-2">
            {hasContent && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Anuluj
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!hasContent}
              className="gap-1.5 text-xs h-8 px-3 cursor-pointer shadow-xs"
            >
              <Send className="size-3" />
              Opublikuj komentarz
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
