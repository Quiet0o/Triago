<?php

declare(strict_types=1);

namespace App\DTO;

final readonly class TicketFilterQuery
{
    public function __construct(
        public ?string $status = null,
        public ?string $priority = null,
        public ?string $sprint = null,
        public ?string $search = null,
    ) {
    }
}
