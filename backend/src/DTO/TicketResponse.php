<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\Ticket;

final readonly class TicketResponse
{
    /**
     * @param list<string>          $labels
     * @param list<SubtaskResponse> $subtasks
     */
    public function __construct(
        public string $id,
        public string $title,
        public string $description,
        public ?string $descriptionHtml,
        public string $type,
        public string $priority,
        public string $status,
        public ?TicketPersonResponse $assignee,
        public TicketPersonResponse $reporter,
        public ?string $sprint,
        public int $storyPoints,
        public array $labels,
        public string $createdAt,
        public string $updatedAt,
        public ?string $dueDate,
        public string $timeEstimate,
        public ?string $timeSpent,
        public array $subtasks,
        public int $comments,
        public int $attachments,
        public ?string $blockedBy = null,
        public ?string $blockedReason = null,
        public ?string $parentId = null,
        public ?string $parentTitle = null,
        public ?string $epicId = null,
        public ?string $epicTitle = null,
        public int $childTicketsCount = 0,
        public int $epicTicketsCount = 0,
    ) {
    }

    public static function fromEntity(Ticket $ticket): self
    {
        $reporterResponse = TicketPersonResponse::fromUser(
            $ticket->getReporter(),
            $ticket->getReporterName(),
            $ticket->getReporterEmail(),
        ) ?? new TicketPersonResponse(
            name: 'Nieznany',
            email: '',
            avatarFallback: 'U',
            role: 'Zgłaszający',
        );

        $assigneeResponse = TicketPersonResponse::fromUser($ticket->getAssignee());

        $subtasks = [];
        foreach ($ticket->getSubtasks() as $subtask) {
            $subtasks[] = SubtaskResponse::fromEntity($subtask);
        }

        return new self(
            id: $ticket->getId(),
            title: $ticket->getTitle(),
            description: $ticket->getDescription(),
            descriptionHtml: $ticket->getDescriptionHtml(),
            type: $ticket->getType(),
            priority: $ticket->getPriority(),
            status: $ticket->getStatus(),
            assignee: $assigneeResponse,
            reporter: $reporterResponse,
            sprint: $ticket->getSprint()?->getId(),
            storyPoints: $ticket->getStoryPoints(),
            labels: $ticket->getLabels(),
            createdAt: $ticket->getCreatedAt()->format(\DateTimeInterface::ATOM),
            updatedAt: $ticket->getUpdatedAt()->format(\DateTimeInterface::ATOM),
            dueDate: $ticket->getDueDate()?->format('Y-m-d'),
            timeEstimate: $ticket->getTimeEstimate() ?? '0h',
            timeSpent: $ticket->getTimeSpent(),
            subtasks: $subtasks,
            comments: $ticket->getComments()->count(),
            attachments: $ticket->getAttachmentsCount(),
            blockedBy: $ticket->getBlockedBy(),
            blockedReason: $ticket->getBlockedReason(),
            parentId: $ticket->getParent()?->getId(),
            parentTitle: $ticket->getParent()?->getTitle(),
            epicId: $ticket->getEpic()?->getId(),
            epicTitle: $ticket->getEpic()?->getTitle(),
            childTicketsCount: $ticket->getChildren()->count(),
            epicTicketsCount: $ticket->getEpicTickets()->count(),
        );
    }
}
