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
        Schema::create('commits', function (Blueprint $table) {
            $table->id();
            $table->string('hash')->unique();
            $table->text('message');
            $table->foreignId('repository_id')->constrained()->onDelete('cascade');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('branch');
            $table->string('author_name');
            $table->string('author_email');
            $table->integer('files_changed')->default(0);
            $table->integer('additions')->default(0);
            $table->integer('deletions')->default(0);
            $table->timestamp('committed_at');
            $table->timestamps();
            
            $table->index('repository_id');
            $table->index('author_id');
            $table->index('branch');
            $table->index(['repository_id', 'branch']);
            $table->index('committed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commits');
    }
};