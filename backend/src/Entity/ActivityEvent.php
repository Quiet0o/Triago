<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ActivityEventRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ActivityEventRepository::class)]
#[ORM\Table(name: 'activity_event')]
class ActivityEvent
{
    #[ORM\Id]
    #[ORM\Column(length: 64)]
    private string $id;

    #[ORM\ManyToOne(targetEntity: Ticket::class, inversedBy: 'activityEvents')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Ticket $ticket;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    private string $userName;

    #[ORM\Column(length: 10)]
    private string $userAvatarFallback = 'U';

    #[ORM\Column(length: 255)]
    private string $action;

    #[ORM\Column(length: 255)]
    private string $target;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $type = 'general'; // status, assignee, created, general

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct(
        string $id,
        Ticket $ticket,
        string $userName,
        string $userAvatarFallback,
        string $action,
        string $target,
        ?string $type = 'general',
        ?User $user = null,
    ) {
        $this->id = $id;
        $this->ticket = $ticket;
        $this->userName = $userName;
        $this->userAvatarFallback = $userAvatarFallback;
        $this->action = $action;
        $this->target = $target;
        $this->type = $type ?? 'general';
        $this->user = $user;
        $this->createdAt = new \DateTimeImmutable();
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getUserName(): string
    {
        return $this->userName;
    }

    public function setUserName(string $userName): static
    {
        $this->userName = $userName;

        return $this;
    }

    public function getUserAvatarFallback(): string
    {
        return $this->userAvatarFallback;
    }

    public function setUserAvatarFallback(string $userAvatarFallback): static
    {
        $this->userAvatarFallback = $userAvatarFallback;

        return $this;
    }

    public function getAction(): string
    {
        return $this->action;
    }

    public function setAction(string $action): static
    {
        $this->action = $action;

        return $this;
    }

    public function getTarget(): string
    {
        return $this->target;
    }

    public function setTarget(string $target): static
    {
        $this->target = $target;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = $type;

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
}
