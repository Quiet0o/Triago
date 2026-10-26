<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class CreateSubtaskRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Tytuł podzadania jest wymagany.')]
        public string $title,
        public string $status = 'nowy',
    ) {
    }
}
