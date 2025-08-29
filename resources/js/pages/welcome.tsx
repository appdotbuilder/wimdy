import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Repository {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    language: string | null;
    stars_count: number;
    forks_count: number;
    owner: {
        name: string;
    };
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

interface Stats {
    repositories: number;
    issues: number;
    pullRequests: number;
    commits: number;
}

interface Props {
    trendingRepositories: Repository[];
    recentCommits: Commit[];
    openPullRequests: PullRequest[];
    recentIssues: Issue[];
    stats: Stats;
    [key: string]: unknown;
}

export default function Welcome({
    trendingRepositories,
    recentCommits,
    openPullRequests,
    recentIssues,
    stats
}: Props) {
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

    const getPriorityColor = (priority: string) => {
        const colors: { [key: string]: string } = {
            'low': 'text-green-400',
            'medium': 'text-yellow-400',
            'high': 'text-orange-400',
            'critical': 'text-red-400',
        };
        return colors[priority] || 'text-gray-400';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                            🚀 Wimdy
                        </h1>
                        <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            The developer platform built for all kinds of coders. 
                            Collaborate, track issues, review code, and ship faster.
                        </p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                                <div className="text-3xl font-bold text-purple-400">{stats.repositories.toLocaleString()}</div>
                                <div className="text-sm text-gray-400">Repositories</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                                <div className="text-3xl font-bold text-blue-400">{stats.issues.toLocaleString()}</div>
                                <div className="text-sm text-gray-400">Issues</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                                <div className="text-3xl font-bold text-green-400">{stats.pullRequests.toLocaleString()}</div>
                                <div className="text-sm text-gray-400">Pull Requests</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                                <div className="text-3xl font-bold text-orange-400">{stats.commits.toLocaleString()}</div>
                                <div className="text-sm text-gray-400">Commits</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                                        🎯 Go to Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/register">
                                        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                                            🚀 Get Started
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg">
                                            👋 Sign In
                                        </Button>
                                    </Link>
                                </>
                            )}
                            <Link href="/repositories">
                                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg">
                                    🔍 Explore Repos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-white mb-12">
                        🛠️ Everything Developers Need
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Code Repositories</h3>
                            <p className="text-gray-400">Host and browse unlimited public and private repositories</p>
                        </div>
                        <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
                            <div className="text-5xl mb-4">🔀</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Pull Requests</h3>
                            <p className="text-gray-400">Collaborate on code changes with comprehensive PR reviews</p>
                        </div>
                        <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
                            <div className="text-5xl mb-4">🐛</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Issue Tracking</h3>
                            <p className="text-gray-400">Track bugs, feature requests, and project tasks efficiently</p>
                        </div>
                        <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
                            <div className="text-5xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Commit History</h3>
                            <p className="text-gray-400">Detailed commit logs with file changes and statistics</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="py-20 bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Trending Repositories */}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8">🔥 Trending Repositories</h2>
                            <div className="space-y-4">
                                {trendingRepositories.map((repo) => (
                                    <Link
                                        key={repo.id}
                                        href={`/repositories/${repo.slug}`}
                                        className="block p-6 bg-gray-900 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {repo.owner.name}/{repo.name}
                                                </h3>
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
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8">⚡ Recent Activity</h2>
                            <div className="space-y-6">
                                {/* Recent Commits */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-4">📝 Latest Commits</h3>
                                    <div className="space-y-3">
                                        {recentCommits.slice(0, 4).map((commit) => (
                                            <div
                                                key={commit.id}
                                                className="p-4 bg-gray-900 rounded-lg border border-gray-700"
                                            >
                                                <div className="text-sm text-gray-400 mb-1">
                                                    {commit.repository.name}
                                                </div>
                                                <div className="text-white mb-2 font-medium">
                                                    {commit.message.length > 50 
                                                        ? commit.message.substring(0, 50) + '...' 
                                                        : commit.message
                                                    }
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-400">
                                                    <span>{commit.author_name}</span>
                                                    <span>{formatDate(commit.committed_at)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Open Pull Requests */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-4">🔀 Open Pull Requests</h3>
                                    <div className="space-y-3">
                                        {openPullRequests.slice(0, 3).map((pr) => (
                                            <div
                                                key={pr.id}
                                                className="p-4 bg-gray-900 rounded-lg border border-gray-700"
                                            >
                                                <div className="text-sm text-gray-400 mb-1">
                                                    {pr.repository.name}
                                                </div>
                                                <div className="text-white mb-2 font-medium">
                                                    {pr.title.length > 40 
                                                        ? pr.title.substring(0, 40) + '...' 
                                                        : pr.title
                                                    }
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-400">
                                                    <span>by {pr.author.name}</span>
                                                    <span>{formatDate(pr.created_at)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Issues */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-4">🐛 Recent Issues</h3>
                                    <div className="space-y-3">
                                        {recentIssues.slice(0, 3).map((issue) => (
                                            <div
                                                key={issue.id}
                                                className="p-4 bg-gray-900 rounded-lg border border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="text-sm text-gray-400">
                                                        {issue.repository.name}
                                                    </div>
                                                    <span className={`text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                                                        {issue.priority.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-white mb-2 font-medium">
                                                    {issue.title.length > 40 
                                                        ? issue.title.substring(0, 40) + '...' 
                                                        : issue.title
                                                    }
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-400">
                                                    <span>by {issue.author.name}</span>
                                                    <span>{formatDate(issue.created_at)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 py-16">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to build something amazing? 🚀
                    </h2>
                    <p className="text-xl text-gray-200 mb-8">
                        Join thousands of developers already using Wimdy to collaborate and ship code faster.
                    </p>
                    {!auth.user && (
                        <Link href="/register">
                            <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-12 py-4 text-xl font-semibold">
                                Start Coding Today
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}