<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\CommentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CommentRepository::class)]
#[ORM\Table(name: 'comment')]
class Comment
{
    #[ORM\Id]
    #[ORM\Column(length: 64)]
    private string $id;

    #[ORM\ManyToOne(targetEntity: Ticket::class, inversedBy: 'comments')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Ticket $ticket;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?User $author = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $authorName = null;

    #[ORM\Column(type: Types::TEXT)]
    private string $content;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $contentHtml = null;

    /**
     * @var list<array{emoji: string, count: int, reacted?: bool}>
     */
    #[ORM\Column(type: Types::JSON)]
    private array $reactions = [];

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct(string $id, Ticket $ticket, ?User $author, string $content)
    {
        $this->id = $id;
        $this->ticket = $ticket;
        $this->author = $author;
        if ($author) {
            $this->authorName = $author->getFullName() ?? $author->getEmail();
        }
        $this->content = $content;
        $this->createdAt = new \DateTimeImmutable();
        $this->reactions = [];
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getTicket(): Ticket
    {
        return $this->ticket;
    }

    public function setTicket(Ticket $ticket): static
    {
        $this->ticket = $ticket;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;
        if ($author) {
            $this->authorName = $author->getFullName() ?? $author->getEmail();
        }

        return $this;
    }

    public function getAuthorName(): ?string
    {
        return $this->authorName;
    }

    public function setAuthorName(?string $authorName): static
    {
        $this->authorName = $authorName;

        return $this;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getContentHtml(): ?string
    {
        return $this->contentHtml;
    }

    public function setContentHtml(?string $contentHtml): static
    {
        $this->contentHtml = $contentHtml;

        return $this;
    }

    /**
     * @return list<array{emoji: string, count: int, reacted?: bool}>
     */
    public function getReactions(): array
    {
        return $this->reactions;
    }

    /**
     * @param list<array{emoji: string, count: int, reacted?: bool}> $reactions
     */
    public function setReactions(array $reactions): static
    {
        $this->reactions = $reactions;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
