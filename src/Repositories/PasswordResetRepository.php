<?php

namespace App\Repositories;

use App\Helpers\DbHelper;

class PasswordResetRepository
{
    public function create(string $email, string $token): bool
    {
        $pdo = DbHelper::getConnection();
        $stmt = $pdo->prepare('INSERT INTO password_reset_tokens (email, token, created_at) VALUES (:email, :token, NOW())');
        return $stmt->execute([':email' => $email, ':token' => $token]);
    }

    public function findByToken(string $token): ?array
    {
        $pdo = DbHelper::getConnection();
        $stmt = $pdo->prepare('SELECT email, token, created_at FROM password_reset_tokens WHERE token = :token LIMIT 1');
        $stmt->execute([':token' => $token]);
        return $stmt->fetch() ?: null;
    }

    public function deleteByEmail(string $email): bool
    {
        $pdo = DbHelper::getConnection();
        $stmt = $pdo->prepare('DELETE FROM password_reset_tokens WHERE email = :email');
        return $stmt->execute([':email' => $email]);
    }
}
