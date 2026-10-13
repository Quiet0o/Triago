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
    public function login(): void
    {
        // Intercepted by Symfony Security json_login firewall
        throw new \LogicException('This method should not be reached. Check security.yaml firewall configuration.');
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST', 'GET'])]
    public function logout(): void
    {
        // Intercepted by Symfony Security logout firewall
        throw new \LogicException('This method should not be reached. Check security.yaml firewall configuration.');
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
