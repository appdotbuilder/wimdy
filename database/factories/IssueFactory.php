<?php

namespace Database\Factories;

use App\Models\Repository;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Issue>
 */
class IssueFactory extends Factory
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
            'assignee_id' => fake()->boolean(60) ? User::factory() : null,
            'status' => fake()->randomElement(['open', 'closed']),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'critical']),
            'labels' => fake()->randomElements(['bug', 'enhancement', 'documentation', 'help wanted', 'good first issue'], random_int(0, 3)),
            'closed_at' => fake()->boolean(30) ? fake()->dateTimeBetween('-1 month', 'now') : null,
        ];
    }

    /**
     * Indicate that the issue is open.
     */
    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'open',
            'closed_at' => null,
        ]);
    }

    /**
     * Indicate that the issue is closed.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed',
            'closed_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the issue is high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'high',
        ]);
    }
}