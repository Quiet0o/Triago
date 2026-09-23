<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class HealthCheckController extends AbstractController
{
    #[Route('/', name: 'app_home', methods: ['GET'])]
    public function home(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'ok',
            'message' => 'Triago Symfony Backend is running!',
            'php_version' => PHP_VERSION,
            'opcache_enabled' => extension_loaded('Zend OPcache') && ini_get('opcache.enable') === '1',
            'time' => date('c'),
        ]);
    }

    #[Route('/api/health', name: 'app_health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        $dbStatus = 'unknown';
        try {
            $databaseUrl = $_ENV['DATABASE_URL'] ?? getenv('DATABASE_URL');
            if ($databaseUrl) {
                $dbStatus = 'configured';
            }
        } catch (\Throwable $e) {
            $dbStatus = 'error: ' . $e->getMessage();
        }

        return new JsonResponse([
            'status' => 'healthy',
            'environment' => $this->getParameter('kernel.environment'),
            'php_version' => PHP_VERSION,
            'database' => $dbStatus,
        ]);
    }
}
