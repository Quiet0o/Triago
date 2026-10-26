<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class CreateSprintRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Nazwa sprintu jest wymagana.')]
        public string $name,

        public ?string $id = null,

        public ?string $goal = null,

        public ?string $startDate = null,

        public ?string $endDate = null,

        #[Assert\Choice(choices: ['active', 'completed', 'planned'])]
        public string $status = 'planned',
    ) {
    }
}
