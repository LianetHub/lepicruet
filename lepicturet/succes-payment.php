<?php

require __DIR__ . '/vendor/autoload.php';

use YooKassa\Client;

$source = file_get_contents('php://input');
$requestBody = json_decode($source, true);

$idempotenceKey = uniqid('', true);
$response  = $client->createPayment(
    [
        'amount' => [
            'value' => $price,
            'currency' => 'RUB',
        ],
        'confirmation' => [
            'type' => 'embedded',
            'locale' => 'ru_RU',
        ],
        'capture' => true,
        'description' => 'Заказ №' . $counter,
        'metadata' => [
            'order_id' => $counter,
        ],
        'receipt' => [
            'customer' => [
                'full_name' => $name,
                'email' => $email,

            ],
            "items" => $receipt_arr
        ]
    ],
    $idempotenceKey
);

$data = json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
echo $data;
