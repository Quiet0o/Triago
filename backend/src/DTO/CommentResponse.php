<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\Comment;

final readonly class CommentResponse
{
    /**
     * @param list<array{emoji: string, count: int, reacted?: bool}> $reactions
     */
    public function __construct(
        public string $id,
        public TicketPersonResponse $author,
        public string $content,
        public ?string $contentHtml,
        public string $createdAt,
        public int $timestamp,
        public array $reactions,
    ) {
    }

    public static function fromEntity(Comment $comment): self
    {
        $authorResponse = TicketPersonResponse::fromUser(
            $comment->getAuthor(),
            $comment->getAuthorName(),
        ) ?? new TicketPersonResponse(
            name: 'Nieznany',
            email: '',
            avatarFallback: 'U',
            role: 'Użytkownik',
        );

        $date = $comment->getCreatedAt();

        return new self(
            id: $comment->getId(),
            author: $authorResponse,
            content: $comment->getContent(),
            contentHtml: $comment->getContentHtml(),
            createdAt: $date->format('Y-m-d H:i'),
            timestamp: $date->getTimestamp() * 1000,
            reactions: $comment->getReactions(),
        );
    }
}
