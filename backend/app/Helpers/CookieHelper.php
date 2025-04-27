<?php

namespace App\Helpers;

class CookieHelper
{
    public static function getCookieOptions() {
        $isLocal = app()->environment('local');

        return [
            'domain' => $isLocal ? '127.0.0.1' : 'd39hmozy4wec8b.cloudfront.net',
            'sameSite' => $isLocal ? 'Lax' : 'None'
        ];
    }
}
