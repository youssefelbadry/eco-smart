<?php

namespace App\Helpers;

class RequestHelper
{
    public static function getJsonInput(): array
    {
        $input = json_decode(file_get_contents('php://input'), true);
        return is_array($input) ? $input : [];
    }

    public static function getBody(): array
    {
        $post = $_POST ?? [];
        if (!empty($post)) {
            return $post;
        }

        return self::getJsonInput();
    }

    public static function getQueryString(string $key, ?string $default = null): ?string
    {
        if (!isset($_GET[$key])) {
            return $default;
        }

        return trim((string)$_GET[$key]);
    }

    public static function getQueryInt(string $key, int $default = 0): int
    {
        return isset($_GET[$key]) ? (int)$_GET[$key] : $default;
    }

    public static function getBodyString(string $key, ?string $default = null): ?string
    {
        $body = self::getBody();
        return isset($body[$key]) ? trim((string)$body[$key]) : $default;
    }

    public static function getBodyInt(string $key, int $default = 0): int
    {
        $body = self::getBody();
        return isset($body[$key]) ? (int)$body[$key] : $default;
    }
}
