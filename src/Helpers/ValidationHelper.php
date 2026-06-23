<?php

namespace App\Helpers;

class ValidationHelper
{
    public static function sanitizeString(?string $value): string
    {
        return trim(filter_var($value ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
    }

    public static function sanitizeEmail(?string $value): string
    {
        return trim(filter_var($value ?? '', FILTER_SANITIZE_EMAIL));
    }

    public static function requireNonEmpty(array $input, array $fields): ?string
    {
        foreach ($fields as $field) {
            if (trim((string)($input[$field] ?? '')) === '') {
                return $field;
            }
        }
        return null;
    }

    public static function isValidEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function isStrongPassword(string $password): bool
    {
        return strlen($password) >= 8 && preg_match('/[A-Z]/', $password) && preg_match('/[a-z]/', $password) && preg_match('/[0-9]/', $password);
    }
}
