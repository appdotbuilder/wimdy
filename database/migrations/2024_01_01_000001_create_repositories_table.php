<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('repositories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('is_private')->default(false);
            $table->boolean('is_fork')->default(false);
            $table->string('language')->nullable();
            $table->integer('stars_count')->default(0);
            $table->integer('forks_count')->default(0);
            $table->string('default_branch')->default('main');
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('is_private');
            $table->index('language');
            $table->index(['user_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repositories');
    }
};