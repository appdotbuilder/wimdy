import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PullRequest {
    id: number;
    title: string;
    description: string;
    source_branch: string;
    target_branch: string;
    status: string;
    is_draft: boolean;
    commits_count: number;
    files_changed: number;
    created_at: string;
    author: {
        name: string;
    };
}

interface Repository {
    id: number;
    name: string;
    slug: string;
    owner: {
        name: string;
    };
}

interface Props {
    repository: Repository;
    pullRequests: {
        data: PullRequest[];
        links: Record<string, unknown>;
        meta: Record<string, unknown>;
    };
    [key: string]: unknown;
}

export default function PullRequestsIndex({ repository, pullRequests }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'open': 'bg-green-900/30 text-green-300 border-green-500/30',
            'closed': 'bg-red-900/30 text-red-300 border-red-500/30',
            'merged': 'bg-purple-900/30 text-purple-300 border-purple-500/30',
        };
        return colors[status] || 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    };

    const getStatusIcon = (status: string) => {
        const icons: { [key: string]: string } = {
            'open': '🔄',
            'closed': '❌',
            'merged': '✅',
        };
        return icons[status] || '🔄';
    };

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Repository Header */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <nav className="text-sm text-gray-400 mb-2">
                                <Link href="/repositories" className="hover:text-white">Repositories</Link>
                                <span className="mx-2">/</span>
                                <Link href={`/repositories/${repository.slug}`} className="hover:text-white">
                                    {repository.owner.name}/{repository.name}
                                </Link>
                                <span className="mx-2">/</span>
                                <span className="text-white">Pull Requests</span>
                            </nav>
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                🔀 Pull Requests
                                <span className="ml-3 text-sm font-normal bg-gray-700 px-3 py-1 rounded-full">
                                    {(pullRequests.meta as Record<string, unknown>)?.total as number || 0}
                                </span>
                            </h1>
                        </div>
                        {auth.user && (
                            <Link href={`/repositories/${repository.slug}/pull-requests/create`}>
                                <Button className="bg-green-600 hover:bg-green-700">
                                    ➕ New Pull Request
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-gray-800 rounded-lg border border-gray-700">
                    <div className="border-b border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            <Link
                                href={`/repositories/${repository.slug}`}
                                className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-300 font-medium transition-colors"
                            >
                                📁 Code
                            </Link>
                            <Link
                                href={`/repositories/${repository.slug}/issues`}
                                className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-300 font-medium transition-colors"
                            >
                                🐛 Issues
                            </Link>
                            <div className="py-4 px-2 border-b-2 border-purple-500 text-purple-400 font-medium">
                                🔀 Pull Requests
                            </div>
                            <div className="py-4 px-2 border-b-2 border-transparent text-gray-400 font-medium">
                                📊 Insights
                            </div>
                        </nav>
                    </div>

                    {/* Pull Requests List */}
                    <div className="p-6">
                        {pullRequests.data.length > 0 ? (
                            <div className="space-y-4">
                                {pullRequests.data.map((pr) => (
                                    <Link
                                        key={pr.id}
                                        href={`/repositories/${repository.slug}/pull-requests/${pr.id}`}
                                        className="block bg-gray-900 rounded-lg border border-gray-600 p-6 hover:border-purple-500 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-white">
                                                        {pr.title}
                                                    </h3>
                                                    <Badge variant="outline" className={getStatusColor(pr.status)}>
                                                        {getStatusIcon(pr.status)} {pr.status.toUpperCase()}
                                                    </Badge>
                                                    {pr.is_draft && (
                                                        <Badge variant="outline" className="bg-gray-900/30 text-gray-300 border-gray-500/30">
                                                            📝 DRAFT
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                <p className="text-gray-400 mb-3 line-clamp-2">
                                                    {pr.description.length > 150
                                                        ? pr.description.substring(0, 150) + '...'
                                                        : pr.description
                                                    }
                                                </p>
                                                
                                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                                    <span>Created by {pr.author.name}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(pr.created_at)}</span>
                                                    <span>•</span>
                                                    <span className="text-blue-400">
                                                        {pr.source_branch} → {pr.target_branch}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                    <span className="flex items-center">
                                                        📝 {pr.commits_count} commits
                                                    </span>
                                                    <span className="flex items-center">
                                                        📄 {pr.files_changed} files changed
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔀</div>
                                <h3 className="text-xl font-semibold text-white mb-2">No pull requests yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Pull requests let you tell others about changes you've pushed to a repository.
                                </p>
                                {auth.user && (
                                    <Link href={`/repositories/${repository.slug}/pull-requests/create`}>
                                        <Button className="bg-green-600 hover:bg-green-700">
                                            ➕ Create your first pull request
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}