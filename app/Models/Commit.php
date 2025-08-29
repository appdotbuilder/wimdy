<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Commit
 *
 * @property int $id
 * @property string $hash
 * @property string $message
 * @property int $repository_id
 * @property int $author_id
 * @property string $branch
 * @property string $author_name
 * @property string $author_email
 * @property int $files_changed
 * @property int $additions
 * @property int $deletions
 * @property \Illuminate\Support\Carbon $committed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Repository $repository
 * @property-read \App\Models\User $author
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Commit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Commit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Commit query()
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereHash($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereRepositoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereBranch($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereAuthorName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereAuthorEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereFilesChanged($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereAdditions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereDeletions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereCommittedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Commit whereUpdatedAt($value)
 * @method static \Database\Factories\CommitFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Commit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'hash',
        'message',
        'repository_id',
        'author_id',
        'branch',
        'author_name',
        'author_email',
        'files_changed',
        'additions',
        'deletions',
        'committed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'files_changed' => 'integer',
        'additions' => 'integer',
        'deletions' => 'integer',
        'committed_at' => 'datetime',
    ];

    /**
     * Get the commit repository.
     */
    public function repository(): BelongsTo
    {
        return $this->belongsTo(Repository::class);
    }

    /**
     * Get the commit author.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}