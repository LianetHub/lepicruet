<?php

$token = "5174293081:AAG7tHiSB2BrJa14DRhYOHQqaVTHRlCCqkU";
$chat_id = "-658073530";

foreach ($_POST as $key => $value) {
  if ($key == 'phone')  $value = "%2B" . mb_substr($value, 1);

  $txt .= "<b>" . $key . "</b> " . $value . "%0A";
}


$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}", "r");
