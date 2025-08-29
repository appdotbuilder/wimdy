<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Issue
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property int $repository_id
 * @property int $author_id
 * @property int|null $assignee_id
 * @property string $status
 * @property string $priority
 * @property array|null $labels
 * @property \Illuminate\Support\Carbon|null $closed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Repository $repository
 * @property-read \App\Models\User $author
 * @property-read \App\Models\User|null $assignee
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Issue newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Issue newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Issue query()
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereRepositoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereAssigneeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereLabels($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereClosedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Issue whereUpdatedAt($value)
 * @method static \Database\Factories\IssueFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Issue extends Model
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
        'assignee_id',
        'status',
        'priority',
        'labels',
        'closed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'labels' => 'array',
        'closed_at' => 'datetime',
    ];

    /**
     * Get the issue repository.
     */
    public function repository(): BelongsTo
    {
        return $this->belongsTo(Repository::class);
    }

    /**
     * Get the issue author.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the issue assignee.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }
}