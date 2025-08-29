<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PullRequest
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property int $repository_id
 * @property int $author_id
 * @property string $source_branch
 * @property string $target_branch
 * @property string $status
 * @property bool $is_draft
 * @property int $commits_count
 * @property int $files_changed
 * @property \Illuminate\Support\Carbon|null $merged_at
 * @property int|null $merged_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Repository $repository
 * @property-read \App\Models\User $author
 * @property-read \App\Models\User|null $mergedBy
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereRepositoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereSourceBranch($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereTargetBranch($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereIsDraft($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereCommitsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereFilesChanged($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereMergedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereMergedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PullRequest whereUpdatedAt($value)
 * @method static \Database\Factories\PullRequestFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class PullRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'repository_id',
        'author_id',
        'source_branch',
        'target_branch',
        'status',
        'is_draft',
        'commits_count',
        'files_changed',
        'merged_at',
        'merged_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_draft' => 'boolean',
        'commits_count' => 'integer',
        'files_changed' => 'integer',
        'merged_at' => 'datetime',
    ];

    /**
     * Get the pull request repository.
     */
    public function repository(): BelongsTo
    {
        return $this->belongsTo(Repository::class);
    }

    /**
     * Get the pull request author.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the user who merged the pull request.
     */
    public function mergedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'merged_by');
    }
}