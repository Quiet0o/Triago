import { Link } from '@tanstack/react-router';
import { cn } from '#/lib/utils';
import { Avatar, AvatarFallback } from '#/components/ui/avatar.tsx';
import { Badge } from '#/components/ui/badge.tsx';
import type { Comment } from '#/types/tickets';
import { EmojiPickerPopover } from './emoji-picker-popover';

export interface CommentCardProps {
  comment: Comment;
  onToggleReaction: (commentId: string, emoji: string) => void;
}

export function CommentCard({ comment, onToggleReaction }: CommentCardProps) {
  return (
    <div className="flex gap-3 text-sm group relative">
      <Link
        to="/project/profile/$userId"
        params={{ userId: comment.author.email }}
        className="shrink-0 hover:opacity-85 transition-opacity cursor-pointer"
        title={`Profil użytkownika: ${comment.author.name}`}
      >
        <Avatar className="size-8">
          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
            {comment.author.avatarFallback}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/project/profile/$userId"
            params={{ userId: comment.author.email }}
            className="font-semibold text-xs text-foreground hover:text-primary hover:underline cursor-pointer"
            title={`Profil: ${comment.author.name}`}
          >
            {comment.author.name}
          </Link>
          <span className="text-[10px] text-muted-foreground">•</span>
          <span className="text-[11px] text-muted-foreground">{comment.createdAt}</span>
          <Badge variant="outline" className="text-[9px] h-4 px-1.5 py-0 font-normal">
            {comment.author.role}
          </Badge>
        </div>

        {/* Floating quick reaction bar on hover */}
        <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-0.5 bg-background/95 backdrop-blur-xs border border-border/80 rounded-full px-1.5 py-0.5 shadow-xs z-10 transition-all">
          <button
            type="button"
            onClick={() => onToggleReaction(comment.id, '👍')}
            className="size-6 flex items-center justify-center text-xs rounded-full hover:bg-muted transition-transform hover:scale-120 cursor-pointer"
            title="Kciuk w górę (👍)"
          >
            👍
          </button>
          <button
            type="button"
            onClick={() => onToggleReaction(comment.id, '❤️')}
            className="size-6 flex items-center justify-center text-xs rounded-full hover:bg-muted transition-transform hover:scale-120 cursor-pointer"
            title="Serce (❤️)"
          >
            ❤️
          </button>
          <button
            type="button"
            onClick={() => onToggleReaction(comment.id, '🎉')}
            className="size-6 flex items-center justify-center text-xs rounded-full hover:bg-muted transition-transform hover:scale-120 cursor-pointer"
            title="Tada (🎉)"
          >
            🎉
          </button>
          <div className="w-px h-3 bg-border/60 my-auto mx-0.5" />
          <EmojiPickerPopover
            onSelectEmoji={(emoji) => onToggleReaction(comment.id, emoji)}
            variant="icon"
          />
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

        {/* Reactions row */}
        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
          {comment.reactions.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onToggleReaction(comment.id, r.emoji)}
              className={cn(
                'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-all cursor-pointer',
                r.reacted
                  ? 'bg-primary/10 border-primary/30 text-primary font-semibold shadow-2xs'
                  : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span className="text-xs">{r.emoji}</span>
              <span>{r.count}</span>
            </button>
          ))}

          <EmojiPickerPopover
            onSelectEmoji={(emoji) => onToggleReaction(comment.id, emoji)}
            hasReactions={comment.reactions.length > 0}
          />
        </div>
      </div>
    </div>
  );
}
