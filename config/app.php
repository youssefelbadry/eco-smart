<?php

return [
    'app_name' => getenv('APP_NAME') ?: 'ECO Smart Backend',
    'app_env' => getenv('APP_ENV') ?: 'production',
    'app_debug' => filter_var(getenv('APP_DEBUG') ?: 'false', FILTER_VALIDATE_BOOLEAN),
    'app_url' => getenv('APP_URL') ?: 'http://localhost',
    'jwt_secret' => getenv('JWT_SECRET') ?: 'change_this_to_a_secret',
    'jwt_expiration' => (int)(getenv('JWT_EXPIRATION') ?: 86400),
    'jwt_algorithm' => getenv('JWT_ALGORITHM') ?: 'HS256',
    'log_path' => getenv('LOG_PATH') ?: __DIR__ . '/../logs',
    'log_level' => getenv('LOG_LEVEL') ?: 'debug',
];
