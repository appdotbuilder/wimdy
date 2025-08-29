import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Issue {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    created_at: string;
    author: {
        name: string;
    };
    assignee?: {
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
    issues: {
        data: Issue[];
        links: Record<string, unknown>;
        meta: Record<string, unknown>;
    };
    [key: string]: unknown;
}

export default function IssuesIndex({ repository, issues }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getPriorityColor = (priority: string) => {
        const colors: { [key: string]: string } = {
            'low': 'bg-green-900/30 text-green-300 border-green-500/30',
            'medium': 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30',
            'high': 'bg-orange-900/30 text-orange-300 border-orange-500/30',
            'critical': 'bg-red-900/30 text-red-300 border-red-500/30',
        };
        return colors[priority] || 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    };

    const getStatusColor = (status: string) => {
        return status === 'open' 
            ? 'bg-green-900/30 text-green-300 border-green-500/30'
            : 'bg-purple-900/30 text-purple-300 border-purple-500/30';
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
                                <span className="text-white">Issues</span>
                            </nav>
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                🐛 Issues
                                <span className="ml-3 text-sm font-normal bg-gray-700 px-3 py-1 rounded-full">
                                    {(issues.meta as Record<string, unknown>)?.total as number || 0}
                                </span>
                            </h1>
                        </div>
                        {auth.user && (
                            <Link href={`/repositories/${repository.slug}/issues/create`}>
                                <Button className="bg-green-600 hover:bg-green-700">
                                    ➕ New Issue
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
                            <div className="py-4 px-2 border-b-2 border-purple-500 text-purple-400 font-medium">
                                🐛 Issues
                            </div>
                            <Link
                                href={`/repositories/${repository.slug}/pull-requests`}
                                className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-300 font-medium transition-colors"
                            >
                                🔀 Pull Requests
                            </Link>
                            <div className="py-4 px-2 border-b-2 border-transparent text-gray-400 font-medium">
                                📊 Insights
                            </div>
                        </nav>
                    </div>

                    {/* Issues List */}
                    <div className="p-6">
                        {issues.data.length > 0 ? (
                            <div className="space-y-4">
                                {issues.data.map((issue) => (
                                    <Link
                                        key={issue.id}
                                        href={`/repositories/${repository.slug}/issues/${issue.id}`}
                                        className="block bg-gray-900 rounded-lg border border-gray-600 p-6 hover:border-purple-500 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-white">
                                                        {issue.title}
                                                    </h3>
                                                    <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                                                        {issue.priority.toUpperCase()}
                                                    </Badge>
                                                    <Badge variant="outline" className={getStatusColor(issue.status)}>
                                                        {issue.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-400 mb-3 line-clamp-2">
                                                    {issue.description.length > 150
                                                        ? issue.description.substring(0, 150) + '...'
                                                        : issue.description
                                                    }
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>Created by {issue.author.name}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(issue.created_at)}</span>
                                                    {issue.assignee && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-purple-400">
                                                                Assigned to {issue.assignee.name}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🐛</div>
                                <h3 className="text-xl font-semibold text-white mb-2">No issues yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Issues help you track bugs, feature requests, and other project tasks.
                                </p>
                                {auth.user && (
                                    <Link href={`/repositories/${repository.slug}/issues/create`}>
                                        <Button className="bg-green-600 hover:bg-green-700">
                                            ➕ Create your first issue
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