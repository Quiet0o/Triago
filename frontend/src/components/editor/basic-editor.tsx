'use client';

import 'prosekit/basic/style.css';
import 'prosekit/basic/typography.css';

import * as React from 'react';
import type { BasicExtension } from 'prosekit/basic';
import { defineBasicExtension } from 'prosekit/basic';
import type { Editor, NodeJSON } from 'prosekit/core';
import { createEditor, defineDocChangeHandler, union } from 'prosekit/core';
import type { Uploader } from 'prosekit/extensions/file';
import type { ImageExtension } from 'prosekit/extensions/image';
import { defineImageUploadHandler } from 'prosekit/extensions/image';
import { definePlaceholder } from 'prosekit/extensions/placeholder';
import { ProseKit, useEditor, useEditorDerivedValue } from 'prosekit/react';
import {
  Bold,
  Check,
  CheckSquare,
  Code,
  FileCode,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  UploadCloud,
} from 'lucide-react';
import { cn } from '#/lib/utils';
import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip.tsx';
import { defineImageView } from './ui/image-view/index.ts';
import { InlineMenu } from './ui/inline-menu/index.ts';

export const localBase64Uploader: Uploader<string> = ({ file, onProgress }): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress({ loaded: event.loaded, total: event.total });
      }
    };
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Nie udało się odczytać pliku'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('Błąd odczytu pliku'));
    reader.readAsDataURL(file);
  });
};

export function textToNodeJSON(text: string): NodeJSON {
  if (!text || !text.trim()) {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    };
  }

  const lines = text.split('\n');
  return {
    type: 'doc',
    content: lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return { type: 'paragraph' };
      }
      return {
        type: 'paragraph',
        content: [{ type: 'text', text: line }],
      };
    }),
  };
}

function InsertImageDialog({
  open,
  onOpenChange,
  onInsert,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string) => void;
}) {
  const [tab, setTab] = React.useState<'upload' | 'url'>('upload');
  const [url, setUrl] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (tab === 'upload' && previewUrl) {
      onInsert(previewUrl);
      handleClose();
    } else if (tab === 'url' && url.trim()) {
      onInsert(url.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setUrl('');
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? handleClose() : onOpenChange(val))}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <ImageIcon className="size-4 text-primary" />
            Wstaw zdjęcie
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Wybierz plik ze swojego urządzenia lub podaj bezpośredni link URL.
          </DialogDescription>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex border-b border-border gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={cn(
              'pb-2 -mb-px transition-colors cursor-pointer border-b-2',
              tab === 'upload'
                ? 'border-primary text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            Z pliku (Dysk)
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={cn(
              'pb-2 -mb-px transition-colors cursor-pointer border-b-2',
              tab === 'url'
                ? 'border-primary text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            Z linku (URL)
          </button>
        </div>

        {tab === 'upload' ? (
          <div className="space-y-3 py-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {previewUrl ? (
              <div className="relative rounded-lg border bg-muted/20 p-2 flex flex-col items-center gap-2">
                <img src={previewUrl} alt="Podgląd" className="max-h-48 rounded object-contain" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 text-xs cursor-pointer"
                >
                  Zmień plik
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-8 cursor-pointer transition-colors bg-muted/10 hover:bg-muted/20"
              >
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UploadCloud className="size-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">
                    Kliknij, aby wybrać zdjęcie
                  </p>
                  <p className="text-[11px] text-muted-foreground">PNG, JPG, GIF, WebP lub SVG</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Adres URL zdjęcia</label>
              <Input
                placeholder="https://example.com/zdjecie.png"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-9 text-xs"
                autoFocus
              />
            </div>
            {url.trim() && (
              <div className="rounded-lg border bg-muted/20 p-2 flex justify-center">
                <img
                  src={url}
                  alt="Podgląd URL"
                  className="max-h-44 rounded object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 text-xs cursor-pointer"
          >
            Anuluj
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={tab === 'upload' ? !previewUrl : !url.trim()}
            className="h-8 px-4 text-xs cursor-pointer gap-1.5"
          >
            <Check className="size-3.5" />
            Wstaw zdjęcie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getToolbarItems(editor: Editor<BasicExtension>) {
  return {
    undo: {
      isActive: false,
      canExec: editor.commands.undo.canExec(),
      command: () => editor.commands.undo(),
    },
    redo: {
      isActive: false,
      canExec: editor.commands.redo.canExec(),
      command: () => editor.commands.redo(),
    },
    bold: {
      isActive: editor.marks.bold.isActive(),
      canExec: editor.commands.toggleBold.canExec(),
      command: () => editor.commands.toggleBold(),
    },
    italic: {
      isActive: editor.marks.italic.isActive(),
      canExec: editor.commands.toggleItalic.canExec(),
      command: () => editor.commands.toggleItalic(),
    },
    underline: {
      isActive: editor.marks.underline.isActive(),
      canExec: editor.commands.toggleUnderline.canExec(),
      command: () => editor.commands.toggleUnderline(),
    },
    strike: {
      isActive: editor.marks.strike.isActive(),
      canExec: editor.commands.toggleStrike.canExec(),
      command: () => editor.commands.toggleStrike(),
    },
    code: {
      isActive: editor.marks.code.isActive(),
      canExec: editor.commands.toggleCode.canExec(),
      command: () => editor.commands.toggleCode(),
    },
    heading1: {
      isActive: editor.nodes.heading.isActive({ level: 1 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 1 }),
      command: () => editor.commands.toggleHeading({ level: 1 }),
    },
    heading2: {
      isActive: editor.nodes.heading.isActive({ level: 2 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 2 }),
      command: () => editor.commands.toggleHeading({ level: 2 }),
    },
    bulletList: {
      isActive: editor.nodes.list.isActive({ kind: 'bullet' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'bullet' }),
      command: () => editor.commands.toggleList({ kind: 'bullet' }),
    },
    orderedList: {
      isActive: editor.nodes.list.isActive({ kind: 'ordered' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'ordered' }),
      command: () => editor.commands.toggleList({ kind: 'ordered' }),
    },
    taskList: {
      isActive: editor.nodes.list.isActive({ kind: 'task' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'task' }),
      command: () => editor.commands.toggleList({ kind: 'task' }),
    },
    blockquote: {
      isActive: editor.nodes.blockquote.isActive(),
      canExec: editor.commands.toggleBlockquote.canExec(),
      command: () => editor.commands.toggleBlockquote(),
    },
    codeBlock: {
      isActive: editor.nodes.codeBlock.isActive(),
      canExec: editor.commands.insertCodeBlock.canExec({ language: 'typescript' }),
      command: () => editor.commands.insertCodeBlock({ language: 'typescript' }),
    },
  };
}

function BasicToolbar() {
  const items = useEditorDerivedValue(getToolbarItems);
  const editor = useEditor<BasicExtension & ImageExtension>();
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);

  const renderBtn = (
    item: { isActive: boolean; canExec: boolean; command: () => void },
    label: string,
    icon: React.ReactNode,
  ) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled={!item.canExec}
            onMouseDown={(e) => {
              e.preventDefault();
              item.command();
            }}
            className={cn(
              'flex size-7 items-center justify-center rounded p-1 transition-colors cursor-pointer',
              item.isActive
                ? 'bg-muted text-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              !item.canExec && 'opacity-40 cursor-not-allowed',
            )}
            aria-label={label}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent className="text-[11px] py-1 px-2">{label}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/20 px-2 py-1 text-muted-foreground">
      {renderBtn(items.undo, 'Cofnij (Undo)', <Undo2 className="size-3.5" />)}
      {renderBtn(items.redo, 'Ponów (Redo)', <Redo2 className="size-3.5" />)}

      <div className="mx-1 h-3.5 w-px bg-border/60" />

      {renderBtn(items.heading1, 'Nagłówek 1', <Heading1 className="size-3.5" />)}
      {renderBtn(items.heading2, 'Nagłówek 2', <Heading2 className="size-3.5" />)}

      <div className="mx-1 h-3.5 w-px bg-border/60" />

      {renderBtn(items.bold, 'Pogrubienie (Bold)', <Bold className="size-3.5" />)}
      {renderBtn(items.italic, 'Kursywa (Italic)', <Italic className="size-3.5" />)}
      {renderBtn(items.underline, 'Podkreślenie', <UnderlineIcon className="size-3.5" />)}
      {renderBtn(items.strike, 'Przekreślenie', <Strikethrough className="size-3.5" />)}
      {renderBtn(items.code, 'Kod liniowy', <Code className="size-3.5" />)}

      <div className="mx-1 h-3.5 w-px bg-border/60" />

      {renderBtn(items.bulletList, 'Lista punktowana', <List className="size-3.5" />)}
      {renderBtn(items.orderedList, 'Lista numerowana', <ListOrdered className="size-3.5" />)}
      {renderBtn(items.taskList, 'Lista zadań', <CheckSquare className="size-3.5" />)}

      <div className="mx-1 h-3.5 w-px bg-border/60" />

      {renderBtn(items.blockquote, 'Cytat', <Quote className="size-3.5" />)}
      {renderBtn(items.codeBlock, 'Blok kodu', <FileCode className="size-3.5" />)}

      <div className="mx-1 h-3.5 w-px bg-border/60" />

      {/* Image button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setImageDialogOpen(true)}
            className="flex size-7 items-center justify-center rounded p-1 transition-colors cursor-pointer text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            aria-label="Wstaw zdjęcie"
          >
            <ImageIcon className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="text-[11px] py-1 px-2">Wstaw zdjęcie</TooltipContent>
      </Tooltip>

      <InsertImageDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onInsert={(src) => {
          editor.commands.insertImage({ src });
        }}
      />
    </div>
  );
}

export interface BasicTaskEditorProps {
  initialContent?: string | NodeJSON;
  placeholder?: string;
  onChange?: (text: string, html: string) => void;
  className?: string;
  minHeight?: string;
  readOnly?: boolean;
}

export function BasicTaskEditor({
  initialContent,
  placeholder = 'Opisz szczegóły zadania...',
  onChange,
  className,
  minHeight = 'min-h-[140px]',
  readOnly = false,
}: BasicTaskEditorProps) {
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const [defaultContent] = React.useState(() => {
    if (typeof initialContent === 'string') {
      if (initialContent.trim().startsWith('<') || initialContent.includes('<img')) {
        return initialContent;
      }
      return textToNodeJSON(initialContent);
    }
    if (initialContent) {
      return initialContent;
    }
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    };
  });

  const editor = React.useMemo(() => {
    const extension = union(
      defineBasicExtension(),
      defineImageView(),
      defineImageUploadHandler({ uploader: localBase64Uploader }),
      definePlaceholder({ placeholder }),
      defineDocChangeHandler((view) => {
        if (onChangeRef.current) {
          const text = view.state.doc.textContent;
          const html = view.dom.innerHTML;
          onChangeRef.current(text, html);
        }
      }),
    );
    return createEditor({ extension, defaultContent });
  }, [defaultContent, placeholder]);

  return (
    <ProseKit editor={editor}>
      <div
        className={cn(
          'relative flex flex-col w-full rounded-lg border border-border bg-background transition-colors focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30 overflow-hidden shadow-2xs',
          className,
        )}
      >
        {!readOnly && <BasicToolbar />}
        <div className="relative w-full flex-1 overflow-y-auto">
          <div
            ref={editor.mount}
            className={cn(
              'ProseMirror box-border w-full p-3 text-sm text-foreground outline-none',
              minHeight,
            )}
          />
          {!readOnly && <InlineMenu />}
        </div>
      </div>
    </ProseKit>
  );
}

export default BasicTaskEditor;
