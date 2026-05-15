<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$question = App\Models\TryoutQuestion::find(542);

$paginator = new \Illuminate\Pagination\LengthAwarePaginator(
    $question ? [$question] : [],
    30,
    1,
    1,
    ['path' => 'http://localhost/']
);

echo json_encode($paginator, JSON_PRETTY_PRINT);
