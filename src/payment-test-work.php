<?php

require __DIR__ . '/vendor/autoload.php';

$result = $_POST;


$delivery = $result["delivery"];
$name = $result["name"];
$email = $result["email"];
$price = number_format($result["price"], 2, '.', '');

if ($delivery == 'pickup') {
    $startArray = 4;
} else {
    $startArray = 5;
}

$order_params = array_slice($result, $startArray);


$receipt_arr = [];
foreach ($order_params as $value) {

    $product_array = json_decode($value, true);

    $new_product_array = array(
        "description" => $product_array["name"],
        "quantity" => $product_array["quantity"],
        "amount" => [
            "value" => number_format($product_array["price"], 2, '.', ''),
            "currency" => "RUB"
        ],
        "vat_code" => "2",
        "payment_mode" => "full_prepayment",
        "payment_subject" => "commodity"
    );
    array_push($receipt_arr, $new_product_array);
};


// // Формирование номера заказ
$file = __DIR__ . '/counter.txt';
if (file_exists($file)) {
    $counter = file_get_contents($file);
} else {
    $counter = 0;
}
$counter++;
file_put_contents($file, $counter);


use YooKassa\Client;

$client = new Client();
$client->setAuth('260341', 'test_AwaKLMT812e6_4nR3ImnwcFyiuq4HAlUTHpXI6hR3-0');

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
