<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class CreateCommentRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Treść komentarza nie może być pusta.')]
        public string $content,

        public ?string $contentHtml = null,
    ) {
    }
}
