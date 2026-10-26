<?php

declare(strict_types=1);

namespace App\DTO;

final readonly class UpdateSubtaskRequest
{
    public function __construct(
        public ?string $title = null,
        public ?string $status = null,
    ) {
    }
}
