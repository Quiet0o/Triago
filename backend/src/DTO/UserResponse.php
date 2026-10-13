<?php

namespace App\DTO;

use App\Entity\User;

final readonly class UserResponse
{
    /**
     * @param list<string> $roles
     */
    public function __construct(
        public string $id,
        public string $email,
        public ?string $fullName,
        public array $roles,
        public string $createdAt,
    ) {
    }

    public static function fromEntity(User $user): self
    {
        return new self(
            id: (string) $user->getId(),
            email: (string) $user->getEmail(),
            fullName: $user->getFullName(),
            roles: $user->getRoles(),
            createdAt: $user->getCreatedAt()->format(\DateTimeInterface::ATOM),
        );
    }
}
