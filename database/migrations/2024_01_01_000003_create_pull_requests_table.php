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
        Schema::create('pull_requests', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('repository_id')->constrained()->onDelete('cascade');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('source_branch');
            $table->string('target_branch');
            $table->enum('status', ['open', 'merged', 'closed'])->default('open');
            $table->boolean('is_draft')->default(false);
            $table->integer('commits_count')->default(0);
            $table->integer('files_changed')->default(0);
            $table->timestamp('merged_at')->nullable();
            $table->foreignId('merged_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            $table->index('repository_id');
            $table->index('author_id');
            $table->index('status');
            $table->index(['repository_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pull_requests');
    }
};