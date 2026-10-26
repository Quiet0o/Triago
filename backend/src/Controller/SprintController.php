<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\CreateSprintRequest;
use App\DTO\SprintResponse;
use App\Entity\Sprint;
use App\Repository\SprintRepository;
use App\Service\SprintService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/sprints', name: 'api_sprints_')]
final class SprintController extends AbstractController
{
    public function __construct(
        private readonly SprintRepository $sprintRepository,
        private readonly SprintService $sprintService,
    ) {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $sprints = $this->sprintRepository->findBy([], ['startDate' => 'DESC']);

        $response = array_map(
            static fn (Sprint $sprint): SprintResponse => SprintResponse::fromEntity($sprint),
            $sprints,
        );

        return $this->json($response);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] CreateSprintRequest $request,
    ): JsonResponse {
        $sprint = $this->sprintService->createSprint($request);

        return $this->json(
            SprintResponse::fromEntity($sprint),
            Response::HTTP_CREATED,
        );
    }
}
