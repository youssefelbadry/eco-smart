<?php

namespace App\Auth;

use App\Helpers\ResponseHelper;

class Guard
{
    private string $secret;

    public function __construct(string $secret)
    {
        $this->secret = $secret;
    }

    public function authenticate(): array
    {
        $headers = $this->getRequestHeaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!str_starts_with($authHeader, 'Bearer ')) {
            ResponseHelper::error('Missing Bearer token', 401);
        }

        $token = trim(substr($authHeader, 7));
        $payload = Jwt::decode($token, $this->secret);
        if ($payload === null) {
            ResponseHelper::error('Invalid or expired token', 401);
        }

        return $payload;
    }

    private function getRequestHeaders(): array
    {
        if (function_exists('getallheaders')) {
            return getallheaders();
        }

        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (str_starts_with($name, 'HTTP_')) {
                $headerName = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                $headers[$headerName] = $value;
            }
        }
        return $headers;
    }
}
