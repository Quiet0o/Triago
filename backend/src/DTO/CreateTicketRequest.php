<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class CreateTicketRequest
{
    /**
     * @param list<string> $labels
     * @param list<string> $subtasks
     */
    public function __construct(
        #[Assert\NotBlank(message: 'Tytuł zadania jest wymagany.')]
        #[Assert\Length(max: 255)]
        public string $title,

        #[Assert\NotNull]
        public string $description = '',

        public ?string $descriptionHtml = null,

        #[Assert\Choice(choices: ['epic', 'task', 'bug', 'story', 'subtask', 'improvement'])]
        public string $type = 'task',

        #[Assert\Choice(choices: ['krytyczny', 'wysoki', 'średni', 'niski'])]
        public string $priority = 'średni',

        #[Assert\Choice(choices: ['nowy', 'w_toku', 'review', 'testowanie', 'zamknięty', 'zablokowany'])]
        public string $status = 'nowy',

        public ?string $assigneeEmail = null,

        public ?string $sprintId = null,

        public ?string $parentId = null,

        public ?string $epicId = null,

        #[Assert\PositiveOrZero]
        public int $storyPoints = 0,

        public array $labels = [],

        public ?string $dueDate = null,

        public ?string $timeEstimate = null,

        public array $subtasks = [],
    ) {
    }
}
