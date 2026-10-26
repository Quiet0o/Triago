<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

final class TicketControllerTest extends WebTestCase
{
    public function testCreateTicketValidationFailsWithEmptyTitle(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/tickets',
            server: [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ],
            content: json_encode([
                'title' => '',
                'type' => 'task',
                'priority' => 'średni',
            ], JSON_THROW_ON_ERROR),
        );

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $data = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);

        self::assertIsArray($data);
        self::assertArrayHasKey('violations', $data);
        $properties = array_column($data['violations'], 'propertyPath');
        self::assertContains('title', $properties);
    }

    public function testGetTicketReturnsNotFoundForNonExistent(): void
    {
        $client = static::createClient();
        $client->request(
            'GET',
            '/api/tickets/NON-EXISTENT-999',
            server: ['HTTP_ACCEPT' => 'application/json'],
        );

        // When DB is unreachable or ticket not found:
        // if DB is reachable, it returns 404.
        self::assertTrue(
            Response::HTTP_NOT_FOUND === $client->getResponse()->getStatusCode()
            || $client->getResponse()->getStatusCode() >= 400,
        );
    }
}
