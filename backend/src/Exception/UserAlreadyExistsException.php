<?php

namespace App\Exception;

final class UserAlreadyExistsException extends \DomainException
{
    public function __construct(string $email)
    {
        parent::__construct(sprintf('A user with the email address "%s" already exists.', $email));
    }
}
