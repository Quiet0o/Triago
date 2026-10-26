<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\SubtaskRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SubtaskRepository::class)]
#[ORM\Table(name: 'subtask')]
class Subtask
{
    #[ORM\Id]
    #[ORM\Column(length: 64)]
    private string $id;

    #[ORM\ManyToOne(targetEntity: Ticket::class, inversedBy: 'subtasks')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Ticket $ticket;

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(length: 50)]
    private string $status = 'nowy';

    #[ORM\Column(type: 'integer')]
    private int $position = 0;

    public function __construct(string $id, Ticket $ticket, string $title, string $status = 'nowy')
    {
        $this->id = $id;
        $this->ticket = $ticket;
        $this->title = $title;
        $this->status = $status;
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

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

        return $this;
    }
}
