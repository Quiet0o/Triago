<?php

namespace App\Story;

use App\Factory\UserFactory;
use Zenstruck\Foundry\Attribute\AsFixture;
use Zenstruck\Foundry\Story;

#[AsFixture(name: 'main')]
final class AppStory extends Story
{
    public function build(): void
    {
        UserFactory::createOne([
            'email' => 'test@example.com',
            'fullName' => 'Test User',
            'password' => 'password123',
            'roles' => ['ROLE_USER'],
        ]);

        UserFactory::createOne([
            'email' => 'admin@example.com',
            'fullName' => 'Admin User',
            'password' => 'password123',
            'roles' => ['ROLE_ADMIN'],
        ]);

        UserFactory::createMany(5);
    }
}
