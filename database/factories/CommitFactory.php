<?php

namespace Database\Factories;

use App\Models\Repository;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Commit>
 */
class CommitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->create();
        
        return [
            'hash' => fake()->sha1(),
            'message' => fake()->sentence(random_int(3, 10)),
            'repository_id' => Repository::factory(),
            'author_id' => $user->id,
            'branch' => fake()->randomElement(['main', 'master', 'develop', 'feature/auth', 'bugfix/login']),
            'author_name' => $user->name,
            'author_email' => $user->email,
            'files_changed' => fake()->numberBetween(1, 20),
            'additions' => fake()->numberBetween(0, 500),
            'deletions' => fake()->numberBetween(0, 200),
            'committed_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    /**
     * Indicate that the commit is large.
     */
    public function large(): static
    {
        return $this->state(fn (array $attributes) => [
            'files_changed' => fake()->numberBetween(20, 100),
            'additions' => fake()->numberBetween(500, 2000),
            'deletions' => fake()->numberBetween(200, 800),
        ]);
    }

    /**
     * Indicate that the commit is recent.
     */
    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'committed_at' => fake()->dateTimeBetween('-1 week', 'now'),
        ]);
    }
}