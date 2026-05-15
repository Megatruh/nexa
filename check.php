<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$tryout = \App\Models\Tryout::find(1);
if ($tryout) {
    echo "Tryout 1: " . $tryout->name . " (Active: " . $tryout->is_active . ")\n";
} else {
    echo "Tryout 1 not found.\n";
}

$subtest = \App\Models\TryoutSubtest::find(1);
if ($subtest) {
    echo "Subtest 1: " . $subtest->name . " (Tryout ID: " . $subtest->tryout_id . ")\n";
} else {
    echo "Subtest 1 not found.\n";
}

$count = \App\Models\TryoutQuestion::where('tryout_subtest_id', 1)->count();
echo "Questions count for subtest 1: " . $count . "\n";

echo "All tryouts:\n";
foreach (\App\Models\Tryout::all() as $t) {
    echo " - ID: {$t->id}, Name: {$t->name}\n";
}

echo "All subtests for tryout 1:\n";
foreach (\App\Models\TryoutSubtest::where('tryout_id', 1)->get() as $st) {
    echo " - ID: {$st->id}, Name: {$st->name}, Tryout ID: {$st->tryout_id}\n";
}

$count = \App\Models\TryoutQuestion::count();
echo "Total Questions in DB: " . $count . "\n";
