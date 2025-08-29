<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIssueRequest;
use App\Http\Requests\UpdateIssueRequest;
use App\Models\Issue;
use App\Models\Repository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IssueController extends Controller
{
    /**
     * Display a listing of issues for a repository.
     */
    public function index(Repository $repository)
    {
        $issues = $repository->issues()
            ->with(['author', 'assignee'])
            ->latest()
            ->paginate(20);

        return Inertia::render('repositories/issues/index', [
            'repository' => $repository->load('owner'),
            'issues' => $issues
        ]);
    }

    /**
     * Show the form for creating a new issue.
     */
    public function create(Repository $repository)
    {
        return Inertia::render('repositories/issues/create', [
            'repository' => $repository->load('owner')
        ]);
    }

    /**
     * Store a newly created issue in storage.
     */
    public function store(StoreIssueRequest $request, Repository $repository)
    {
        $issue = $repository->issues()->create([
            ...$request->validated(),
            'author_id' => auth()->id(),
            'status' => 'open',
        ]);

        return redirect()->route('repositories.issues.show', [$repository, $issue])
            ->with('success', 'Issue created successfully.');
    }

    /**
     * Display the specified issue.
     */
    public function show(Repository $repository, Issue $issue)
    {
        $issue->load(['author', 'assignee', 'comments.author']);

        return Inertia::render('repositories/issues/show', [
            'repository' => $repository->load('owner'),
            'issue' => $issue
        ]);
    }

    /**
     * Show the form for editing the specified issue.
     */
    public function edit(Repository $repository, Issue $issue)
    {
        return Inertia::render('repositories/issues/edit', [
            'repository' => $repository->load('owner'),
            'issue' => $issue
        ]);
    }

    /**
     * Update the specified issue in storage.
     */
    public function update(UpdateIssueRequest $request, Repository $repository, Issue $issue)
    {
        $issue->update($request->validated());

        return redirect()->route('repositories.issues.show', [$repository, $issue])
            ->with('success', 'Issue updated successfully.');
    }

    /**
     * Remove the specified issue from storage.
     */
    public function destroy(Repository $repository, Issue $issue)
    {
        $issue->delete();

        return redirect()->route('repositories.issues.index', $repository)
            ->with('success', 'Issue deleted successfully.');
    }
}