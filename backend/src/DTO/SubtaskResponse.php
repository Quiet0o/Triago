<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\Subtask;

final readonly class SubtaskResponse
{
    public function __construct(
        public string $id,
        public string $title,
        public string $status,
    ) {
    }

    public static function fromEntity(Subtask $subtask): self
    {
        return new self(
            id: $subtask->getId(),
            title: $subtask->getTitle(),
            status: $subtask->getStatus(),
        );
    }
}
