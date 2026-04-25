<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudyProgram>
 */
class StudyProgramFactory extends Factory
{
    private static $majorIndex = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $majors = require database_path('data/majors.php');

        $major = $majors[self::$majorIndex % count($majors)];
        self::$majorIndex++;

        return [
            'name' => $major,
            'weight_num'=>$this->faker->numberBetween(1,5),
            'weight_abst'=>$this->faker->numberBetween(1,5),
            'weight_verb'=>$this->faker->numberBetween(1,5),
            'passing_grade_avg'=>$this->faker->numberBetween(500,850),
        ];
    }
}
