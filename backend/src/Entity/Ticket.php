<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\TicketRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TicketRepository::class)]
#[ORM\Table(name: 'ticket')]
#[ORM\Index(name: 'idx_ticket_status', fields: ['status'])]
#[ORM\Index(name: 'idx_ticket_priority', fields: ['priority'])]
class Ticket
{
    #[ORM\Id]
    #[ORM\Column(length: 64)]
    private string $id;

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(type: Types::TEXT)]
    private string $description;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descriptionHtml = null;

    #[ORM\Column(length: 50)]
    private string $type = 'task'; // bug, task, story, subtask, improvement

    #[ORM\Column(length: 50)]
    private string $priority = 'średni'; // krytyczny, wysoki, średni, niski

    #[ORM\Column(length: 50)]
    private string $status = 'nowy'; // nowy, w_toku, review, testowanie, zamknięty, zablokowany

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?User $assignee = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?User $reporter = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $reporterName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $reporterEmail = null;

    #[ORM\ManyToOne(targetEntity: Sprint::class, inversedBy: 'tickets')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Sprint $sprint = null;

    #[ORM\Column(type: 'integer')]
    private int $storyPoints = 0;

    /**
     * @var list<string>
     */
    #[ORM\Column(type: Types::JSON)]
    private array $labels = [];

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column]
    private \DateTimeImmutable $updatedAt;

    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $dueDate = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $timeEstimate = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $timeSpent = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $blockedBy = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $blockedReason = null;

    #[ORM\Column(type: 'integer')]
    private int $attachmentsCount = 0;

    /**
     * @var Collection<int, Subtask>
     */
    #[ORM\OneToMany(targetEntity: Subtask::class, mappedBy: 'ticket', cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $subtasks;

    /**
     * @var Collection<int, Comment>
     */
    #[ORM\OneToMany(targetEntity: Comment::class, mappedBy: 'ticket', cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $comments;

    /**
     * @var Collection<int, ActivityEvent>
     */
    #[ORM\OneToMany(targetEntity: ActivityEvent::class, mappedBy: 'ticket', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\OrderBy(['createdAt' => 'DESC'])]
    private Collection $activityEvents;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Ticket $parent = null;

    /**
     * @var Collection<int, Ticket>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    private Collection $children;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'epicTickets')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Ticket $epic = null;

    /**
     * @var Collection<int, Ticket>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'epic')]
    private Collection $epicTickets;

    public function __construct(
        string $id,
        string $title,
        string $description,
        string $type = 'task',
        string $priority = 'średni',
        string $status = 'nowy',
        ?User $reporter = null,
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->type = $type;
        $this->priority = $priority;
        $this->status = $status;
        $this->reporter = $reporter;
        if ($reporter) {
            $this->reporterName = $reporter->getFullName() ?? $reporter->getEmail();
            $this->reporterEmail = $reporter->getEmail();
        }
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->labels = [];
        $this->subtasks = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->activityEvents = new ArrayCollection();
        $this->children = new ArrayCollection();
        $this->epicTickets = new ArrayCollection();
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

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDescriptionHtml(): ?string
    {
        return $this->descriptionHtml;
    }

    public function setDescriptionHtml(?string $descriptionHtml): static
    {
        $this->descriptionHtml = $descriptionHtml;

        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getPriority(): string
    {
        return $this->priority;
    }

    public function setPriority(string $priority): static
    {
        $this->priority = $priority;

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

    public function getAssignee(): ?User
    {
        return $this->assignee;
    }

    public function setAssignee(?User $assignee): static
    {
        $this->assignee = $assignee;

        return $this;
    }

    public function getReporter(): ?User
    {
        return $this->reporter;
    }

    public function setReporter(?User $reporter): static
    {
        $this->reporter = $reporter;
        if ($reporter) {
            $this->reporterName = $reporter->getFullName() ?? $reporter->getEmail();
            $this->reporterEmail = $reporter->getEmail();
        }

        return $this;
    }

    public function getReporterName(): ?string
    {
        return $this->reporterName;
    }

    public function setReporterName(?string $reporterName): static
    {
        $this->reporterName = $reporterName;

        return $this;
    }

    public function getReporterEmail(): ?string
    {
        return $this->reporterEmail;
    }

    public function setReporterEmail(?string $reporterEmail): static
    {
        $this->reporterEmail = $reporterEmail;

        return $this;
    }

    public function getSprint(): ?Sprint
    {
        return $this->sprint;
    }

    public function setSprint(?Sprint $sprint): static
    {
        $this->sprint = $sprint;

        return $this;
    }

    public function getStoryPoints(): int
    {
        return $this->storyPoints;
    }

    public function setStoryPoints(int $storyPoints): static
    {
        $this->storyPoints = $storyPoints;

        return $this;
    }

    /**
     * @return list<string>
     */
    public function getLabels(): array
    {
        return $this->labels;
    }

    /**
     * @param list<string> $labels
     */
    public function setLabels(array $labels): static
    {
        $this->labels = $labels;

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

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getDueDate(): ?\DateTimeImmutable
    {
        return $this->dueDate;
    }

    public function setDueDate(?\DateTimeImmutable $dueDate): static
    {
        $this->dueDate = $dueDate;

        return $this;
    }

    public function getTimeEstimate(): ?string
    {
        return $this->timeEstimate;
    }

    public function setTimeEstimate(?string $timeEstimate): static
    {
        $this->timeEstimate = $timeEstimate;

        return $this;
    }

    public function getTimeSpent(): ?string
    {
        return $this->timeSpent;
    }

    public function setTimeSpent(?string $timeSpent): static
    {
        $this->timeSpent = $timeSpent;

        return $this;
    }

    public function getBlockedBy(): ?string
    {
        return $this->blockedBy;
    }

    public function setBlockedBy(?string $blockedBy): static
    {
        $this->blockedBy = $blockedBy;

        return $this;
    }

    public function getBlockedReason(): ?string
    {
        return $this->blockedReason;
    }

    public function setBlockedReason(?string $blockedReason): static
    {
        $this->blockedReason = $blockedReason;

        return $this;
    }

    public function getAttachmentsCount(): int
    {
        return $this->attachmentsCount;
    }

    public function setAttachmentsCount(int $attachmentsCount): static
    {
        $this->attachmentsCount = $attachmentsCount;

        return $this;
    }

    /**
     * @return Collection<int, Subtask>
     */
    public function getSubtasks(): Collection
    {
        return $this->subtasks;
    }

    public function addSubtask(Subtask $subtask): static
    {
        if (!$this->subtasks->contains($subtask)) {
            $this->subtasks->add($subtask);
            $subtask->setTicket($this);
        }

        return $this;
    }

    public function removeSubtask(Subtask $subtask): static
    {
        $this->subtasks->removeElement($subtask);

        return $this;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setTicket($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        $this->comments->removeElement($comment);

        return $this;
    }

    /**
     * @return Collection<int, ActivityEvent>
     */
    public function getActivityEvents(): Collection
    {
        return $this->activityEvents;
    }

    public function addActivityEvent(ActivityEvent $activityEvent): static
    {
        if (!$this->activityEvents->contains($activityEvent)) {
            $this->activityEvents->add($activityEvent);
            $activityEvent->setTicket($this);
        }

        return $this;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): static
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * @return Collection<int, Ticket>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    public function getEpic(): ?self
    {
        return $this->epic;
    }

    public function setEpic(?self $epic): static
    {
        $this->epic = $epic;

        return $this;
    }

    /**
     * @return Collection<int, Ticket>
     */
    public function getEpicTickets(): Collection
    {
        return $this->epicTickets;
    }
}
