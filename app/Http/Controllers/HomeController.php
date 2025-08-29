<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Repository;
use App\Models\Issue;
use App\Models\PullRequest;
use App\Models\Commit;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        // Get trending repositories (most starred recently)
        $trendingRepositories = Repository::where('is_private', false)
            ->orderBy('stars_count', 'desc')
            ->with('owner')
            ->take(6)
            ->get();

        // Get recent activity across all public repositories
        $recentCommits = Commit::whereHas('repository', function ($query) {
                $query->where('is_private', false);
            })
            ->with(['repository', 'author'])
            ->latest('committed_at')
            ->take(8)
            ->get();

        // Get open pull requests
        $openPullRequests = PullRequest::whereHas('repository', function ($query) {
                $query->where('is_private', false);
            })
            ->where('status', 'open')
            ->with(['repository', 'author'])
            ->latest()
            ->take(5)
            ->get();

        // Get recent issues
        $recentIssues = Issue::whereHas('repository', function ($query) {
                $query->where('is_private', false);
            })
            ->where('status', 'open')
            ->with(['repository', 'author'])
            ->latest()
            ->take(5)
            ->get();

        // Statistics
        $stats = [
            'repositories' => Repository::where('is_private', false)->count(),
            'issues' => Issue::whereHas('repository', function ($query) {
                $query->where('is_private', false);
            })->count(),
            'pullRequests' => PullRequest::whereHas('repository', function ($query) {
                $query->where('is_private', false);
            })->count(),
            'commits' => Commit::whereHas('repository', function ($query) {
                $query->where('is_private', false);
            })->count(),
        ];

        return Inertia::render('welcome', [
            'trendingRepositories' => $trendingRepositories,
            'recentCommits' => $recentCommits,
            'openPullRequests' => $openPullRequests,
            'recentIssues' => $recentIssues,
            'stats' => $stats,
        ]);
    }
}