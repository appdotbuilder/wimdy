<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Authenticated repository routes
    Route::post('/repositories', [RepositoryController::class, 'store'])->name('repositories.store');
    Route::get('/repositories/create', [RepositoryController::class, 'create'])->name('repositories.create');
    Route::get('/repositories/{repository}/edit', [RepositoryController::class, 'edit'])->name('repositories.edit');
    Route::put('/repositories/{repository}', [RepositoryController::class, 'update'])->name('repositories.update');
    Route::delete('/repositories/{repository}', [RepositoryController::class, 'destroy'])->name('repositories.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
