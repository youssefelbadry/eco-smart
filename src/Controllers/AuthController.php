<?php

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Helpers\ValidationHelper;
use App\Helpers\RequestHelper;
use App\Services\AuthService;

$config = require __DIR__ . '/../../config/app.php';
$service = new AuthService($config['jwt_secret'], $config['jwt_expiration']);

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseHelper::error('Method not allowed', 405);
}

$body = RequestHelper::getBody();

switch ($path) {
    case '/api_login.php':
        $email = ValidationHelper::sanitizeString($body['email_or_username'] ?? '');
        $password = $body['password'] ?? '';

        if ($email === '' || $password === '') {
            ResponseHelper::error('email_or_username and password required', 400);
        }

        $result = $service->login($email, $password);
        if ($result === null) {
            ResponseHelper::error('Invalid credentials', 401);
        }

        ResponseHelper::success($result, 'Login success');
        break;

    case '/api_signup.php':
        $name = ValidationHelper::sanitizeString($body['full_name'] ?? '');
        $email = ValidationHelper::sanitizeEmail($body['email'] ?? '');
        $password = $body['password'] ?? '';

        $requiredField = ValidationHelper::requireNonEmpty($body, ['full_name', 'email', 'password']);
        if ($requiredField !== null) {
            ResponseHelper::error("{$requiredField} is required", 400);
        }

        if (!ValidationHelper::isValidEmail($email)) {
            ResponseHelper::error('Invalid email address', 400);
        }

        if (!ValidationHelper::isStrongPassword($password)) {
            ResponseHelper::error('Password must be at least 8 characters, include upper and lower case letters, and contain a number', 400);
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $success = $service->register([
            'name' => $name,
            'email' => $email,
            'password' => $passwordHash,
            'remember_token' => null,
        ]);

        if (!$success) {
            ResponseHelper::error('Unable to create user', 500);
        }

        ResponseHelper::success([], 'User registered successfully');
        break;

    case '/api_forgot_password.php':
        $email = ValidationHelper::sanitizeEmail($body['email'] ?? '');
        if ($email === '') {
            ResponseHelper::error('email required', 400);
        }

        $token = bin2hex(random_bytes(32));
        $service->requestPasswordReset($email, $token);
        ResponseHelper::success(['reset_token_demo' => $token], 'Reset token generated');
        break;

    case '/api_reset_password.php':
        $token = trim($body['reset_token'] ?? '');
        $newPassword = $body['new_password'] ?? '';

        if ($token === '' || $newPassword === '') {
            ResponseHelper::error('reset_token and new_password required', 400);
        }

        if (!ValidationHelper::isStrongPassword($newPassword)) {
            ResponseHelper::error('Password must be at least 8 characters, include upper and lower case letters, and contain a number', 400);
        }

        $resetRow = $service->findPasswordResetByToken($token);
        if (!$resetRow) {
            ResponseHelper::error('Invalid token', 400);
        }

        $createdAt = strtotime($resetRow['created_at'] ?? '');
        if ($createdAt === false || time() > $createdAt + 1800) {
            ResponseHelper::error('Token expired', 400);
        }

        $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $success = $service->resetPassword($resetRow['email'], $passwordHash);
        if (!$success) {
            ResponseHelper::error('Unable to reset password', 500);
        }

        ResponseHelper::success([], 'Password updated successfully');
        break;

    default:
        ResponseHelper::error('Endpoint not found', 404);
}
