<?php

namespace App\Controller;

use App\DTO\RegisterUserRequest;
use App\DTO\UserResponse;
use App\Entity\User;
use App\Exception\UserAlreadyExistsException;
use App\Service\UserRegistrationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class AuthController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] RegisterUserRequest $request,
        UserRegistrationService $registrationService,
    ): JsonResponse {
        try {
            $user = $registrationService->register($request);
        } catch (UserAlreadyExistsException $exception) {
            return $this->json([
                'title' => 'User already exists',
                'detail' => $exception->getMessage(),
                'status' => Response::HTTP_CONFLICT,
            ], Response::HTTP_CONFLICT);
        }

        return $this->json(
            UserResponse::fromEntity($user),
            Response::HTTP_CREATED,
        );
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'title' => 'Unauthorized',
                'detail' => 'Invalid email or password.',
                'status' => Response::HTTP_UNAUTHORIZED,
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(UserResponse::fromEntity($user));
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST', 'GET'])]
    public function logout(): JsonResponse
    {
        return $this->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->json(UserResponse::fromEntity($user));
    }
}
