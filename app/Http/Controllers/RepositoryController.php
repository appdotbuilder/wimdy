<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRepositoryRequest;
use App\Http\Requests\UpdateRepositoryRequest;
use App\Models\Repository;
use Inertia\Inertia;

class RepositoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $repositories = Repository::with(['owner'])
            ->where('is_private', false)
            ->orWhere('user_id', auth()->id())
            ->latest()
            ->paginate(12);

        return Inertia::render('repositories/index', [
            'repositories' => $repositories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('repositories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRepositoryRequest $request)
    {
        $repository = Repository::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
            'slug' => str($request->name)->slug() . '-' . random_int(1000, 9999),
        ]);

        return redirect()->route('repositories.show', $repository)
            ->with('success', 'Repository created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Repository $repository)
    {
        $repository->load(['owner', 'commits' => function ($query) {
            $query->with('author')->latest('committed_at')->take(10);
        }]);

        // Load additional stats for insights
        $repository->loadCount(['issues', 'pullRequests']);
        $repository->loadCount([
            'issues as open_issues_count' => function ($query) {
                $query->where('status', 'open');
            },
            'pullRequests as open_pull_requests_count' => function ($query) {
                $query->where('status', 'open');
            }
        ]);

        return Inertia::render('repositories/show', [
            'repository' => $repository
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Repository $repository)
    {
        // Check if user owns the repository
        if (auth()->id() !== $repository->user_id) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('repositories/edit', [
            'repository' => $repository
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRepositoryRequest $request, Repository $repository)
    {
        // Check if user owns the repository
        if (auth()->id() !== $repository->user_id) {
            abort(403, 'Unauthorized');
        }

        $repository->update($request->validated());

        return redirect()->route('repositories.show', $repository)
            ->with('success', 'Repository updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Repository $repository)
    {
        // Check if user owns the repository
        if (auth()->id() !== $repository->user_id) {
            abort(403, 'Unauthorized');
        }

        $repository->delete();

        return redirect()->route('repositories.index')
            ->with('success', 'Repository deleted successfully.');
    }
}