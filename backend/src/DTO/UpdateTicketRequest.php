<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class UpdateTicketRequest
{
    /**
     * @param list<string>|null $labels
     */
    public function __construct(
        #[Assert\Length(max: 255)]
        public ?string $title = null,

        public ?string $description = null,

        public ?string $descriptionHtml = null,

        #[Assert\Choice(choices: ['epic', 'task', 'bug', 'story', 'subtask', 'improvement'])]
        public ?string $type = null,

        #[Assert\Choice(choices: ['krytyczny', 'wysoki', 'średni', 'niski'])]
        public ?string $priority = null,

        #[Assert\Choice(choices: ['nowy', 'w_toku', 'review', 'testowanie', 'zamknięty', 'zablokowany'])]
        public ?string $status = null,

        public ?string $assigneeEmail = null,

        public ?string $sprintId = null,

        public ?string $parentId = null,

        public ?string $epicId = null,

        #[Assert\PositiveOrZero]
        public ?int $storyPoints = null,

        public ?array $labels = null,

        public ?string $dueDate = null,

        public ?string $timeEstimate = null,

        public ?string $timeSpent = null,

        public ?string $blockedBy = null,

        public ?string $blockedReason = null,
    ) {
    }
}
