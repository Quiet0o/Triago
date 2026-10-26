<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\Sprint;

final readonly class SprintResponse
{
    public function __construct(
        public string $id,
        public string $name,
        public string $goal,
        public string $startDate,
        public string $endDate,
        public string $status,
    ) {
    }

    public static function fromEntity(Sprint $sprint): self
    {
        return new self(
            id: $sprint->getId(),
            name: $sprint->getName(),
            goal: $sprint->getGoal() ?? '',
            startDate: $sprint->getStartDate()?->format('Y-m-d') ?? '',
            endDate: $sprint->getEndDate()?->format('Y-m-d') ?? '',
            status: $sprint->getStatus(),
        );
    }
}
