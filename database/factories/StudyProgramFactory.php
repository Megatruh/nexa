<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudyProgram>
 */
class StudyProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $majors = require database_path('data/majors.php');
        $universities = require database_path('data/universities.php');
        $categories = ['Saintek', 'Soshum'];

        return [
            'name'=> $this->faker->randomElement($majors),
            'university' => $this->faker->randomElement($universities),
            'category'=>$this->faker->randomElement($categories),
            'passing_grade_avg'=>$this->faker->numberBetween(500,850),
            'description'=>$this->faker->paragraph(),
            'prospect'=>$this->faker->sentence(rand(1,2), true)
        ];
    }
}
