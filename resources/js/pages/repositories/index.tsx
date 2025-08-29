import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

interface Repository {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    language: string | null;
    stars_count: number;
    forks_count: number;
    is_private: boolean;
    created_at: string;
    owner: {
        name: string;
    };
}

interface PaginationData {
    data: Repository[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    repositories: PaginationData;
    [key: string]: unknown;
}

export default function RepositoriesIndex({ repositories }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getLanguageColor = (language: string | null) => {
        const colors: { [key: string]: string } = {
            'JavaScript': 'bg-yellow-500',
            'Python': 'bg-blue-500',
            'PHP': 'bg-purple-500',
            'TypeScript': 'bg-blue-600',
            'Java': 'bg-red-500',
            'C++': 'bg-pink-500',
            'Go': 'bg-cyan-500',
            'Rust': 'bg-orange-500',
        };
        return colors[language || ''] || 'bg-gray-500';
    };

    return (
        <AppShell>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Heading title="📚 Repositories" />
                        <p className="text-gray-400 mt-2">
                            Explore public repositories from the Wimdy community
                        </p>
                    </div>
                    {auth.user && (
                        <Link href="/repositories/create">
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                ➕ New Repository
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Repository Grid */}
                {repositories.data.length > 0 ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {repositories.data.map((repo) => (
                                <Link
                                    key={repo.id}
                                    href={`/repositories/${repo.slug}`}
                                    className="block bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-purple-500 hover:bg-gray-750 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="text-lg font-semibold text-white">
                                                    {repo.owner.name}/{repo.name}
                                                </h3>
                                                {repo.is_private && (
                                                    <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded border border-yellow-500/30">
                                                        🔒
                                                    </span>
                                                )}
                                            </div>
                                            {repo.description && (
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {repo.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                                            {repo.language && (
                                                <span className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)} mr-2`}></div>
                                                    {repo.language}
                                                </span>
                                            )}
                                            <span className="flex items-center">
                                                ⭐ {repo.stars_count}
                                            </span>
                                            <span className="flex items-center">
                                                🍴 {repo.forks_count}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <div className="text-sm text-gray-400">
                                            Updated {formatDate(repo.created_at)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {repositories.last_page > 1 && (
                            <div className="flex items-center justify-center space-x-4">
                                {repositories.prev_page_url && (
                                    <Link href={repositories.prev_page_url}>
                                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                            ← Previous
                                        </Button>
                                    </Link>
                                )}
                                
                                <span className="text-gray-400">
                                    Page {repositories.current_page} of {repositories.last_page}
                                </span>

                                {repositories.next_page_url && (
                                    <Link href={repositories.next_page_url}>
                                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                            Next →
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-6">📚</div>
                        <h3 className="text-2xl font-semibold text-white mb-4">No repositories found</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            There are no public repositories to display at the moment.
                        </p>
                        {auth.user && (
                            <Link href="/repositories/create">
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                    Create the First Repository
                                </Button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Repository Statistics</h3>
                            <div className="flex items-center space-x-8 text-sm text-gray-400">
                                <span>Total: {repositories.total} repositories</span>
                                <span>Showing: {repositories.data.length} per page</span>
                            </div>
                        </div>
                        <div className="text-4xl">📊</div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}