<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class RegisterUserRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Email cannot be blank.')]
        #[Assert\Email(message: 'The email "{{ value }}" is not a valid email address.')]
        #[Assert\Length(max: 180, maxMessage: 'Email cannot be longer than {{ limit }} characters.')]
        public string $email,

        #[Assert\NotBlank(message: 'Password cannot be blank.')]
        #[Assert\Length(
            min: 8,
            max: 4096,
            minMessage: 'Password must be at least {{ limit }} characters long.',
            maxMessage: 'Password cannot be longer than {{ limit }} characters.',
        )]
        public string $password,

        #[Assert\Length(max: 255, maxMessage: 'Full name cannot be longer than {{ limit }} characters.')]
        public ?string $fullName = null,
    ) {
    }
}
