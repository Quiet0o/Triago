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
        public ?string $jobTitle,
        public string $avatarFallback,
        public array $roles,
        public string $createdAt,
        public ?string $avatarUrl = null,
        public ?string $banner = null,
    ) {
    }

    public static function fromEntity(User $user): self
    {
        return new self(
            id: (string) $user->getId(),
            email: (string) $user->getEmail(),
            fullName: $user->getFullName(),
            jobTitle: $user->getJobTitle(),
            avatarFallback: $user->getAvatarFallback(),
            roles: $user->getRoles(),
            createdAt: $user->getCreatedAt()->format(\DateTimeInterface::ATOM),
            avatarUrl: $user->getAvatarUrl(),
            banner: $user->getBanner(),
        );
    }
}
