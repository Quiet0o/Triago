'use client';

import 'prosekit/basic/style.css';
import 'prosekit/basic/typography.css';

import * as React from 'react';
import type { BasicExtension } from 'prosekit/basic';
import { defineBasicExtension } from 'prosekit/basic';
import type { Editor, NodeJSON } from 'prosekit/core';
import {
  createEditor,
  defineDocChangeHandler,
  union,
} from 'prosekit/core';
import { definePlaceholder } from 'prosekit/extensions/placeholder';
import { ProseKit, useEditorDerivedValue } from 'prosekit/react';
import {
  Bold,
  CheckSquare,
  Code,
  FileCode,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react';
import { cn } from '#/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx';
import { InlineMenu } from './ui/inline-menu/index.ts';

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

  const defaultContent = React.useMemo(() => {
    if (typeof initialContent === 'string') {
      return textToNodeJSON(initialContent);
    }
    if (initialContent) {
      return initialContent;
    }
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    };
  }, [initialContent]);

  const editor = React.useMemo(() => {
    const extension = union(
      defineBasicExtension(),
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
