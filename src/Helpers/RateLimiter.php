<?php

namespace App\Helpers;

use App\Helpers\ResponseHelper;

class RateLimiter
{
    public static function check(int $maxRequests = 60, int $perSeconds = 60): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $route = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $key = sha1($ip . '|' . $route);
        $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'eco_rate';
        if (!is_dir($dir)) {
            @mkdir($dir, 0700, true);
        }

        $file = $dir . DIRECTORY_SEPARATOR . $key . '.json';
        $now = time();
        $data = ['count' => 0, 'reset' => $now + $perSeconds];

        if (file_exists($file)) {
            $contents = @file_get_contents($file);
            $parsed = $contents ? json_decode($contents, true) : null;
            if (is_array($parsed)) {
                $data = $parsed;
            }
        }

        if ($now > ($data['reset'] ?? 0)) {
            $data = ['count' => 0, 'reset' => $now + $perSeconds];
        }

        $data['count'] = ($data['count'] ?? 0) + 1;

        if ($data['count'] > $maxRequests) {
            header('Retry-After: ' . (($data['reset'] ?? $now) - $now));
            ResponseHelper::error('Rate limit exceeded', 429, ['retry_after' => ($data['reset'] ?? $now) - $now]);
        }

        @file_put_contents($file, json_encode($data));
    }
}
