<?php

namespace App\Repositories;

use App\Helpers\DbHelper;

class UserRepository
{
    public function findByEmailOrUsername(string $value): ?array
    {
        $pdo = DbHelper::getConnection();
        $stmt = $pdo->prepare('SELECT id, name, email, password FROM users WHERE email = :value LIMIT 1');
        $stmt->execute([':value' => $value]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): bool
    {
        $pdo = DbHelper::getConnection();
        $stmt = $pdo->prepare(
            'INSERT INTO users (name, email, password, remember_token, created_at, updated_at) VALUES (:name, :email, :password, :remember_token, NOW(), NOW())'
        );

        return $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':password' => $data['password'],
            ':remember_token' => $data['remember_token'] ?? null,
        ]);
    }

    public function findByEmail(string $email): ?array
    {
        $pdo = DbHelper::getConnection();
        $stmt = $pdo->prepare('SELECT id, name, email, password FROM users WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        return $stmt->fetch() ?: null;
    }

    public function updatePassword(int $userId, string $hash): bool
    {
        $pdo = DbHelper::getConnection();
        $stmt = $pdo->prepare('UPDATE users SET password = :password, updated_at = NOW() WHERE id = :id');
        return $stmt->execute([':password' => $hash, ':id' => $userId]);
    }
}
