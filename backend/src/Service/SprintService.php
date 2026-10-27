<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\CreateSprintRequest;
use App\Entity\Sprint;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

final class SprintService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function createSprint(CreateSprintRequest $request): Sprint
    {
        $id = $request->id ?? ('sprint-'.substr((string) Uuid::v7(), 0, 8));

        $sprint = new Sprint(
            id: $id,
            name: $request->name,
            status: $request->status,
        );

        $sprint->setGoal($request->goal);

        if ($request->startDate) {
            $sprint->setStartDate(new \DateTimeImmutable($request->startDate));
        }

        if ($request->endDate) {
            $sprint->setEndDate(new \DateTimeImmutable($request->endDate));
        }

        $this->entityManager->persist($sprint);
        $this->entityManager->flush();

        return $sprint;
    }
}
