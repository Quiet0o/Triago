<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\UserResponse;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;

#[Route('/api/users', name: 'api_users_')]
final class UserController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $users = $this->userRepository->findBy([], ['fullName' => 'ASC']);

        $response = array_map(
            static fn (User $user): UserResponse => UserResponse::fromEntity($user),
            $users,
        );

        return $this->json($response);
    }

    #[Route('/{idOrEmail}', name: 'show', methods: ['GET'])]
    public function show(string $idOrEmail): JsonResponse
    {
        $user = $this->findUserByIdOrEmail($idOrEmail);

        if (null === $user) {
            return $this->json([
                'title' => 'User not found',
                'detail' => sprintf('User "%s" does not exist.', $idOrEmail),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json(UserResponse::fromEntity($user));
    }

    #[Route('/{idOrEmail}', name: 'update', methods: ['PATCH'])]
    public function update(string $idOrEmail, Request $request): JsonResponse
    {
        $user = $this->findUserByIdOrEmail($idOrEmail);

        if (null === $user) {
            return $this->json([
                'title' => 'User not found',
                'detail' => sprintf('User "%s" does not exist.', $idOrEmail),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        /** @var array<string, mixed> $data */
        $data = json_decode($request->getContent(), true) ?? [];

        if (array_key_exists('avatarUrl', $data)) {
            $user->setAvatarUrl(is_string($data['avatarUrl']) ? $data['avatarUrl'] : null);
        }

        if (array_key_exists('banner', $data)) {
            $user->setBanner(is_string($data['banner']) ? $data['banner'] : null);
        }

        if (array_key_exists('fullName', $data) && is_string($data['fullName'])) {
            $user->setFullName($data['fullName']);
        }

        if (array_key_exists('jobTitle', $data) && is_string($data['jobTitle'])) {
            $user->setJobTitle($data['jobTitle']);
        }

        $this->entityManager->flush();

        return $this->json(UserResponse::fromEntity($user));
    }

    private function findUserByIdOrEmail(string $idOrEmail): ?User
    {
        if (Uuid::isValid($idOrEmail)) {
            $user = $this->userRepository->find(Uuid::fromString($idOrEmail));
            if ($user) {
                return $user;
            }
        }

        return $this->userRepository->findOneBy(['email' => $idOrEmail]);
    }
}
