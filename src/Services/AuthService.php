<?php

namespace App\Services;

use App\Auth\Jwt;
use App\Repositories\UserRepository;
use App\Repositories\PasswordResetRepository;

class AuthService
{
    private UserRepository $userRepository;
    private PasswordResetRepository $passwordResetRepository;
    private string $jwtSecret;
    private int $jwtExpiration;

    public function __construct(string $jwtSecret, int $jwtExpiration)
    {
        $this->userRepository = new UserRepository();
        $this->passwordResetRepository = new PasswordResetRepository();
        $this->jwtSecret = $jwtSecret;
        $this->jwtExpiration = $jwtExpiration;
    }

    public function login(string $email, string $password): ?array
    {
        $user = $this->userRepository->findByEmailOrUsername($email);
        if (!$user || !password_verify($password, $user['password'])) {
            return null;
        }

        $payload = [
            'sub' => (int)$user['id'],
            'email' => $user['email'],
            'iat' => time(),
            'exp' => time() + $this->jwtExpiration,
        ];

        return [
            'token' => Jwt::encode($payload, $this->jwtSecret),
            'user' => [
                'id' => (int)$user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
            ],
        ];
    }

    public function register(array $data): bool
    {
        return $this->userRepository->create($data);
    }

    public function requestPasswordReset(string $email, string $token): bool
    {
        return $this->passwordResetRepository->create($email, $token);
    }

    public function findPasswordResetByToken(string $token): ?array
    {
        return $this->passwordResetRepository->findByToken($token);
    }

    public function resetPassword(string $email, string $passwordHash): bool
    {
        $deleted = $this->passwordResetRepository->deleteByEmail($email);
        return $this->userRepository->updatePassword((int)$this->userRepository->findByEmail($email)['id'], $passwordHash) && $deleted;
    }
}
