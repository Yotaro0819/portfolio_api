<?php

return [


    'paths' => ['api/*', 'broadcasting/auth', 'pusher/auth'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
    'https://d39hmozy4wec8b.cloudfront.net',
	'https://dsigners.site',
	'http://127.0.0.1:5173'
    ],


    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['*'],

    'max_age' => 0,

    'supports_credentials' => true,

];
