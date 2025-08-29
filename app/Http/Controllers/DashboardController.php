<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Repository;
use App\Models\Issue;
use App\Models\PullRequest;
use App\Models\Commit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get user's repositories
        $repositories = Repository::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        // Get recent activity
        $recentCommits = Commit::whereIn('repository_id', $repositories->pluck('id'))
            ->with(['repository', 'author'])
            ->latest('committed_at')
            ->take(10)
            ->get();

        // Get open pull requests assigned to user or created by user
        $pullRequests = PullRequest::where(function ($query) use ($user) {
                $query->where('author_id', $user->id);
            })
            ->where('status', 'open')
            ->with(['repository', 'author'])
            ->latest()
            ->take(5)
            ->get();

        // Get open issues assigned to user or created by user
        $issues = Issue::where(function ($query) use ($user) {
                $query->where('assignee_id', $user->id)
                      ->orWhere('author_id', $user->id);
            })
            ->where('status', 'open')
            ->with(['repository', 'author'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'repositories' => $repositories,
            'recentCommits' => $recentCommits,
            'pullRequests' => $pullRequests,
            'issues' => $issues,
        ]);
    }
}