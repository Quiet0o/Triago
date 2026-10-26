<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\ActivityEvent;

final readonly class ActivityEventResponse
{
    public function __construct(
        public string $id,
        public string $user,
        public string $userAvatarFallback,
        public string $action,
        public string $target,
        public string $time,
        public int $timestamp,
        public ?string $type = 'general',
    ) {
    }

    public static function fromEntity(ActivityEvent $event): self
    {
        $date = $event->getCreatedAt();

        return new self(
            id: $event->getId(),
            user: $event->getUserName(),
            userAvatarFallback: $event->getUserAvatarFallback(),
            action: $event->getAction(),
            target: $event->getTarget(),
            time: $date->format('d M Y, H:i'),
            timestamp: $date->getTimestamp() * 1000,
            type: $event->getType(),
        );
    }
}
