<?php

namespace Database\Factories;

use App\Models\Repository;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PullRequest>
 */
class PullRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(random_int(3, 8)),
            'description' => fake()->paragraphs(random_int(1, 3), true),
            'repository_id' => Repository::factory(),
            'author_id' => User::factory(),
            'source_branch' => 'feature/' . fake()->slug(2),
            'target_branch' => fake()->randomElement(['main', 'master', 'develop']),
            'status' => fake()->randomElement(['open', 'merged', 'closed']),
            'is_draft' => fake()->boolean(20),
            'commits_count' => fake()->numberBetween(1, 15),
            'files_changed' => fake()->numberBetween(1, 25),
            'merged_at' => fake()->boolean(40) ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'merged_by' => fake()->boolean(40) ? User::factory() : null,
        ];
    }

    /**
     * Indicate that the pull request is open.
     */
    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'open',
            'merged_at' => null,
            'merged_by' => null,
        ]);
    }

    /**
     * Indicate that the pull request is merged.
     */
    public function merged(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'merged',
            'merged_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'merged_by' => User::factory(),
        ]);
    }

    /**
     * Indicate that the pull request is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_draft' => true,
            'status' => 'open',
        ]);
    }
}