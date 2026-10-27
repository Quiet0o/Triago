<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\CreateCommentRequest;
use App\DTO\CreateSubtaskRequest;
use App\DTO\CreateTicketRequest;
use App\DTO\UpdateSubtaskRequest;
use App\DTO\UpdateTicketRequest;
use App\Entity\ActivityEvent;
use App\Entity\Comment;
use App\Entity\Subtask;
use App\Entity\Ticket;
use App\Entity\User;
use App\Repository\SprintRepository;
use App\Repository\TicketRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

final class TicketService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TicketRepository $ticketRepository,
        private readonly UserRepository $userRepository,
        private readonly SprintRepository $sprintRepository,
    ) {
    }

    public function createTicket(CreateTicketRequest $request, ?User $currentUser): Ticket
    {
        $id = $this->ticketRepository->generateNextTicketId('TRG');

        $ticket = new Ticket(
            id: $id,
            title: $request->title,
            description: $request->description,
            type: $request->type,
            priority: $request->priority,
            status: $request->status,
            reporter: $currentUser,
        );

        $ticket->setDescriptionHtml($request->descriptionHtml);
        $ticket->setStoryPoints($request->storyPoints);
        $ticket->setLabels($request->labels);

        if ($request->dueDate) {
            $ticket->setDueDate(new \DateTimeImmutable($request->dueDate));
        }

        if ($request->timeEstimate) {
            $ticket->setTimeEstimate($request->timeEstimate);
        }

        if ($request->assigneeEmail) {
            $assignee = $this->userRepository->findOneBy(['email' => $request->assigneeEmail]);
            if ($assignee) {
                $ticket->setAssignee($assignee);
            }
        }

        if ($request->sprintId && 'none' !== $request->sprintId) {
            $sprint = $this->sprintRepository->find($request->sprintId);
            if ($sprint) {
                $ticket->setSprint($sprint);
            }
        }

        if ($request->parentId) {
            $parent = $this->ticketRepository->find($request->parentId);
            if ($parent) {
                $ticket->setParent($parent);
            }
        }

        if ($request->epicId) {
            $epic = $this->ticketRepository->find($request->epicId);
            if ($epic) {
                $ticket->setEpic($epic);
            }
        }

        // Add subtasks if any
        $index = 1;
        foreach ($request->subtasks as $subtaskTitle) {
            if ('' !== trim($subtaskTitle)) {
                $subtaskId = sprintf('%s-%d', $ticket->getId(), $index++);
                $subtask = new Subtask($subtaskId, $ticket, trim($subtaskTitle), 'nowy');
                $subtask->setPosition($index);
                $ticket->addSubtask($subtask);
            }
        }

        // Add creation activity event
        $userName = $currentUser?->getFullName() ?? $currentUser?->getEmail() ?? 'System';
        $userAvatar = $currentUser?->getAvatarFallback() ?? 'SY';
        $activity = new ActivityEvent(
            id: (string) Uuid::v7(),
            ticket: $ticket,
            userName: $userName,
            userAvatarFallback: $userAvatar,
            action: 'utworzył(a) zadanie',
            target: $ticket->getId(),
            type: 'created',
            user: $currentUser,
        );
        $ticket->addActivityEvent($activity);

        $this->entityManager->persist($ticket);
        $this->entityManager->flush();

        return $ticket;
    }

    public function updateTicket(Ticket $ticket, UpdateTicketRequest $request, ?User $currentUser): Ticket
    {
        $userName = $currentUser?->getFullName() ?? $currentUser?->getEmail() ?? 'Użytkownik';
        $userAvatar = $currentUser?->getAvatarFallback() ?? 'U';

        if (null !== $request->title && $request->title !== $ticket->getTitle()) {
            $ticket->setTitle($request->title);
        }

        if (null !== $request->description) {
            $ticket->setDescription($request->description);
        }

        if (null !== $request->descriptionHtml) {
            $ticket->setDescriptionHtml($request->descriptionHtml);
        }

        if (null !== $request->type && $request->type !== $ticket->getType()) {
            $ticket->setType($request->type);
        }

        if (null !== $request->priority && $request->priority !== $ticket->getPriority()) {
            $oldPriority = $ticket->getPriority();
            $ticket->setPriority($request->priority);
            $ticket->addActivityEvent(new ActivityEvent(
                id: (string) Uuid::v7(),
                ticket: $ticket,
                userName: $userName,
                userAvatarFallback: $userAvatar,
                action: sprintf('zmienił(a) priorytet z %s na', $oldPriority),
                target: $request->priority,
                type: 'general',
                user: $currentUser,
            ));
        }

        if (null !== $request->status && $request->status !== $ticket->getStatus()) {
            $ticket->setStatus($request->status);
            $ticket->addActivityEvent(new ActivityEvent(
                id: (string) Uuid::v7(),
                ticket: $ticket,
                userName: $userName,
                userAvatarFallback: $userAvatar,
                action: 'zmienił(a) status na',
                target: $request->status,
                type: 'status',
                user: $currentUser,
            ));
        }

        if (null !== $request->assigneeEmail) {
            if ('' === $request->assigneeEmail || 'unassigned' === $request->assigneeEmail) {
                $ticket->setAssignee(null);
                $ticket->addActivityEvent(new ActivityEvent(
                    id: (string) Uuid::v7(),
                    ticket: $ticket,
                    userName: $userName,
                    userAvatarFallback: $userAvatar,
                    action: 'usunął(ęła) przypisanie do zadania',
                    target: '',
                    type: 'assignee',
                    user: $currentUser,
                ));
            } else {
                $assignee = $this->userRepository->findOneBy(['email' => $request->assigneeEmail]);
                if ($assignee) {
                    $ticket->setAssignee($assignee);
                    $ticket->addActivityEvent(new ActivityEvent(
                        id: (string) Uuid::v7(),
                        ticket: $ticket,
                        userName: $userName,
                        userAvatarFallback: $userAvatar,
                        action: 'przypisał(a) zadanie do',
                        target: $assignee->getFullName() ?? (string) $assignee->getEmail(),
                        type: 'assignee',
                        user: $currentUser,
                    ));
                }
            }
        }

        if (null !== $request->sprintId) {
            if ('' === $request->sprintId || 'none' === $request->sprintId) {
                $ticket->setSprint(null);
            } else {
                $sprint = $this->sprintRepository->find($request->sprintId);
                if ($sprint) {
                    $ticket->setSprint($sprint);
                }
            }
        }

        if (null !== $request->parentId) {
            if ('' === $request->parentId || 'none' === $request->parentId) {
                $ticket->setParent(null);
            } else {
                $parent = $this->ticketRepository->find($request->parentId);
                if ($parent && $parent->getId() !== $ticket->getId()) {
                    $ticket->setParent($parent);
                }
            }
        }

        if (null !== $request->epicId) {
            if ('' === $request->epicId || 'none' === $request->epicId) {
                $ticket->setEpic(null);
            } else {
                $epic = $this->ticketRepository->find($request->epicId);
                if ($epic && $epic->getId() !== $ticket->getId()) {
                    $ticket->setEpic($epic);
                }
            }
        }

        if (null !== $request->storyPoints) {
            $ticket->setStoryPoints($request->storyPoints);
        }

        if (null !== $request->labels) {
            $ticket->setLabels($request->labels);
        }

        if (null !== $request->dueDate) {
            $ticket->setDueDate('' !== $request->dueDate ? new \DateTimeImmutable($request->dueDate) : null);
        }

        if (null !== $request->timeEstimate) {
            $ticket->setTimeEstimate($request->timeEstimate);
        }

        if (null !== $request->timeSpent) {
            $ticket->setTimeSpent($request->timeSpent);
        }

        if (null !== $request->blockedBy) {
            $ticket->setBlockedBy($request->blockedBy);
        }

        if (null !== $request->blockedReason) {
            $ticket->setBlockedReason($request->blockedReason);
        }

        if (null !== $request->position) {
            $ticket->setPosition($request->position);
        }

        if (null !== $request->rank) {
            $ticket->setRank($request->rank);
        }

        $ticket->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $ticket;
    }

    /**
     * @param list<array{id: string, status?: string|null, position?: int|null, rank?: string|null}> $items
     *
     * @return list<Ticket>
     */
    public function reorderTickets(array $items, ?User $currentUser): array
    {
        $userName = $currentUser?->getFullName() ?? $currentUser?->getEmail() ?? 'Użytkownik';
        $userAvatar = $currentUser?->getAvatarFallback() ?? 'U';

        $updatedTickets = [];

        foreach ($items as $item) {
            $ticket = $this->ticketRepository->find($item['id']);
            if (!$ticket) {
                continue;
            }

            if (!empty($item['status']) && $item['status'] !== $ticket->getStatus()) {
                $oldStatus = $ticket->getStatus();
                $ticket->setStatus($item['status']);
                $ticket->addActivityEvent(new ActivityEvent(
                    id: (string) Uuid::v7(),
                    ticket: $ticket,
                    userName: $userName,
                    userAvatarFallback: $userAvatar,
                    action: sprintf('przeniósł(osła) zadanie z %s do', $oldStatus),
                    target: $item['status'],
                    type: 'status',
                    user: $currentUser,
                ));
            }

            if (!empty($item['rank'])) {
                $ticket->setRank($item['rank']);
            }

            if (isset($item['position'])) {
                $ticket->setPosition($item['position']);
            }

            $ticket->setUpdatedAt(new \DateTimeImmutable());
            $updatedTickets[] = $ticket;
        }

        $this->entityManager->flush();

        return $updatedTickets;
    }

    public function addComment(Ticket $ticket, CreateCommentRequest $request, ?User $currentUser): Comment
    {
        $comment = new Comment(
            id: 'c'.(string) Uuid::v7(),
            ticket: $ticket,
            author: $currentUser,
            content: $request->content,
        );

        $comment->setContentHtml($request->contentHtml);

        $ticket->addComment($comment);

        $userName = $currentUser?->getFullName() ?? $currentUser?->getEmail() ?? 'Użytkownik';
        $userAvatar = $currentUser?->getAvatarFallback() ?? 'U';
        $activity = new ActivityEvent(
            id: (string) Uuid::v7(),
            ticket: $ticket,
            userName: $userName,
            userAvatarFallback: $userAvatar,
            action: 'dodał(a) komentarz do',
            target: $ticket->getId(),
            type: 'general',
            user: $currentUser,
        );
        $ticket->addActivityEvent($activity);

        $this->entityManager->persist($comment);
        $this->entityManager->flush();

        return $comment;
    }

    public function addSubtask(Ticket $ticket, CreateSubtaskRequest $request): Subtask
    {
        $count = $ticket->getSubtasks()->count();
        $subtaskId = sprintf('%s-%d', $ticket->getId(), $count + 1);

        $subtask = new Subtask(
            id: $subtaskId,
            ticket: $ticket,
            title: $request->title,
            status: $request->status,
        );
        $subtask->setPosition($count + 1);

        $ticket->addSubtask($subtask);
        $ticket->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($subtask);
        $this->entityManager->flush();

        return $subtask;
    }

    public function updateSubtask(Ticket $ticket, string $subtaskId, UpdateSubtaskRequest $request): ?Subtask
    {
        foreach ($ticket->getSubtasks() as $subtask) {
            if ($subtask->getId() === $subtaskId) {
                if (null !== $request->title) {
                    $subtask->setTitle($request->title);
                }
                if (null !== $request->status) {
                    $subtask->setStatus($request->status);
                }
                $ticket->setUpdatedAt(new \DateTimeImmutable());
                $this->entityManager->flush();

                return $subtask;
            }
        }

        return null;
    }

    public function deleteSubtask(Ticket $ticket, string $subtaskId): bool
    {
        foreach ($ticket->getSubtasks() as $subtask) {
            if ($subtask->getId() === $subtaskId) {
                $ticket->removeSubtask($subtask);
                $this->entityManager->remove($subtask);
                $ticket->setUpdatedAt(new \DateTimeImmutable());
                $this->entityManager->flush();

                return true;
            }
        }

        return false;
    }
}
