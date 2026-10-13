<?php

namespace App\Service;

use App\DTO\RegisterUserRequest;
use App\Entity\User;
use App\Exception\UserAlreadyExistsException;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserRegistrationService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function register(RegisterUserRequest $request): User
    {
        $normalizedEmail = mb_strtolower(trim($request->email));

        $existingUser = $this->userRepository->findOneBy(['email' => $normalizedEmail]);
        if (null !== $existingUser) {
            throw new UserAlreadyExistsException($normalizedEmail);
        }

        $user = new User();
        $user->setEmail($normalizedEmail);
        $user->setFullName($request->fullName ? trim($request->fullName) : null);
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $request->password),
        );

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }
}
