<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Repository
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property int $user_id
 * @property bool $is_private
 * @property bool $is_fork
 * @property string|null $language
 * @property int $stars_count
 * @property int $forks_count
 * @property string $default_branch
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read int $issues_count
 * @property-read int $pull_requests_count
 * @property-read int $open_issues_count
 * @property-read int $open_pull_requests_count
 * @property-read \App\Models\User $owner
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Issue> $issues
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PullRequest> $pullRequests
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Commit> $commits
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Repository newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Repository newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Repository query()
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereIsPrivate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereIsFork($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereStarsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereForksCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereDefaultBranch($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Repository whereUpdatedAt($value)
 * @method static \Database\Factories\RepositoryFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Repository extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'user_id',
        'is_private',
        'is_fork',
        'language',
        'stars_count',
        'forks_count',
        'default_branch',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_private' => 'boolean',
        'is_fork' => 'boolean',
        'stars_count' => 'integer',
        'forks_count' => 'integer',
    ];

    /**
     * Get the repository owner.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the repository issues.
     */
    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }

    /**
     * Get the repository pull requests.
     */
    public function pullRequests(): HasMany
    {
        return $this->hasMany(PullRequest::class);
    }

    /**
     * Get the repository commits.
     */
    public function commits(): HasMany
    {
        return $this->hasMany(Commit::class);
    }
}