<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$subtest = App\Models\TryoutSubtest::find(1);
$session = App\Models\TryoutSession::first();

echo "Session ID: " . $session->id . "\n";

$allIdsSorted = $subtest->questions()->orderBy('id')->pluck('id')->toArray();
echo "All IDs Sorted Count: " . count($allIdsSorted) . "\n";

// Function seededShuffle
function seededShuffle(array $ids, int $seed): array {
    $state = mt_rand();
    mt_srand($seed);
    $count = count($ids);
    for ($i = $count - 1; $i > 0; $i--) {
        $j = mt_rand(0, $i);
        $temp = $ids[$i];
        $ids[$i] = $ids[$j];
        $ids[$j] = $temp;
    }
    mt_srand();
    return $ids;
}

$allIds = seededShuffle($allIdsSorted, $session->id);

$page = 1;
$currentId = $allIds[$page - 1] ?? null;

echo "Current ID for page $page: " . var_export($currentId, true) . "\n";

if ($currentId) {
    $question = App\Models\TryoutQuestion::find($currentId);
    echo "Question found: " . ($question ? 'Yes' : 'No') . "\n";
    if ($question) {
        echo "Question ID: " . $question->id . "\n";
    }
}
