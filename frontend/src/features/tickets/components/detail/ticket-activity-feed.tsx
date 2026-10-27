'use client';

import * as React from 'react';
import { Activity, ArrowUpDown, History, MessageSquare } from 'lucide-react';
import { cn } from '#/lib/utils';
import { Button } from '#/components/ui/button.tsx';
import type { ActivityEvent, Comment } from '#/types/tickets';
import { CommentCard } from './comment-card';
import { ActivityRow } from './activity-row';
import { CommentComposer } from './comment-composer';

export type ActivityTab = 'all' | 'comments' | 'history';
export type SortOrder = 'desc' | 'asc';

export interface FeedItem {
  kind: 'comment' | 'activity';
  id: string;
  timestamp: number;
  data: Comment | ActivityEvent;
}

export interface TicketActivityFeedProps {
  comments: Comment[];
  activities: ActivityEvent[];
  activeTab: ActivityTab;
  sortOrder: SortOrder;
  onTabChange: (tab: ActivityTab) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onToggleReaction: (commentId: string, emoji: string) => void;
  onAddComment: (text: string, html: string) => void;
}

export function TicketActivityFeed({
  comments,
  activities,
  activeTab,
  sortOrder,
  onTabChange,
  onSortOrderChange,
  onToggleReaction,
  onAddComment,
}: TicketActivityFeedProps) {
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

  return (
    <div className="rounded-xl border bg-card p-5 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b pb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onTabChange('all')}
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
            onClick={() => onTabChange('comments')}
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
            onClick={() => onTabChange('history')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
              activeTab === 'history'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
          >
            <History className="size-3.5" />
            <span>Historia zmian ({activities.length})</span>
          </button>
        </div>

        {/* Chronological order toggle button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
          title="Zmień kierunek sortowania"
        >
          <ArrowUpDown className="size-3" />
          <span className="hidden sm:inline">
            {sortOrder === 'desc' ? 'Od najnowszych' : 'Od najstarszych'}
          </span>
        </Button>
      </div>

      {/* TAB: Wszystko (połączone chronologicznie) */}
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
                    comment={item.data as Comment}
                    onToggleReaction={onToggleReaction}
                  />
                ) : (
                  <ActivityRow key={item.id} activity={item.data as ActivityEvent} />
                ),
              )}
            </div>
          )}

          {/* Comment Composer */}
          <CommentComposer onSubmit={onAddComment} />
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
                <CommentCard key={c.id} comment={c} onToggleReaction={onToggleReaction} />
              ))}
            </div>
          )}

          {/* Comment Composer */}
          <CommentComposer onSubmit={onAddComment} />
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
            sortedActivities.map((a) => <ActivityRow key={a.id} activity={a} />)
          )}
        </div>
      )}
    </div>
  );
}
