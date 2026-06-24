<?php

$charset = getenv('DB_CHARSET') ?: 'utf8mb4';
$mysqlUrl = getenv('MYSQL_PUBLIC_URL') ?: getenv('DATABASE_URL') ?: '';

if ($mysqlUrl !== '') {
    $parts = parse_url($mysqlUrl);
    if (is_array($parts) && isset($parts['host'])) {
        return [
            'host' => $parts['host'],
            'port' => (string) ($parts['port'] ?? '3306'),
            'name' => ltrim($parts['path'] ?? '/ecosmart', '/'),
            'user' => urldecode($parts['user'] ?? 'root'),
            'pass' => urldecode($parts['pass'] ?? ''),
            'charset' => $charset,
            'options' => [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ],
        ];
    }
}

return [
    'host' => getenv('DB_HOST') ?: '127.0.0.1',
    'port' => getenv('DB_PORT') ?: '3306',
    'name' => getenv('DB_NAME') ?: 'ecosmart',
    'user' => getenv('DB_USER') ?: 'root',
    'pass' => getenv('DB_PASS') ?: '',
    'charset' => $charset,
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ],
];
