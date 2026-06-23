<?php

namespace App\Helpers;

class LogHelper
{
    public static function write(string $message, string $level = 'error'): void
    {
        $config = require __DIR__ . '/../../config/app.php';
        $path = $config['log_path'];
        $file = rtrim($path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'application.log';
        $date = date('Y-m-d H:i:s');
        $line = "[$date] [$level] $message" . PHP_EOL;

        if (!is_dir($path)) {
            mkdir($path, 0750, true);
        }

        file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
    }
}
