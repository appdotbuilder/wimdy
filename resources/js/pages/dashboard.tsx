import React from 'react';
import { Link } from '@inertiajs/react';
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
}

interface Commit {
    id: number;
    hash: string;
    message: string;
    author_name: string;
    committed_at: string;
    repository: {
        name: string;
        slug: string;
    };
}

interface PullRequest {
    id: number;
    title: string;
    status: string;
    author: {
        name: string;
    };
    repository: {
        name: string;
        slug: string;
    };
    created_at: string;
}

interface Issue {
    id: number;
    title: string;
    status: string;
    priority: string;
    author: {
        name: string;
    };
    repository: {
        name: string;
        slug: string;
    };
    created_at: string;
}

interface Props {
    repositories: Repository[];
    recentCommits: Commit[];
    pullRequests: PullRequest[];
    issues: Issue[];
    [key: string]: unknown;
}

export default function Dashboard({ 
    repositories, 
    recentCommits, 
    pullRequests, 
    issues 
}: Props) {
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

    const getPriorityColor = (priority: string) => {
        const colors: { [key: string]: string } = {
            'low': 'text-green-400',
            'medium': 'text-yellow-400',
            'high': 'text-orange-400',
            'critical': 'text-red-400',
        };
        return colors[priority] || 'text-gray-400';
    };

    const getStatusBadge = (status: string, type: 'pr' | 'issue') => {
        if (type === 'pr') {
            const colors = {
                'open': 'bg-green-900/30 text-green-300 border-green-500/30',
                'merged': 'bg-purple-900/30 text-purple-300 border-purple-500/30',
                'closed': 'bg-red-900/30 text-red-300 border-red-500/30',
            };
            return colors[status as keyof typeof colors] || 'bg-gray-900/30 text-gray-300 border-gray-500/30';
        } else {
            const colors = {
                'open': 'bg-green-900/30 text-green-300 border-green-500/30',
                'closed': 'bg-red-900/30 text-red-300 border-red-500/30',
            };
            return colors[status as keyof typeof colors] || 'bg-gray-900/30 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <AppShell>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <Heading title="🚀 Dashboard" />
                    <Link href="/repositories/create">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            📚 New Repository
                        </Button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="text-3xl font-bold text-purple-400">{repositories.length}</div>
                        <div className="text-sm text-gray-400">Your Repositories</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="text-3xl font-bold text-blue-400">{pullRequests.length}</div>
                        <div className="text-sm text-gray-400">Open Pull Requests</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="text-3xl font-bold text-orange-400">{issues.length}</div>
                        <div className="text-sm text-gray-400">Open Issues</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="text-3xl font-bold text-green-400">{recentCommits.length}</div>
                        <div className="text-sm text-gray-400">Recent Commits</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Your Repositories */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700">
                        <div className="p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white flex items-center justify-between">
                                📚 Your Repositories
                                <Link href="/repositories">
                                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        View All
                                    </Button>
                                </Link>
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {repositories.length > 0 ? (
                                repositories.map((repo) => (
                                    <Link
                                        key={repo.id}
                                        href={`/repositories/${repo.slug}`}
                                        className="block p-6 hover:bg-gray-750 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-white">{repo.name}</h3>
                                                    {repo.is_private && (
                                                        <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded border border-yellow-500/30">
                                                            Private
                                                        </span>
                                                    )}
                                                </div>
                                                {repo.description && (
                                                    <p className="text-gray-400 mb-3">{repo.description}</p>
                                                )}
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
                                                    <span>{formatDate(repo.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    <div className="text-4xl mb-4">📁</div>
                                    <p className="mb-4">You don't have any repositories yet.</p>
                                    <Link href="/repositories/create">
                                        <Button className="bg-purple-600 hover:bg-purple-700">
                                            Create Your First Repository
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-8">
                        {/* Recent Commits */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700">
                            <div className="p-6 border-b border-gray-700">
                                <h2 className="text-xl font-semibold text-white">📝 Recent Commits</h2>
                            </div>
                            <div className="divide-y divide-gray-700">
                                {recentCommits.length > 0 ? (
                                    recentCommits.map((commit) => (
                                        <div key={commit.id} className="p-6">
                                            <div className="text-sm text-gray-400 mb-2">
                                                {commit.repository.name}
                                            </div>
                                            <div className="text-white mb-2 font-medium">
                                                {commit.message.length > 60 
                                                    ? commit.message.substring(0, 60) + '...' 
                                                    : commit.message
                                                }
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-400">
                                                <span>{commit.author_name}</span>
                                                <span>{formatDate(commit.committed_at)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        <div className="text-4xl mb-4">📝</div>
                                        <p>No recent commits</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pull Requests */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700">
                            <div className="p-6 border-b border-gray-700">
                                <h2 className="text-xl font-semibold text-white">🔀 Pull Requests</h2>
                            </div>
                            <div className="divide-y divide-gray-700">
                                {pullRequests.length > 0 ? (
                                    pullRequests.map((pr) => (
                                        <div key={pr.id} className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm text-gray-400">
                                                    {pr.repository.name}
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded border ${getStatusBadge(pr.status, 'pr')}`}>
                                                    {pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="text-white mb-2 font-medium">
                                                {pr.title.length > 50 
                                                    ? pr.title.substring(0, 50) + '...' 
                                                    : pr.title
                                                }
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-400">
                                                <span>by {pr.author.name}</span>
                                                <span>{formatDate(pr.created_at)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        <div className="text-4xl mb-4">🔀</div>
                                        <p>No pull requests</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Issues */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700">
                            <div className="p-6 border-b border-gray-700">
                                <h2 className="text-xl font-semibold text-white">🐛 Issues</h2>
                            </div>
                            <div className="divide-y divide-gray-700">
                                {issues.length > 0 ? (
                                    issues.map((issue) => (
                                        <div key={issue.id} className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm text-gray-400">
                                                    {issue.repository.name}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                                                        {issue.priority.toUpperCase()}
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs rounded border ${getStatusBadge(issue.status, 'issue')}`}>
                                                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-white mb-2 font-medium">
                                                {issue.title.length > 50 
                                                    ? issue.title.substring(0, 50) + '...' 
                                                    : issue.title
                                                }
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-400">
                                                <span>by {issue.author.name}</span>
                                                <span>{formatDate(issue.created_at)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        <div className="text-4xl mb-4">🐛</div>
                                        <p>No issues</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}