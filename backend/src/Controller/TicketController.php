<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\ActivityEventResponse;
use App\DTO\CommentResponse;
use App\DTO\CreateCommentRequest;
use App\DTO\CreateSubtaskRequest;
use App\DTO\CreateTicketRequest;
use App\DTO\SubtaskResponse;
use App\DTO\TicketFilterQuery;
use App\DTO\TicketResponse;
use App\DTO\UpdateSubtaskRequest;
use App\DTO\UpdateTicketRequest;
use App\Entity\Ticket;
use App\Entity\User;
use App\Repository\TicketRepository;
use App\Service\TicketService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/tickets', name: 'api_tickets_')]
final class TicketController extends AbstractController
{
    public function __construct(
        private readonly TicketRepository $ticketRepository,
        private readonly TicketService $ticketService,
    ) {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(
        #[MapQueryString] ?TicketFilterQuery $query = null,
    ): JsonResponse {
        $tickets = $this->ticketRepository->findByFilters(
            status: $query?->status,
            priority: $query?->priority,
            sprint: $query?->sprint,
            search: $query?->search,
        );

        $response = array_map(
            static fn (Ticket $ticket): TicketResponse => TicketResponse::fromEntity($ticket),
            $tickets,
        );

        return $this->json($response);
    }

    #[Route('/reorder', name: 'reorder', methods: ['POST'])]
    public function reorder(
        Request $request,
        #[CurrentUser] ?User $currentUser = null,
    ): JsonResponse {
        /** @var array{items?: list<array{id: string, status?: string|null, position?: int|null, rank?: string|null}>} $data */
        $data = json_decode($request->getContent(), true) ?? [];
        $items = $data['items'] ?? [];

        $tickets = $this->ticketService->reorderTickets($items, $currentUser);

        $response = array_map(
            static fn (Ticket $ticket): TicketResponse => TicketResponse::fromEntity($ticket),
            $tickets,
        );

        return $this->json($response);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(string $id): JsonResponse
    {
        $ticket = $this->ticketRepository->findWithDetails($id);

        if (!$ticket) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Zadanie o identyfikatorze %s nie zostało odnalezione.', $id),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json(TicketResponse::fromEntity($ticket));
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] CreateTicketRequest $request,
        #[CurrentUser] ?User $currentUser = null,
    ): JsonResponse {
        $ticket = $this->ticketService->createTicket($request, $currentUser);

        return $this->json(
            TicketResponse::fromEntity($ticket),
            Response::HTTP_CREATED,
        );
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    public function update(
        string $id,
        #[MapRequestPayload] UpdateTicketRequest $request,
        #[CurrentUser] ?User $currentUser = null,
    ): JsonResponse {
        $ticket = $this->ticketRepository->findWithDetails($id);

        if (!$ticket) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Zadanie o identyfikatorze %s nie zostało odnalezione.', $id),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        $updated = $this->ticketService->updateTicket($ticket, $request, $currentUser);

        return $this->json(TicketResponse::fromEntity($updated));
    }

    #[Route('/{id}/comments', name: 'comments_list', methods: ['GET'])]
    public function comments(string $id): JsonResponse
    {
        $ticket = $this->ticketRepository->findWithDetails($id);

        if (!$ticket) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Zadanie o identyfikatorze %s nie zostało odnalezione.', $id),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        $comments = [];
        foreach ($ticket->getComments() as $comment) {
            $comments[] = CommentResponse::fromEntity($comment);
        }

        return $this->json($comments);
    }

    #[Route('/{id}/comments', name: 'comments_create', methods: ['POST'])]
    public function addComment(
        string $id,
        #[MapRequestPayload] CreateCommentRequest $request,
        #[CurrentUser] ?User $currentUser = null,
    ): JsonResponse {
        $ticket = $this->ticketRepository->findWithDetails($id);

        if (!$ticket) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Zadanie o identyfikatorze %s nie zostało odnalezione.', $id),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        $comment = $this->ticketService->addComment($ticket, $request, $currentUser);

        return $this->json(
            CommentResponse::fromEntity($comment),
            Response::HTTP_CREATED,
        );
    }

    #[Route('/{id}/activities', name: 'activities_list', methods: ['GET'])]
    public function activities(string $id): JsonResponse
    {
        $ticket = $this->ticketRepository->findWithDetails($id);

        if (!$ticket) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Zadanie o identyfikatorze %s nie zostało odnalezione.', $id),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        $events = [];
        foreach ($ticket->getActivityEvents() as $event) {
            $events[] = ActivityEventResponse::fromEntity($event);
        }

        return $this->json($events);
    }

    #[Route('/{id}/subtasks', name: 'subtasks_create', methods: ['POST'])]
    public function addSubtask(
        string $id,
        #[MapRequestPayload] CreateSubtaskRequest $request,
    ): JsonResponse {
        $ticket = $this->ticketRepository->findWithDetails($id);

        if (!$ticket) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Zadanie o identyfikatorze %s nie zostało odnalezione.', $id),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        $subtask = $this->ticketService->addSubtask($ticket, $request);

        return $this->json(
            SubtaskResponse::fromEntity($subtask),
            Response::HTTP_CREATED,
        );
    }

    #[Route('/{id}/subtasks/{subtaskId}', name: 'subtasks_update', methods: ['PATCH'])]
    public function updateSubtask(
        string $id,
        string $subtaskId,
        #[MapRequestPayload] UpdateSubtaskRequest $request,
    ): JsonResponse {
        $ticket = $this->ticketRepository->findWithDetails($id);

        if (!$ticket) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Zadanie o identyfikatorze %s nie zostało odnalezione.', $id),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        $subtask = $this->ticketService->updateSubtask($ticket, $subtaskId, $request);

        if (!$subtask) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Podzadanie %s nie zostało odnalezione.', $subtaskId),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json(SubtaskResponse::fromEntity($subtask));
    }

    #[Route('/{id}/subtasks/{subtaskId}', name: 'subtasks_delete', methods: ['DELETE'])]
    public function deleteSubtask(
        string $id,
        string $subtaskId,
    ): JsonResponse {
        $ticket = $this->ticketRepository->findWithDetails($id);

        if (!$ticket) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Zadanie o identyfikatorze %s nie zostało odnalezione.', $id),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        $deleted = $this->ticketService->deleteSubtask($ticket, $subtaskId);

        if (!$deleted) {
            return $this->json([
                'title' => 'Not Found',
                'detail' => sprintf('Podzadanie %s nie zostało odnalezione.', $subtaskId),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['message' => 'Podzadanie usunięte pomyślnie.']);
    }
}
