'use client';

import * as React from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Edit3, Loader2 } from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import type {
  ActivityEvent,
  Comment,
  Ticket,
  TicketPerson,
  TicketPriority,
  TicketStatus,
  TicketType,
} from '#/types/tickets';
import { ticketQueries } from '../queries';
import { TEAM_MEMBERS } from '../api';
import { TicketDetailHeader } from './detail/ticket-detail-header';
import { TicketDescriptionSection } from './detail/ticket-description-section';
import { TicketSubtasksSection } from './detail/ticket-subtasks-section';
import type { AttachmentItem } from './detail/ticket-attachments-section';
import { TicketAttachmentsSection } from './detail/ticket-attachments-section';
import type { ActivityTab, SortOrder } from './detail/ticket-activity-feed';
import { TicketActivityFeed } from './detail/ticket-activity-feed';
import { TicketSidebar } from './detail/ticket-sidebar';

const INITIAL_ATTACHMENTS: AttachmentItem[] = [
  { id: 'att-1', name: 'smtp_error_log_2026-09-17.txt', size: '24.5 KB', type: 'text' },
  { id: 'att-2', name: 'error_screenshot_modal.png', size: '412.8 KB', type: 'image' },
];

export interface TicketDetailViewProps {
  ticketId: string;
}

export function TicketDetailView({ ticketId }: TicketDetailViewProps) {
  const navigate = useNavigate();

  // 1. TanStack Query with skipToken and typed queryOptions
  const {
    data: fetchedTicket,
    isLoading,
    isError,
    error,
  } = useQuery(ticketQueries.detail(ticketId ? ticketId : skipToken));

  const { data: sprints = [] } = useQuery(ticketQueries.sprints());
  const { data: fetchedComments = [] } = useQuery(
    ticketQueries.comments(ticketId ? ticketId : skipToken),
  );
  const { data: fetchedActivities = [] } = useQuery(
    ticketQueries.activities(ticketId ? ticketId : skipToken),
  );

  // Local state for active editing and interactions
  const [ticket, setTicket] = React.useState<Ticket | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [activities, setActivities] = React.useState<ActivityEvent[]>([]);
  const [attachments, setAttachments] = React.useState<AttachmentItem[]>(INITIAL_ATTACHMENTS);

  // Feed & view state
  const [activeTab, setActiveTab] = React.useState<ActivityTab>('all');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc');
  const [copiedKey, setCopiedKey] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Title inline editing state
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleDraft, setTitleDraft] = React.useState('');

  // Description inline editing state
  const [isEditingDesc, setIsEditingDesc] = React.useState(false);
  const [descDraft, setDescDraft] = React.useState('');
  const [descHtmlDraft, setDescHtmlDraft] = React.useState('');

  // Sync query data to local state when loaded
  React.useEffect(() => {
    if (fetchedTicket) {
      setTicket(fetchedTicket);
      setTitleDraft(fetchedTicket.title);
      setDescDraft(fetchedTicket.description);
      setDescHtmlDraft(fetchedTicket.descriptionHtml ?? '');
    }
  }, [fetchedTicket]);

  React.useEffect(() => {
    if (fetchedComments.length > 0) {
      setComments(fetchedComments);
    }
  }, [fetchedComments]);

  React.useEffect(() => {
    if (fetchedActivities.length > 0) {
      setActivities(fetchedActivities);
    }
  }, [fetchedActivities]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Ładowanie szczegółów zadania...</p>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 p-6 text-center">
        <p className="text-sm font-semibold text-destructive">
          {error?.message || 'Nie udało się załadować zadania.'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/project/backlog' })}
          className="gap-2 text-xs cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          Powrót do backlogu
        </Button>
      </div>
    );
  }

  // Handlers
  const handleCopyKey = () => {
    navigator.clipboard.writeText(ticket.id);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveTitle = () => {
    if (titleDraft.trim()) {
      setTicket((prev) => (prev ? { ...prev, title: titleDraft.trim() } : prev));
    }
    setIsEditingTitle(false);
  };

  const handleSaveDesc = () => {
    setTicket((prev) =>
      prev
        ? {
            ...prev,
            description:
              descDraft.trim() ||
              (descHtmlDraft.includes('<img') ? 'Załączono zdjęcie w opisie' : ''),
            descriptionHtml: descHtmlDraft.trim() || undefined,
          }
        : prev,
    );
    setIsEditingDesc(false);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setTicket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subtasks: prev.subtasks.map((st) =>
          st.id === subtaskId
            ? {
                ...st,
                status: st.status === 'zamknięty' ? 'nowy' : 'zamknięty',
              }
            : st,
        ),
      };
    });
  };

  const handleAddSubtask = (title: string) => {
    const nextId = `${ticket.id}-${ticket.subtasks.length + 1}`;
    setTicket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subtasks: [...prev.subtasks, { id: nextId, title, status: 'nowy' }],
      };
    });
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  const handleAddAttachment = (file: File) => {
    const newAtt: AttachmentItem = {
      id: `att-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type.startsWith('image/') ? 'image' : 'file',
    };
    setAttachments((prev) => [...prev, newAtt]);
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

  const handleTypeChange = (type: TicketType) => {
    setTicket((prev) => (prev ? { ...prev, type } : prev));
  };

  const handleStatusChange = (status: TicketStatus) => {
    setTicket((prev) => (prev ? { ...prev, status } : prev));
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
        target: statusNames[status],
        time: 'Przed chwilą',
        timestamp: Date.now(),
        type: 'status',
      },
    ]);
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    setTicket((prev) => (prev ? { ...prev, priority } : prev));
  };

  const handleAssigneeChange = (assignee: TicketPerson | null) => {
    setTicket((prev) => (prev ? { ...prev, assignee } : prev));
    setActivities((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        user: 'Zalogowany użytkownik',
        userAvatarFallback: 'ZU',
        action: 'przypisał zadanie do',
        target: assignee ? assignee.name : 'Nieprzypisane',
        time: 'Przed chwilą',
        timestamp: Date.now(),
        type: 'assignee',
      },
    ]);
  };

  const handleSprintChange = (sprint: string | null) => {
    setTicket((prev) => (prev ? { ...prev, sprint } : prev));
  };

  const handleStoryPointsChange = (storyPoints: number) => {
    setTicket((prev) => (prev ? { ...prev, storyPoints } : prev));
  };

  const handleDueDateChange = (dueDate: string) => {
    setTicket((prev) => (prev ? { ...prev, dueDate } : prev));
  };

  const activeSprint = sprints.find((s) => s.id === ticket.sprint);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      {/* ── Header Bar ───────────────────────────────────────────── */}
      <TicketDetailHeader
        ticket={ticket}
        sprintName={activeSprint?.name ?? 'Sprint 4'}
        copiedKey={copiedKey}
        copiedLink={copiedLink}
        onCopyKey={handleCopyKey}
        onCopyLink={handleCopyLink}
      />

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

          {/* Description Section with ProseKit */}
          <TicketDescriptionSection
            ticket={ticket}
            isEditingDesc={isEditingDesc}
            descDraft={descDraft}
            descHtmlDraft={descHtmlDraft}
            onStartEdit={() => setIsEditingDesc(true)}
            onCancelEdit={() => {
              setDescDraft(ticket.description);
              setDescHtmlDraft(ticket.descriptionHtml ?? '');
              setIsEditingDesc(false);
            }}
            onSave={handleSaveDesc}
            onDraftChange={(text, html) => {
              setDescDraft(text);
              setDescHtmlDraft(html);
            }}
          />

          {/* Subtasks / Acceptance Criteria Section */}
          <TicketSubtasksSection
            subtasks={ticket.subtasks}
            onToggleSubtask={handleToggleSubtask}
            onAddSubtask={handleAddSubtask}
          />

          {/* Attachments Section */}
          <TicketAttachmentsSection
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
            onAddAttachment={handleAddAttachment}
          />

          {/* Activity, Comments, and History Feed */}
          <TicketActivityFeed
            comments={comments}
            activities={activities}
            activeTab={activeTab}
            sortOrder={sortOrder}
            onTabChange={setActiveTab}
            onSortOrderChange={setSortOrder}
            onToggleReaction={handleToggleReaction}
            onAddComment={handleAddComment}
          />
        </div>

        {/* ──── Right Column: Ticket Properties ─────────────────── */}
        <TicketSidebar
          ticket={ticket}
          teamMembers={TEAM_MEMBERS}
          sprints={sprints}
          onTypeChange={handleTypeChange}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onAssigneeChange={handleAssigneeChange}
          onSprintChange={handleSprintChange}
          onStoryPointsChange={handleStoryPointsChange}
          onDueDateChange={handleDueDateChange}
        />
      </div>
    </div>
  );
}
