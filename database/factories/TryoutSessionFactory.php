<?php

namespace Database\Factories;

use App\Models\Tryout;
use App\Models\TryoutSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TryoutSession>
 */
class TryoutSessionFactory extends Factory
{
    protected $model = TryoutSession::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'tryout_id'        => Tryout::inRandomOrder()->first()?->id ?? 1,
            'study_program_id' => 1,
            'started_at'       => now(),
            'finished_at'      => null,
            'total_score'      => null,
            'score_details'    => null,
        ];
    }

    /**
     * State: sesi yang sudah selesai dengan skor.
     */
    public function finished(): static
    {
        return $this->state(fn (array $attributes) => [
            'finished_at'   => now(),
            'total_score'   => $this->faker->numberBetween(0, 100),
            'score_details' => [],
        ]);
    }
}
