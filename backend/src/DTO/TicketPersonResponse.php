<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\User;

final readonly class TicketPersonResponse
{
    public function __construct(
        public string $name,
        public string $email,
        public string $avatarFallback,
        public string $role,
        public ?string $id = null,
    ) {
    }

    public static function fromUser(?User $user, ?string $fallbackName = null, ?string $fallbackEmail = null): ?self
    {
        if (null === $user && null === $fallbackName && null === $fallbackEmail) {
            return null;
        }

        if (null !== $user) {
            $name = $user->getFullName() ?? $user->getEmail() ?? 'Użytkownik';
            $email = (string) $user->getEmail();
            $role = $user->getJobTitle() ?? 'Developer';
            $avatarFallback = $user->getAvatarFallback();
            $id = (string) $user->getId();
        } else {
            $name = $fallbackName ?? 'Nieznany';
            $email = $fallbackEmail ?? '';
            $role = 'Zgłaszający';
            $parts = preg_split('/\s+/', trim($name));
            $initials = '';
            if ($parts) {
                foreach ($parts as $part) {
                    if ('' !== $part) {
                        $initials .= mb_strtoupper(mb_substr($part, 0, 1));
                    }
                }
            }
            $avatarFallback = mb_substr($initials, 0, 2) ?: 'U';
            $id = null;
        }

        return new self(
            name: $name,
            email: $email,
            avatarFallback: $avatarFallback,
            role: $role,
            id: $id,
        );
    }
}
