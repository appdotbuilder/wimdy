<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\PullRequestController;
use App\Http\Controllers\RepositoryController;
use Illuminate\Support\Facades\Route;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - main Wimdy interface
Route::get('/', [HomeController::class, 'index'])->name('home');

// Repository routes (public access for browsing)
Route::get('/repositories', [RepositoryController::class, 'index'])->name('repositories.index');
Route::get('/repositories/{repository}', [RepositoryController::class, 'show'])->name('repositories.show');

// Issues routes (nested under repositories)
Route::get('/repositories/{repository}/issues', [IssueController::class, 'index'])->name('repositories.issues.index');
Route::get('/repositories/{repository}/issues/{issue}', [IssueController::class, 'show'])->name('repositories.issues.show');

// Pull Requests routes (nested under repositories)
Route::get('/repositories/{repository}/pull-requests', [PullRequestController::class, 'index'])->name('repositories.pull-requests.index');
Route::get('/repositories/{repository}/pull-requests/{pullRequest}', [PullRequestController::class, 'show'])->name('repositories.pull-requests.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Authenticated repository routes
    Route::post('/repositories', [RepositoryController::class, 'store'])->name('repositories.store');
    Route::get('/repositories/create', [RepositoryController::class, 'create'])->name('repositories.create');
    Route::get('/repositories/{repository}/edit', [RepositoryController::class, 'edit'])->name('repositories.edit');
    Route::put('/repositories/{repository}', [RepositoryController::class, 'update'])->name('repositories.update');
    Route::delete('/repositories/{repository}', [RepositoryController::class, 'destroy'])->name('repositories.destroy');
    
    // Authenticated issue routes
    Route::get('/repositories/{repository}/issues/create', [IssueController::class, 'create'])->name('repositories.issues.create');
    Route::post('/repositories/{repository}/issues', [IssueController::class, 'store'])->name('repositories.issues.store');
    Route::get('/repositories/{repository}/issues/{issue}/edit', [IssueController::class, 'edit'])->name('repositories.issues.edit');
    Route::put('/repositories/{repository}/issues/{issue}', [IssueController::class, 'update'])->name('repositories.issues.update');
    Route::delete('/repositories/{repository}/issues/{issue}', [IssueController::class, 'destroy'])->name('repositories.issues.destroy');
    
    // Authenticated pull request routes
    Route::get('/repositories/{repository}/pull-requests/create', [PullRequestController::class, 'create'])->name('repositories.pull-requests.create');
    Route::post('/repositories/{repository}/pull-requests', [PullRequestController::class, 'store'])->name('repositories.pull-requests.store');
    Route::get('/repositories/{repository}/pull-requests/{pullRequest}/edit', [PullRequestController::class, 'edit'])->name('repositories.pull-requests.edit');
    Route::put('/repositories/{repository}/pull-requests/{pullRequest}', [PullRequestController::class, 'update'])->name('repositories.pull-requests.update');
    Route::delete('/repositories/{repository}/pull-requests/{pullRequest}', [PullRequestController::class, 'destroy'])->name('repositories.pull-requests.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
