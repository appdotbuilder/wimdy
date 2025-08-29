<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Repository;
use App\Models\Issue;
use App\Models\PullRequest;
use App\Models\Commit;
use Illuminate\Database\Seeder;

class WimdySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create users
        $users = User::factory(10)->create();

        // Create repositories
        $repositories = collect();
        foreach ($users as $user) {
            $userRepos = Repository::factory(random_int(2, 5))
                ->for($user, 'owner')
                ->create();
            $repositories = $repositories->merge($userRepos);
        }

        // Create some popular repositories
        $popularRepos = Repository::factory(3)
            ->popular()
            ->for($users->random(), 'owner')
            ->create([
                'name' => fake()->randomElement(['awesome-framework', 'cool-library', 'super-app']),
                'description' => fake()->randomElement([
                    'A modern, fast, and secure web framework',
                    'Lightweight utility library for JavaScript developers',
                    'Full-stack application with modern architecture'
                ]),
            ]);
        $repositories = $repositories->merge($popularRepos);

        // Create commits for each repository
        foreach ($repositories as $repository) {
            Commit::factory(random_int(5, 20))
                ->for($repository)
                ->for($users->random(), 'author')
                ->create();
        }

        // Create issues
        foreach ($repositories->take(8) as $repository) {
            Issue::factory(random_int(3, 12))
                ->for($repository)
                ->for($users->random(), 'author')
                ->create();
        }

        // Create pull requests
        foreach ($repositories->take(6) as $repository) {
            PullRequest::factory(random_int(2, 8))
                ->for($repository)
                ->for($users->random(), 'author')
                ->create();
        }

        // Create some specific demo data
        $demoUser = User::factory()->create([
            'name' => 'Demo Developer',
            'email' => 'demo@wimdy.dev',
        ]);

        $demoRepo = Repository::factory()->create([
            'name' => 'wimdy-clone',
            'description' => 'A GitHub clone built with Laravel and React',
            'user_id' => $demoUser->id,
            'language' => 'PHP',
            'stars_count' => 42,
            'forks_count' => 7,
        ]);

        // Create some recent commits for the demo repo
        Commit::factory(5)->recent()->for($demoRepo)->for($demoUser, 'author')->create();

        // Create demo issues
        Issue::factory(3)->open()->for($demoRepo)->for($demoUser, 'author')->create();

        // Create demo pull requests
        PullRequest::factory(2)->open()->for($demoRepo)->for($demoUser, 'author')->create();
        PullRequest::factory(1)->merged()->for($demoRepo)->for($demoUser, 'author')->create();
    }
}