<?php

namespace App\Factory;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<User>
 */
final class UserFactory extends PersistentObjectFactory
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    #[\Override]
    public static function class(): string
    {
        return User::class;
    }

    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'email' => self::faker()->unique()->safeEmail(),
            'fullName' => self::faker()->name(),
            'password' => 'password123',
            'roles' => ['ROLE_USER'],
        ];
    }

    #[\Override]
    protected function initialize(): static
    {
        return $this
            ->afterInstantiate(function (User $user): void {
                $plainPassword = $user->getPassword() ?? 'password123';
                $user->setPassword($this->passwordHasher->hashPassword($user, $plainPassword));
            });
    }
}
