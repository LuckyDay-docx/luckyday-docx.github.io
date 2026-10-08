<?php
// Код совместим с PHP 5.6+ (на хостинге может стоять старая версия) — без оператора ??
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
  exit;
}

// Обрезаем поля, чтобы в письмо не прилетали мегабайты мусора
function field($key, $max = 500, $default = '') {
  $value = isset($_POST[$key]) ? $_POST[$key] : $default;
  if (!is_string($value)) return $default;
  return mb_substr(trim($value), 0, $max);
}

// Ловушка для ботов: поле website скрыто от людей. Боту отвечаем «успехом», письмо не шлём.
if (field('website') !== '') {
  echo json_encode(['success' => true, 'message' => 'Заявка отправлена']);
  exit;
}

$name = field('name', 100);
$phone = field('phone', 40);
$message = field('message', 3000);
$formName = field('form_name', 100, 'Заявка с сайта');

$pageUrl = field('page_url');
$referrer = field('referrer');
$utmSource = field('utm_source', 200);
$utmMedium = field('utm_medium', 200);
$utmCampaign = field('utm_campaign', 200);
$utmTerm = field('utm_term', 200);
$utmContent = field('utm_content', 200);

if ($name === '' || $phone === '') {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Заполните имя и телефон']);
  exit;
}

if (strlen(preg_replace('/\D/', '', $phone)) < 10) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Проверьте номер телефона']);
  exit;
}

/**
 * Отправка на почту
 */
$to = 'morifass@mail.ru';
$subject = '=?UTF-8?B?' . base64_encode('Новая заявка с сайта Кухни Оренбург') . '?=';

$body = "Новая заявка с сайта:\n\n";
$body .= "Форма: {$formName}\n";
$body .= "Имя: {$name}\n";
$body .= "Телефон: {$phone}\n";
$body .= "Сообщение: {$message}\n";
$body .= "Страница: {$pageUrl}\n";
$body .= "Реферер: {$referrer}\n";
$body .= "UTM Source: {$utmSource}\n";
$body .= "UTM Medium: {$utmMedium}\n";
$body .= "UTM Campaign: {$utmCampaign}\n";
$body .= "UTM Term: {$utmTerm}\n";
$body .= "UTM Content: {$utmContent}\n";
$body .= "Дата: " . date('d.m.Y H:i:s') . "\n";
$body .= "IP: " . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'неизвестно') . "\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/plain; charset=utf-8';
// Отправитель — адрес на домене сайта. С адреса @mail.ru слать нельзя:
// mail.ru (DMARC p=reject) отклоняет письма от своего имени, отправленные с чужого сервера.
$headers[] = 'From: =?UTF-8?B?' . base64_encode('Кухни Оренбург') . '?= <noreply@kuhni-v-orenburge.ru>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$mailSuccess = mail($to, $subject, $body, implode("\r\n", $headers));

if ($mailSuccess) {
  echo json_encode([
    'success' => true,
    'message' => 'Заявка отправлена',
  ]);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Ошибка отправки заявки']);
}
