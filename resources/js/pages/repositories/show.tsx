import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Commit {
    id: number;
    hash: string;
    message: string;
    author_name: string;
    author_email: string;
    files_changed: number;
    additions: number;
    deletions: number;
    committed_at: string;
    author: {
        name: string;
    };
}

interface Repository {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    language: string | null;
    stars_count: number;
    forks_count: number;
    is_private: boolean;
    is_fork: boolean;
    default_branch: string;
    created_at: string;
    owner: {
        id: number;
        name: string;
    };
    commits: Commit[];
}

interface Props {
    repository: Repository;
    [key: string]: unknown;
}

export default function RepositoryShow({ repository }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
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

    const canEdit = auth.user && auth.user.id === repository.owner.id;

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Repository Header */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <Link 
                                    href="/repositories" 
                                    className="text-purple-400 hover:text-purple-300 font-medium"
                                >
                                    {repository.owner.name}
                                </Link>
                                <span className="text-gray-400">/</span>
                                <h1 className="text-3xl font-bold text-white">{repository.name}</h1>
                                <div className="flex items-center space-x-2">
                                    {repository.is_private && (
                                        <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded border border-yellow-500/30">
                                            🔒 Private
                                        </span>
                                    )}
                                    {repository.is_fork && (
                                        <span className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 rounded border border-blue-500/30">
                                            🍴 Fork
                                        </span>
                                    )}
                                </div>
                            </div>

                            {repository.description && (
                                <p className="text-gray-300 text-lg mb-6">{repository.description}</p>
                            )}

                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                                {repository.language && (
                                    <span className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full ${getLanguageColor(repository.language)} mr-2`}></div>
                                        {repository.language}
                                    </span>
                                )}
                                <span className="flex items-center">
                                    ⭐ {repository.stars_count.toLocaleString()} stars
                                </span>
                                <span className="flex items-center">
                                    🍴 {repository.forks_count.toLocaleString()} forks
                                </span>
                                <span>Created {formatDate(repository.created_at)}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                ⭐ Star
                            </Button>
                            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                🍴 Fork
                            </Button>
                            {canEdit && (
                                <Link href={`/repositories/${repository.slug}/edit`}>
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        ⚙️ Settings
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-gray-800 rounded-lg border border-gray-700">
                    <div className="border-b border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            <button className="py-4 px-2 border-b-2 border-purple-500 text-purple-400 font-medium">
                                📁 Code
                            </button>
                            <button className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-300">
                                🐛 Issues
                            </button>
                            <button className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-300">
                                🔀 Pull Requests
                            </button>
                            <button className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-300">
                                📊 Insights
                            </button>
                        </nav>
                    </div>

                    {/* Branch Info */}
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-400">🌳 Branch:</span>
                                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        {repository.default_branch}
                                    </Button>
                                </div>
                                <div className="text-gray-400">
                                    {repository.commits.length} commits
                                </div>
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700">
                                💾 Clone or Download
                            </Button>
                        </div>
                    </div>

                    {/* File Browser Placeholder */}
                    <div className="p-6">
                        <div className="bg-gray-900 rounded border border-gray-600 p-8 text-center">
                            <div className="text-6xl mb-4">📂</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Repository Files</h3>
                            <p className="text-gray-400 mb-4">
                                File browsing feature coming soon! For now, check out the commit history below.
                            </p>
                            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                                <span>📄 README.md</span>
                                <span>📦 package.json</span>
                                <span>📁 src/</span>
                                <span>⚙️ .gitignore</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Commits */}
                <div className="bg-gray-800 rounded-lg border border-gray-700">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-xl font-semibold text-white">📝 Recent Commits</h2>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {repository.commits.length > 0 ? (
                            repository.commits.map((commit) => (
                                <div key={commit.id} className="p-6 hover:bg-gray-750 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-white mb-2">
                                                {commit.message}
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                <span>{commit.author_name}</span>
                                                <span>{formatDateTime(commit.committed_at)}</span>
                                                <span className="flex items-center space-x-2">
                                                    <span className="text-green-400">+{commit.additions}</span>
                                                    <span className="text-red-400">-{commit.deletions}</span>
                                                    <span>{commit.files_changed} files</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-6">
                                            <code className="bg-gray-900 px-2 py-1 rounded text-sm text-gray-300 font-mono">
                                                {commit.hash.substring(0, 7)}
                                            </code>
                                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-gray-700">
                                                📋
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-400">
                                <div className="text-4xl mb-4">📝</div>
                                <h3 className="text-lg font-semibold text-white mb-2">No commits yet</h3>
                                <p>This repository doesn't have any commits yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Repository Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-purple-400">{repository.commits.length}</div>
                                <div className="text-sm text-gray-400">Total Commits</div>
                            </div>
                            <div className="text-3xl">📝</div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-blue-400">{repository.forks_count}</div>
                                <div className="text-sm text-gray-400">Forks</div>
                            </div>
                            <div className="text-3xl">🍴</div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-yellow-400">{repository.stars_count}</div>
                                <div className="text-sm text-gray-400">Stars</div>
                            </div>
                            <div className="text-3xl">⭐</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}