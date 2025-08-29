<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePullRequestRequest;
use App\Http\Requests\UpdatePullRequestRequest;
use App\Models\PullRequest;
use App\Models\Repository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PullRequestController extends Controller
{
    /**
     * Display a listing of pull requests for a repository.
     */
    public function index(Repository $repository)
    {
        $pullRequests = $repository->pullRequests()
            ->with(['author'])
            ->latest()
            ->paginate(20);

        return Inertia::render('repositories/pull-requests/index', [
            'repository' => $repository->load('owner'),
            'pullRequests' => $pullRequests
        ]);
    }

    /**
     * Show the form for creating a new pull request.
     */
    public function create(Repository $repository)
    {
        return Inertia::render('repositories/pull-requests/create', [
            'repository' => $repository->load('owner')
        ]);
    }

    /**
     * Store a newly created pull request in storage.
     */
    public function store(StorePullRequestRequest $request, Repository $repository)
    {
        $pullRequest = $repository->pullRequests()->create([
            ...$request->validated(),
            'author_id' => auth()->id(),
            'status' => 'open',
        ]);

        return redirect()->route('repositories.pull-requests.show', [$repository, $pullRequest])
            ->with('success', 'Pull request created successfully.');
    }

    /**
     * Display the specified pull request.
     */
    public function show(Repository $repository, PullRequest $pullRequest)
    {
        $pullRequest->load(['author', 'commits', 'comments.author']);

        return Inertia::render('repositories/pull-requests/show', [
            'repository' => $repository->load('owner'),
            'pullRequest' => $pullRequest
        ]);
    }

    /**
     * Show the form for editing the specified pull request.
     */
    public function edit(Repository $repository, PullRequest $pullRequest)
    {
        return Inertia::render('repositories/pull-requests/edit', [
            'repository' => $repository->load('owner'),
            'pullRequest' => $pullRequest
        ]);
    }

    /**
     * Update the specified pull request in storage.
     */
    public function update(UpdatePullRequestRequest $request, Repository $repository, PullRequest $pullRequest)
    {
        $pullRequest->update($request->validated());

        return redirect()->route('repositories.pull-requests.show', [$repository, $pullRequest])
            ->with('success', 'Pull request updated successfully.');
    }

    /**
     * Remove the specified pull request from storage.
     */
    public function destroy(Repository $repository, PullRequest $pullRequest)
    {
        $pullRequest->delete();

        return redirect()->route('repositories.pull-requests.index', $repository)
            ->with('success', 'Pull request deleted successfully.');
    }
}