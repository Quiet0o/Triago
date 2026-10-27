<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\UserResponse;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\FileUploadService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
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
        private readonly FileUploadService $fileUploadService,
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
            $rawAvatar = $data['avatarUrl'];
            if (is_string($rawAvatar) && str_starts_with($rawAvatar, 'data:image/')) {
                $savedUrl = $this->fileUploadService->saveBase64Image($rawAvatar, 'avatars');
                if (null !== $savedUrl) {
                    $this->fileUploadService->deleteFile($user->getAvatarUrl());
                    $user->setAvatarUrl($savedUrl);
                }
            } elseif (is_string($rawAvatar)) {
                $user->setAvatarUrl($rawAvatar);
            } else {
                $this->fileUploadService->deleteFile($user->getAvatarUrl());
                $user->setAvatarUrl(null);
            }
        }

        if (array_key_exists('banner', $data)) {
            $rawBanner = $data['banner'];
            if (is_string($rawBanner) && str_starts_with($rawBanner, 'data:image/')) {
                $savedUrl = $this->fileUploadService->saveBase64Image($rawBanner, 'banners');
                if (null !== $savedUrl) {
                    $this->fileUploadService->deleteFile($user->getBanner());
                    $user->setBanner($savedUrl);
                }
            } elseif (is_string($rawBanner)) {
                $user->setBanner($rawBanner);
            } else {
                $this->fileUploadService->deleteFile($user->getBanner());
                $user->setBanner(null);
            }
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

    #[Route('/{idOrEmail}/avatar', name: 'upload_avatar', methods: ['POST'])]
    public function uploadAvatar(string $idOrEmail, Request $request): JsonResponse
    {
        $user = $this->findUserByIdOrEmail($idOrEmail);

        if (null === $user) {
            return $this->json([
                'title' => 'User not found',
                'detail' => sprintf('User "%s" does not exist.', $idOrEmail),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        $file = $request->files->get('avatar') ?? $request->files->get('file');

        if (!$file instanceof UploadedFile) {
            return $this->json([
                'title' => 'No file uploaded',
                'detail' => 'Wymagane jest przesłanie pliku ze zdjęciem (pole "avatar" lub "file").',
                'status' => Response::HTTP_BAD_REQUEST,
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->fileUploadService->deleteFile($user->getAvatarUrl());
        $url = $this->fileUploadService->saveUploadedFile($file, 'avatars');
        $user->setAvatarUrl($url);
        $this->entityManager->flush();

        return $this->json(UserResponse::fromEntity($user));
    }

    #[Route('/{idOrEmail}/banner', name: 'upload_banner', methods: ['POST'])]
    public function uploadBanner(string $idOrEmail, Request $request): JsonResponse
    {
        $user = $this->findUserByIdOrEmail($idOrEmail);

        if (null === $user) {
            return $this->json([
                'title' => 'User not found',
                'detail' => sprintf('User "%s" does not exist.', $idOrEmail),
                'status' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        }

        $file = $request->files->get('banner') ?? $request->files->get('file');

        if (!$file instanceof UploadedFile) {
            return $this->json([
                'title' => 'No file uploaded',
                'detail' => 'Wymagane jest przesłanie pliku banera (pole "banner" lub "file").',
                'status' => Response::HTTP_BAD_REQUEST,
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->fileUploadService->deleteFile($user->getBanner());
        $url = $this->fileUploadService->saveUploadedFile($file, 'banners');
        $user->setBanner($url);
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
