<?php

namespace App\Helpers;

class DbHelper
{
    private static ?\PDO $pdo = null;

    public static function getConnection(): \PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $config = require __DIR__ . '/../../config/database.php';
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', $config['host'], $config['port'], $config['name'], $config['charset']);

        self::$pdo = new \PDO($dsn, $config['user'], $config['pass'], $config['options']);
        return self::$pdo;
    }
}
