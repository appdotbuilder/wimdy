<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Repository>
 */
class RepositoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(random_int(1, 3), true);
        
        return [
            'name' => $name,
            'slug' => fake()->slug() . '-' . random_int(1000, 9999),
            'description' => fake()->sentence(),
            'user_id' => User::factory(),
            'is_private' => fake()->boolean(20), // 20% chance of being private
            'is_fork' => fake()->boolean(10), // 10% chance of being a fork
            'language' => fake()->randomElement(['JavaScript', 'Python', 'PHP', 'TypeScript', 'Java', 'C++', 'Go', 'Rust']),
            'stars_count' => fake()->numberBetween(0, 1000),
            'forks_count' => fake()->numberBetween(0, 100),
            'default_branch' => fake()->randomElement(['main', 'master', 'develop']),
        ];
    }

    /**
     * Indicate that the repository is private.
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_private' => true,
        ]);
    }

    /**
     * Indicate that the repository is a fork.
     */
    public function fork(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_fork' => true,
        ]);
    }

    /**
     * Indicate that the repository is popular.
     */
    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'stars_count' => fake()->numberBetween(500, 5000),
            'forks_count' => fake()->numberBetween(50, 500),
        ]);
    }
}