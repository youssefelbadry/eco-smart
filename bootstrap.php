<?php

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
} elseif (file_exists(__DIR__ . '/autoload.php')) {
    require_once __DIR__ . '/autoload.php';
} else {
    // No autoloader found — proceed without composer autoload
}

if (!function_exists('loadEnvFile')) {
    function loadEnvFile(string $path): void
    {
        if (!file_exists($path) || !is_readable($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            [$name, $value] = array_map('trim', explode('=', $line, 2) + ['', '']);
            if ($name === '') {
                continue;
            }

            if ((getenv($name) !== false) || array_key_exists($name, $_ENV) || array_key_exists($name, $_SERVER)) {
                continue;
            }

            if (str_starts_with($value, '"') && str_ends_with($value, '"')) {
                $value = substr($value, 1, -1);
            }

            putenv("{$name}={$value}");
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

loadEnvFile(__DIR__ . '/.env');

// Basic rate limiting for all requests. Values can be overridden via .env
try {
    if (class_exists('\App\\Helpers\\RateLimiter')) {
        $max = (int)(getenv('RATE_LIMIT_MAX') ?: 60);
        $window = (int)(getenv('RATE_LIMIT_WINDOW') ?: 60);
        \App\Helpers\RateLimiter::check($max, $window);
    }
} catch (\Throwable $e) {
    // Fail open: don't block requests if rate limiter has issues
}
