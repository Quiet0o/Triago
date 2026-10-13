<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

final class AuthControllerTest extends WebTestCase
{
    public function testRegisterValidationFailsWithInvalidPayload(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/register',
            server: [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ],
            content: json_encode([
                'email' => 'invalid-email',
                'password' => 'short',
            ], JSON_THROW_ON_ERROR),
        );

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $data = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);

        self::assertIsArray($data);
        self::assertArrayHasKey('violations', $data);
        $properties = array_column($data['violations'], 'propertyPath');
        self::assertContains('email', $properties);
        self::assertContains('password', $properties);
    }

    public function testGetMeRequiresAuthentication(): void
    {
        $client = static::createClient();
        $client->request(
            'GET',
            '/api/me',
            server: ['HTTP_ACCEPT' => 'application/json'],
        );

        self::assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }
}
