<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Subtest Count: " . \App\Models\Subtest::count() . "\n";
echo "LearningMaterial Count: " . \App\Models\LearningMaterial::count() . "\n";

echo "All Subtests and their Materials count:\n";
foreach (\App\Models\Subtest::all() as $st) {
    echo " - ID: {$st->id}, Name: {$st->name}, Slug: {$st->slug}, Materials Count: " . $st->learningMaterials()->count() . "\n";
}

echo "\nAll Learning Materials in DB:\n";
foreach (\App\Models\LearningMaterial::all() as $lm) {
    echo " - ID: {$lm->id}, Title: {$lm->title}, Subtest ID: {$lm->subtest_id}, Type: {$lm->type}, File Path: {$lm->file_path}\n";
}
