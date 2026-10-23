'use client';

import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  FileText,
  History,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Share2,
  Tag,
  User,
} from 'lucide-react';
import { cn } from '#/lib/utils';
import { Button } from '#/components/ui/button.tsx';
import { Badge } from '#/components/ui/badge.tsx';
import { Avatar, AvatarFallback } from '#/components/ui/avatar.tsx';
import { Input } from '#/components/ui/input.tsx';
import { Checkbox } from '#/components/ui/checkbox.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx';
import type {
  Ticket,
  TicketPerson,
  TicketPriority,
  TicketStatus,
  TicketType,
} from '#/types/tickets';
import {
  PriorityBadge,
  StatusBadge,
  StoryPointsBadge,
  TicketTypeIcon,
} from './ticket-badges';
import { TEAM_MEMBERS } from './create-ticket-modal';
import { BasicTaskEditor } from '#/components/editor/basic-editor';
import mockData from '#/data/mock-tickets.json';

interface Comment {
  id: string;
  author: TicketPerson;
  content: string;
  contentHtml?: string;
  createdAt: string;
  timestamp: number;
  reactions: { emoji: string; count: number; reacted: boolean }[];
}

interface ActivityEvent {
  id: string;
  user: string;
  userAvatarFallback?: string;
  action: string;
  target: string;
  time: string;
  timestamp: number;
  type?: 'status' | 'assignee' | 'created' | 'priority' | 'comment';
}

type FeedItem =
  | { kind: 'comment'; id: string; timestamp: number; data: Comment }
  | { kind: 'activity'; id: string; timestamp: number; data: ActivityEvent };

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: {
      name: 'Tomasz Zieliński',
      email: 't.zielinski@triago.pl',
      avatarFallback: 'TZ',
      role: 'QA Engineer',
    },
    content:
      'Sprawdziłem logi na środowisku staging. Problem pojawia się w momencie próby nawiązania połączenia TLS z serwerem pocztowym po 30 sekundach braku odpowiedzi.',
    contentHtml:
      '<p>Sprawdziłem logi na środowisku <code>staging</code>. Problem pojawia się w momencie próby nawiązania połączenia <strong>TLS</strong> z serwerem pocztowym po <code>30 sekundach</code> braku odpowiedzi.</p>',
    createdAt: 'Wczoraj o 14:10',
    timestamp: new Date('2026-09-17T14:10:00').getTime(),
    reactions: [
      { emoji: '👍', count: 2, reacted: false },
      { emoji: '👀', count: 1, reacted: true },
    ],
  },
  {
    id: 'c2',
    author: {
      name: 'Aleksandra Nowak',
      email: 'a.nowak@triago.pl',
      avatarFallback: 'AN',
      role: 'Senior Developer',
    },
    content:
      'Dodałam mechanizm ponawiania (exponential backoff) oraz podniosłam timeout do 45s. Przygotowuję PR do review.',
    contentHtml:
      '<p>Dodałam mechanizm ponawiania (<em>exponential backoff</em>) oraz podniosłam timeout do <code>45s</code>. Przygotowuję PR do review.</p>',
    createdAt: 'Dzisiaj o 09:25',
    timestamp: new Date('2026-09-18T09:25:00').getTime(),
    reactions: [
      { emoji: '🚀', count: 3, reacted: true },
      { emoji: '🎉', count: 2, reacted: false },
    ],
  },
];

const INITIAL_ACTIVITY: ActivityEvent[] = [
  {
    id: 'a3',
    user: 'Tomasz Zieliński',
    userAvatarFallback: 'TZ',
    action: 'utworzył zadanie w sprincie',
    target: 'Sprint 4 — September',
    time: '16 wrz 2026, 09:22',
    timestamp: new Date('2026-09-16T09:22:00').getTime(),
    type: 'created',
  },
  {
    id: 'a2',
    user: 'Aleksandra Nowak',
    userAvatarFallback: 'AN',
    action: 'przypisała zadanie do',
    target: 'Aleksandra Nowak',
    time: 'Wczoraj o 16:30',
    timestamp: new Date('2026-09-17T16:30:00').getTime(),
    type: 'assignee',
  },
  {
    id: 'a1',
    user: 'Aleksandra Nowak',
    userAvatarFallback: 'AN',
    action: 'zmieniła status na',
    target: 'W toku',
    time: 'Dzisiaj o 09:15',
    timestamp: new Date('2026-09-18T09:15:00').getTime(),
    type: 'status',
  },
];

function CommentCard({
  comment,
  onToggleReaction,
}: {
  comment: Comment;
  onToggleReaction: (commentId: string, emoji: string) => void;
}) {
  return (
    <div className="flex gap-3 text-sm group">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
          {comment.author.avatarFallback}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-xs text-foreground">
            {comment.author.name}
          </span>
          <span className="text-[10px] text-muted-foreground">•</span>
          <span className="text-[11px] text-muted-foreground">{comment.createdAt}</span>
          <Badge variant="outline" className="text-[9px] h-4 px-1.5 py-0 font-normal">
            {comment.author.role}
          </Badge>
        </div>
        {comment.contentHtml ? (
          <div
            className="rounded-lg border bg-muted/10 p-3 text-xs leading-relaxed text-foreground break-words space-y-1.5 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>blockquote]:border-l-2 [&>blockquote]:border-primary/50 [&>blockquote]:pl-2.5 [&>blockquote]:italic [&>pre]:bg-muted [&>pre]:p-2 [&>pre]:rounded [&>pre]:overflow-x-auto [&>code]:bg-muted/80 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-[11px] [&_img]:rounded-md [&_img]:my-2 [&_img]:max-h-72 [&_img]:border [&_img]:border-border/60 [&_img]:object-contain"
            dangerouslySetInnerHTML={{ __html: comment.contentHtml }}
          />
        ) : (
          <div className="rounded-lg border bg-muted/10 p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
            {comment.content}
          </div>
        )}
        {comment.reactions.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {comment.reactions.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onToggleReaction(comment.id, r.emoji)}
                className={cn(
                  'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer',
                  r.reacted
                    ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                    : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted',
                )}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityRow({ activity }: { activity: ActivityEvent }) {
  const renderIcon = () => {
    switch (activity.type) {
      case 'created':
        return (
          <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Plus className="size-3" />
          </div>
        );
      case 'status':
        return (
          <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <ArrowRight className="size-3" />
          </div>
        );
      case 'assignee':
        return (
          <div className="flex size-6 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
            <User className="size-3" />
          </div>
        );
      default:
        return (
          <div className="flex size-6 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground">
            <History className="size-3" />
          </div>
        );
    }
  };

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground py-0.5">
      <div className="size-8 flex items-center justify-center shrink-0">
        {renderIcon()}
      </div>
      <div className="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
        <span className="font-semibold text-foreground">{activity.user}</span>
        <span>{activity.action}</span>
        <span className="font-semibold text-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/60 text-[11px]">
          {activity.target}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground shrink-0">{activity.time}</span>
    </div>
  );
}

function CommentComposer({
  onSubmit,
}: {
  onSubmit: (text: string, html: string) => void;
}) {
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

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 pt-3 border-t">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
          ZU
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
                onClick={() => {
                  setTextDraft('');
                  setHtmlDraft('');
                  setEditorKey((k) => k + 1);
                }}
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

export function TicketDetailView({ ticketId }: { ticketId: string }) {
  const navigate = useNavigate();

  // Find ticket from mock data
  const initialTicket = React.useMemo(() => {
    const all = mockData.tickets as Ticket[];
    return all.find((t) => t.id === ticketId) ?? all[0];
  }, [ticketId]);

  // Local state for interactive editing
  const [ticket, setTicket] = React.useState<Ticket>(initialTicket);
  const [activeTab, setActiveTab] = React.useState<'all' | 'comments' | 'history'>('all');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [comments, setComments] = React.useState<Comment[]>(INITIAL_COMMENTS);
  const [activities, setActivities] = React.useState<ActivityEvent[]>(INITIAL_ACTIVITY);
  const [copiedKey, setCopiedKey] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleDraft, setTitleDraft] = React.useState(ticket.title);
  const [isEditingDesc, setIsEditingDesc] = React.useState(false);
  const [descDraft, setDescDraft] = React.useState(ticket.description);
  const [descHtmlDraft, setDescHtmlDraft] = React.useState(ticket.descriptionHtml ?? '');
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');

  React.useEffect(() => {
    setTicket(initialTicket);
    setTitleDraft(initialTicket.title);
    setDescDraft(initialTicket.description);
    setDescHtmlDraft(initialTicket.descriptionHtml ?? '');
  }, [initialTicket]);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(ticket.id);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveTitle = () => {
    if (titleDraft.trim()) {
      setTicket((prev) => ({ ...prev, title: titleDraft.trim() }));
    }
    setIsEditingTitle(false);
  };

  const handleSaveDesc = () => {
    setTicket((prev) => ({
      ...prev,
      description: descDraft.trim() || (descHtmlDraft.includes('<img') ? 'Załączono zdjęcie w opisie' : ''),
      descriptionHtml: descHtmlDraft.trim() || undefined,
    }));
    setIsEditingDesc(false);
  };

  const handleAddComment = (text: string, html: string) => {
    if (!text.trim() && !html.includes('<img')) return;

    const now = Date.now();
    const newComment: Comment = {
      id: `c-${now}`,
      author: {
        name: 'Zalogowany użytkownik',
        email: 'user@triago.pl',
        avatarFallback: 'ZU',
        role: 'Current User',
      },
      content: text.trim() || 'Załączono zdjęcie',
      contentHtml: html.trim() || undefined,
      createdAt: 'Przed chwilą',
      timestamp: now,
      reactions: [],
    };

    setComments((prev) => [...prev, newComment]);
  };

  const handleToggleReaction = (commentId: string, emoji: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const existing = c.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          if (existing.reacted) {
            return {
              ...c,
              reactions: c.reactions
                .map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count - 1, reacted: false } : r,
                )
                .filter((r) => r.count > 0),
            };
          }
          return {
            ...c,
            reactions: c.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r,
            ),
          };
        }
        return {
          ...c,
          reactions: [...c.reactions, { emoji, count: 1, reacted: true }],
        };
      }),
    );
  };

  const unifiedFeed = React.useMemo<FeedItem[]>(() => {
    const commentItems: FeedItem[] = comments.map((c) => ({
      kind: 'comment',
      id: c.id,
      timestamp: c.timestamp,
      data: c,
    }));

    const activityItems: FeedItem[] = activities.map((a) => ({
      kind: 'activity',
      id: a.id,
      timestamp: a.timestamp,
      data: a,
    }));

    const merged = [...commentItems, ...activityItems];
    merged.sort((a, b) =>
      sortOrder === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp,
    );
    return merged;
  }, [comments, activities, sortOrder]);

  const sortedComments = React.useMemo(() => {
    return [...comments].sort((a, b) =>
      sortOrder === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp,
    );
  }, [comments, sortOrder]);

  const sortedActivities = React.useMemo(() => {
    return [...activities].sort((a, b) =>
      sortOrder === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp,
    );
  }, [activities, sortOrder]);

  const toggleSubtask = (subtaskId: string) => {
    setTicket((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((st) =>
        st.id === subtaskId
          ? {
              ...st,
              status: st.status === 'zamknięty' ? 'w_toku' : 'zamknięty',
            }
          : st,
      ),
    }));
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setTicket((prev) => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        {
          id: `${prev.id}-${prev.subtasks.length + 1}`,
          title: newSubtaskTitle.trim(),
          status: 'nowy',
        },
      ],
    }));
    setNewSubtaskTitle('');
  };

  const completedSubtasksCount = ticket.subtasks.filter(
    (s) => s.status === 'zamknięty',
  ).length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-16">
      {/* ── Top Bar: Navigation, Breadcrumbs & Actions ────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: '/project/board' })}
            className="gap-1.5 h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Tablica
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Triago</span>
            <span>/</span>
            <span className="font-medium">Zadania</span>
            <span>/</span>
            <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded text-xs">
              <TicketTypeIcon type={ticket.type} />
              <span>{ticket.id}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyKey}
                className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
              >
                {copiedKey ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{copiedKey ? 'Skopiowano ID' : 'Kopiuj ID'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Skopiuj identyfikator zadania</TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
          >
            {copiedLink ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Share2 className="size-3.5" />
            )}
            <span>{copiedLink ? 'Skopiowano link' : 'Udostępnij'}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Zmień sprint</DropdownMenuItem>
              <DropdownMenuItem>Eksportuj do PDF</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Usuń zadanie</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Main Two-Column Split Layout ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* ──── Left Column: Content & Activity ─────────────────── */}
        <div className="space-y-8 min-w-0">
          {/* Title Area */}
          <div className="space-y-2">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="text-xl font-bold h-11"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                />
                <Button size="sm" onClick={handleSaveTitle} className="h-11 px-4 cursor-pointer">
                  Zapisz
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingTitle(false)}
                  className="h-11 px-3 cursor-pointer"
                >
                  Anuluj
                </Button>
              </div>
            ) : (
              <div className="group flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground leading-snug">
                  {ticket.title}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity size-8 p-0 shrink-0 cursor-pointer"
                  title="Edytuj tytuł"
                >
                  <Edit3 className="size-4 text-muted-foreground" />
                </Button>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="rounded-xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                Opis zadania
              </h3>
              {!isEditingDesc && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingDesc(true)}
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
                  initialContent={ticket.descriptionHtml || descDraft}
                  onChange={(text, html) => {
                    setDescDraft(text);
                    setDescHtmlDraft(html);
                  }}
                  placeholder="Wpisz szczegółowy opis zadania..."
                  minHeight="min-h-[160px]"
                />
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingDesc(false)}
                    className="h-8 text-xs cursor-pointer"
                  >
                    Anuluj
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveDesc}
                    className="h-8 px-3 text-xs cursor-pointer"
                  >
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

          {/* Subtasks / Acceptance Criteria Section */}
          <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="size-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Kryteria akceptacji & Podzadania
                </h3>
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {completedSubtasksCount}/{ticket.subtasks.length} ukończono
              </span>
            </div>

            {/* Progress Bar */}
            {ticket.subtasks.length > 0 && (
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${(completedSubtasksCount / ticket.subtasks.length) * 100}%`,
                  }}
                />
              </div>
            )}

            {/* Checklist */}
            <div className="space-y-2">
              {ticket.subtasks.map((st) => {
                const isDone = st.status === 'zamknięty';
                return (
                  <div
                    key={st.id}
                    onClick={() => toggleSubtask(st.id)}
                    className={cn(
                      'flex items-center justify-between gap-3 p-2.5 rounded-lg border transition-all cursor-pointer',
                      isDone
                        ? 'bg-muted/30 border-border/60 text-muted-foreground'
                        : 'bg-background border-border hover:border-primary/50 text-foreground',
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox
                        checked={isDone}
                        onCheckedChange={() => toggleSubtask(st.id)}
                        className="cursor-pointer"
                      />
                      <span className={cn('text-sm font-medium truncate', isDone && 'line-through')}>
                        {st.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                      {st.id}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Add Subtask input */}
            <div className="flex items-center gap-2 pt-1">
              <Input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Dodaj nowe podzadanie lub kryterium akceptacji..."
                className="h-9 text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddSubtask}
                className="h-9 px-3 text-xs shrink-0 cursor-pointer"
              >
                <Plus className="size-3.5 mr-1" />
                Dodaj
              </Button>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="rounded-xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Paperclip className="size-4 text-primary" />
                Załączniki ({ticket.attachments})
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
              >
                <Plus className="size-3" />
                Dodaj plik
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              <div className="group flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <FileText className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    smtp_timeout_stacktrace.log
                  </p>
                  <p className="text-[10px] text-muted-foreground">1.4 MB • Wczoraj, 14:05</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-6 p-0 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <ExternalLink className="size-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Activity & Comments Section */}
          <div className="rounded-xl border bg-card p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3 gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                    activeTab === 'all'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  <Activity className="size-3.5" />
                  <span>Wszystko</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('comments')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                    activeTab === 'comments'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  <MessageSquare className="size-3.5" />
                  <span>Komentarze ({comments.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                    activeTab === 'history'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  <History className="size-3.5" />
                  <span>Historia zmian</span>
                </button>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                    className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
                  >
                    <ArrowUpDown className="size-3" />
                    <span className="hidden sm:inline">
                      {sortOrder === 'desc' ? 'Od najnowszych' : 'Od najstarszych'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {sortOrder === 'desc'
                    ? 'Kolejność: od najnowszych wpisów'
                    : 'Kolejność: od najstarszych wpisów'}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* TAB: Wszystko (Połączenie chronologiczne komentarzy i historii zmian) */}
            {activeTab === 'all' && (
              <div className="space-y-6">
                {unifiedFeed.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    Brak aktywności dla tego zadania.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unifiedFeed.map((item) =>
                      item.kind === 'comment' ? (
                        <CommentCard
                          key={item.id}
                          comment={item.data}
                          onToggleReaction={handleToggleReaction}
                        />
                      ) : (
                        <ActivityRow key={item.id} activity={item.data} />
                      ),
                    )}
                  </div>
                )}

                {/* Comment Composer */}
                <CommentComposer onSubmit={handleAddComment} />
              </div>
            )}

            {/* TAB: Tylko Komentarze */}
            {activeTab === 'comments' && (
              <div className="space-y-6">
                {sortedComments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    Brak komentarzy. Bądź pierwszą osobą, która doda komentarz!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedComments.map((c) => (
                      <CommentCard
                        key={c.id}
                        comment={c}
                        onToggleReaction={handleToggleReaction}
                      />
                    ))}
                  </div>
                )}

                {/* Comment Composer */}
                <CommentComposer onSubmit={handleAddComment} />
              </div>
            )}

            {/* TAB: Tylko Historia zmian */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {sortedActivities.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    Brak historii zmian dla tego zadania.
                  </div>
                ) : (
                  sortedActivities.map((a) => (
                    <ActivityRow key={a.id} activity={a} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* ──── Right Column: Ticket Properties ─────────────────── */}
        <div className="rounded-xl border bg-card p-5 space-y-5 shadow-xs sticky top-20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Właściwości zadania
          </h3>

          {/* Typ zadania - RIGHT AT THE TOP */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Typ zadania</label>
            <Select
              value={ticket.type}
              onValueChange={(val) => setTicket((prev) => ({ ...prev, type: val as TicketType }))}
            >
              <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="size-3.5 text-blue-500" />
                    <span>Zadanie (Task)</span>
                  </div>
                </SelectItem>
                <SelectItem value="bug">
                  <div className="flex items-center gap-2">
                    <TicketTypeIcon type="bug" />
                    <span>Błąd (Bug)</span>
                  </div>
                </SelectItem>
                <SelectItem value="story">
                  <div className="flex items-center gap-2">
                    <TicketTypeIcon type="story" />
                    <span>Historyjka (Story)</span>
                  </div>
                </SelectItem>
                <SelectItem value="improvement">
                  <div className="flex items-center gap-2">
                    <TicketTypeIcon type="improvement" />
                    <span>Usprawnienie (Improvement)</span>
                  </div>
                </SelectItem>
                <SelectItem value="subtask">
                  <div className="flex items-center gap-2">
                    <TicketTypeIcon type="subtask" />
                    <span>Podzadanie (Subtask)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select
              value={ticket.status}
              onValueChange={(val) => {
                const newStatus = val as TicketStatus;
                setTicket((prev) => ({ ...prev, status: newStatus }));
                const statusNames: Record<TicketStatus, string> = {
                  nowy: 'Nowy',
                  w_toku: 'W toku',
                  review: 'W recenzji',
                  testowanie: 'Testowanie',
                  zamknięty: 'Zamknięty',
                  zablokowany: 'Zablokowany',
                };
                setActivities((prev) => [
                  ...prev,
                  {
                    id: `a-${Date.now()}`,
                    user: 'Zalogowany użytkownik',
                    userAvatarFallback: 'ZU',
                    action: 'zmienił status na',
                    target: statusNames[newStatus],
                    time: 'Przed chwilą',
                    timestamp: Date.now(),
                    type: 'status',
                  },
                ]);
              }}
            >
              <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nowy">
                  <StatusBadge status="nowy" />
                </SelectItem>
                <SelectItem value="w_toku">
                  <StatusBadge status="w_toku" />
                </SelectItem>
                <SelectItem value="review">
                  <StatusBadge status="review" />
                </SelectItem>
                <SelectItem value="testowanie">
                  <StatusBadge status="testowanie" />
                </SelectItem>
                <SelectItem value="zamknięty">
                  <StatusBadge status="zamknięty" />
                </SelectItem>
                <SelectItem value="zablokowany">
                  <StatusBadge status="zablokowany" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Priorytet</label>
            <Select
              value={ticket.priority}
              onValueChange={(val) =>
                setTicket((prev) => ({ ...prev, priority: val as TicketPriority }))
              }
            >
              <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="krytyczny">
                  <PriorityBadge priority="krytyczny" />
                </SelectItem>
                <SelectItem value="wysoki">
                  <PriorityBadge priority="wysoki" />
                </SelectItem>
                <SelectItem value="średni">
                  <PriorityBadge priority="średni" />
                </SelectItem>
                <SelectItem value="niski">
                  <PriorityBadge priority="niski" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Przypisana osoba</label>
            <Select
              value={ticket.assignee?.email ?? 'unassigned'}
              onValueChange={(val) => {
                const found = TEAM_MEMBERS.find((m) => m.email === val) ?? null;
                setTicket((prev) => ({ ...prev, assignee: found }));
                setActivities((prev) => [
                  ...prev,
                  {
                    id: `a-${Date.now()}`,
                    user: 'Zalogowany użytkownik',
                    userAvatarFallback: 'ZU',
                    action: 'przypisał zadanie do',
                    target: found ? found.name : 'Nieprzypisane',
                    time: 'Przed chwilą',
                    timestamp: Date.now(),
                    type: 'assignee',
                  },
                ]);
              }}
            >
              <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="size-3.5" />
                    <span>Nieprzypisane</span>
                  </div>
                </SelectItem>
                {TEAM_MEMBERS.map((member) => (
                  <SelectItem key={member.email} value={member.email}>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5">
                        <AvatarFallback className="text-[10px]">
                          {member.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-xs">{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reporter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Zgłaszający</label>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 text-xs">
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px]">
                  {ticket.reporter.avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{ticket.reporter.name}</p>
                <p className="text-[10px] text-muted-foreground">{ticket.reporter.role}</p>
              </div>
            </div>
          </div>

          {/* Sprint */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Sprint</label>
            <Select
              value={ticket.sprint ?? 'none'}
              onValueChange={(val) =>
                setTicket((prev) => ({ ...prev, sprint: val === 'none' ? null : val }))
              }
            >
              <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sprint-4">Sprint 4 — September (Aktywny)</SelectItem>
                <SelectItem value="sprint-3">Sprint 3 — September</SelectItem>
                <SelectItem value="none">Backlog (Bez sprintu)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Story Points */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Story Points</label>
              <StoryPointsBadge points={ticket.storyPoints} />
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {[1, 2, 3, 5, 8, 13].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setTicket((prev) => ({ ...prev, storyPoints: pts }))}
                  className={cn(
                    'h-7 rounded border text-xs font-medium transition-all cursor-pointer flex items-center justify-center',
                    ticket.storyPoints === pts
                      ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'border-border bg-background hover:bg-muted text-muted-foreground',
                  )}
                >
                  {pts}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3" />
              Termin ukończenia
            </label>
            <Input
              type="date"
              value={ticket.dueDate ?? ''}
              onChange={(e) => setTicket((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="h-8 text-xs bg-background"
            />
          </div>

          {/* Time Tracking */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                Szacowany czas
              </label>
              <span className="font-mono font-medium text-foreground">
                {ticket.timeSpent ?? '0h'} / {ticket.timeEstimate}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[75%]" />
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Tag className="size-3" />
              Etykiety
            </label>
            <div className="flex flex-wrap gap-1">
              {ticket.labels.map((lbl) => (
                <Badge
                  key={lbl}
                  variant="secondary"
                  className="py-0.5 px-2 text-[11px] bg-primary/10 text-primary border-primary/20"
                >
                  {lbl}
                </Badge>
              ))}
            </div>
          </div>

          {/* System metadata */}
          <div className="pt-3 border-t text-[11px] text-muted-foreground space-y-1">
            <p>
              Utworzono:{' '}
              <span className="text-foreground">
                {new Date(ticket.createdAt).toLocaleDateString('pl-PL')}
              </span>
            </p>
            <p>
              Zaktualizowano:{' '}
              <span className="text-foreground">
                {new Date(ticket.updatedAt).toLocaleDateString('pl-PL')}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
