<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit7576c8a1311e63a851ccb4d25c3719aa
{
    public static $prefixLengthsPsr4 = array (
        'Y' => 
        array (
            'YooKassa\\Validator\\' => 19,
            'YooKassa\\' => 9,
        ),
        'P' => 
        array (
            'Psr\\Log\\' => 8,
        ),
        'D' => 
        array (
            'Ds\\' => 3,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'YooKassa\\Validator\\' => 
        array (
            0 => __DIR__ . '/..' . '/yoomoney/yookassa-sdk-validator/src',
        ),
        'YooKassa\\' => 
        array (
            0 => __DIR__ . '/..' . '/yoomoney/yookassa-sdk-php/lib',
        ),
        'Psr\\Log\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/log/src',
        ),
        'Ds\\' => 
        array (
            0 => __DIR__ . '/..' . '/php-ds/php-ds/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit7576c8a1311e63a851ccb4d25c3719aa::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit7576c8a1311e63a851ccb4d25c3719aa::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit7576c8a1311e63a851ccb4d25c3719aa::$classMap;

        }, null, ClassLoader::class);
    }
}
