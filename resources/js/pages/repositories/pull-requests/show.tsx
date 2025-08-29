import React, { useState } from 'react';
import { Link, router, usePage, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    author: {
        name: string;
    };
}

interface Commit {
    id: number;
    hash: string;
    message: string;
    author_name: string;
    committed_at: string;
}

interface FileChange {
    file: string;
    additions: number;
    deletions: number;
    changes: number;
    status: 'added' | 'modified' | 'deleted' | 'renamed';
}

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
    updated_at: string;
    author: {
        name: string;
    };
    comments: Comment[];
    commits: Commit[];
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
    pullRequest: PullRequest;
    [key: string]: unknown;
}

export default function PullRequestShow({ repository, pullRequest }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;
    const [activeTab, setActiveTab] = useState<'conversation' | 'commits' | 'files'>('conversation');
    const [showCommentForm, setShowCommentForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
    });

    // Mock file changes data - in real app this would come from backend
    const mockFileChanges: FileChange[] = [
        { file: 'src/components/Header.tsx', additions: 25, deletions: 5, changes: 30, status: 'modified' },
        { file: 'src/utils/helpers.ts', additions: 15, deletions: 0, changes: 15, status: 'added' },
        { file: 'README.md', additions: 3, deletions: 1, changes: 4, status: 'modified' },
        { file: 'package.json', additions: 2, deletions: 0, changes: 2, status: 'modified' },
        { file: 'src/legacy/old-component.tsx', additions: 0, deletions: 45, changes: 45, status: 'deleted' },
    ];

    const totalAdditions = mockFileChanges.reduce((sum, file) => sum + file.additions, 0);
    const totalDeletions = mockFileChanges.reduce((sum, file) => sum + file.deletions, 0);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
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

    const getFileStatusIcon = (status: string) => {
        const icons: { [key: string]: string } = {
            'added': '🆕',
            'modified': '📝',
            'deleted': '🗑️',
            'renamed': '📛',
        };
        return icons[status] || '📄';
    };

    const getFileStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'added': 'text-green-400',
            'modified': 'text-blue-400',
            'deleted': 'text-red-400',
            'renamed': 'text-yellow-400',
        };
        return colors[status] || 'text-gray-400';
    };

    const handleStatusChange = (newStatus: string) => {
        router.put(`/repositories/${repository.slug}/pull-requests/${pullRequest.id}`, {
            title: pullRequest.title,
            description: pullRequest.description,
            source_branch: pullRequest.source_branch,
            target_branch: pullRequest.target_branch,
            status: newStatus
        });
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/repositories/${repository.slug}/pull-requests/${pullRequest.id}/comments`, {
            onSuccess: () => {
                reset();
                setShowCommentForm(false);
            }
        });
    };

    const renderConversationTab = () => (
        <div className="space-y-6">
            {/* PR Description */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {pullRequest.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-white">{pullRequest.author.name}</div>
                        <div className="text-sm text-gray-400">opened this pull request {formatDateTime(pullRequest.created_at)}</div>
                    </div>
                </div>
                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap">{pullRequest.description}</p>
                </div>
            </div>

            {/* Comments */}
            {pullRequest.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {comment.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-medium text-white">{comment.author.name}</div>
                            <div className="text-sm text-gray-400">commented {formatDateTime(comment.created_at)}</div>
                        </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                </div>
            ))}

            {/* Comment Form */}
            {auth.user && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    {!showCommentForm ? (
                        <Button 
                            onClick={() => setShowCommentForm(true)}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-left justify-start"
                        >
                            💬 Write a comment...
                        </Button>
                    ) : (
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="font-medium text-white">{auth.user.name}</div>
                            </div>
                            <Textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Leave a comment..."
                                rows={4}
                                className="w-full bg-gray-900 border-gray-600 text-white"
                                required
                            />
                            {errors.content && (
                                <div className="text-red-400 text-sm">{errors.content}</div>
                            )}
                            <div className="flex items-center space-x-3">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {processing ? 'Adding...' : '💬 Comment'}
                                </Button>
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowCommentForm(false);
                                        reset();
                                    }}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );

    const renderCommitsTab = () => (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">
                    📝 {pullRequest.commits_count} Commits
                </h3>
            </div>
            <div className="divide-y divide-gray-700">
                {pullRequest.commits.map((commit) => (
                    <div key={commit.id} className="p-6 hover:bg-gray-750 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="font-medium text-white mb-2">
                                    {commit.message}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <span>{commit.author_name}</span>
                                    <span>{formatDateTime(commit.committed_at)}</span>
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
                ))}
            </div>
        </div>
    );

    const renderFilesTab = () => (
        <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                    📄 {pullRequest.files_changed} Files Changed
                </h3>
                <div className="flex items-center space-x-6 text-sm">
                    <span className="text-green-400">+{totalAdditions} additions</span>
                    <span className="text-red-400">-{totalDeletions} deletions</span>
                    <span className="text-gray-400">{totalAdditions + totalDeletions} total changes</span>
                </div>
            </div>

            {/* File Changes */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="divide-y divide-gray-700">
                    {mockFileChanges.map((file, index) => (
                        <div key={index} className="p-6 hover:bg-gray-750 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className={`text-xl ${getFileStatusColor(file.status)}`}>
                                        {getFileStatusIcon(file.status)}
                                    </span>
                                    <div>
                                        <div className="font-medium text-white font-mono text-sm">
                                            {file.file}
                                        </div>
                                        <div className="text-xs text-gray-400 capitalize">
                                            {file.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                    {file.additions > 0 && (
                                        <span className="text-green-400">+{file.additions}</span>
                                    )}
                                    {file.deletions > 0 && (
                                        <span className="text-red-400">-{file.deletions}</span>
                                    )}
                                    <span className="text-gray-400">{file.changes} changes</span>
                                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-gray-700">
                                        View
                                    </Button>
                                </div>
                            </div>

                            {/* Diff Preview Bars */}
                            <div className="mt-3 flex h-2 rounded overflow-hidden bg-gray-900">
                                {file.additions > 0 && (
                                    <div 
                                        className="bg-green-500"
                                        style={{ width: `${(file.additions / file.changes) * 100}%` }}
                                    ></div>
                                )}
                                {file.deletions > 0 && (
                                    <div 
                                        className="bg-red-500"
                                        style={{ width: `${(file.deletions / file.changes) * 100}%` }}
                                    ></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Repository Header */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <nav className="text-sm text-gray-400 mb-4">
                        <Link href="/repositories" className="hover:text-white">Repositories</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/repositories/${repository.slug}`} className="hover:text-white">
                            {repository.owner.name}/{repository.name}
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href={`/repositories/${repository.slug}/pull-requests`} className="hover:text-white">
                            Pull Requests
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">#{pullRequest.id}</span>
                    </nav>
                    
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                                <h1 className="text-3xl font-bold text-white">
                                    {pullRequest.title}
                                </h1>
                                <Badge variant="outline" className={getStatusColor(pullRequest.status)}>
                                    {getStatusIcon(pullRequest.status)} {pullRequest.status.toUpperCase()}
                                </Badge>
                                {pullRequest.is_draft && (
                                    <Badge variant="outline" className="bg-gray-900/30 text-gray-300 border-gray-500/30">
                                        📝 DRAFT
                                    </Badge>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                                <span>
                                    Created by <span className="text-white">{pullRequest.author.name}</span> on {formatDate(pullRequest.created_at)}
                                </span>
                                <span>•</span>
                                <span className="text-blue-400">
                                    {pullRequest.source_branch} → {pullRequest.target_branch}
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>📝 {pullRequest.commits_count} commits</span>
                                <span>📄 {pullRequest.files_changed} files changed</span>
                                <span className="text-green-400">+{totalAdditions}</span>
                                <span className="text-red-400">-{totalDeletions}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {auth.user && pullRequest.status === 'open' && (
                                <>
                                    <Button
                                        onClick={() => handleStatusChange('merged')}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        ✅ Merge Pull Request
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusChange('closed')}
                                        variant="outline"
                                        className="border-red-500 text-red-400 hover:bg-red-900/20"
                                    >
                                        ❌ Close
                                    </Button>
                                </>
                            )}
                            {auth.user && pullRequest.status === 'closed' && (
                                <Button
                                    onClick={() => handleStatusChange('open')}
                                    variant="outline"
                                    className="border-green-500 text-green-400 hover:bg-green-900/20"
                                >
                                    🔄 Reopen
                                </Button>
                            )}
                            {auth.user && (
                                <Link href={`/repositories/${repository.slug}/pull-requests/${pullRequest.id}/edit`}>
                                    <Button className="bg-gray-700 hover:bg-gray-600">
                                        ✏️ Edit
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
                            <Link
                                href={`/repositories/${repository.slug}/pull-requests`}
                                className="py-4 px-2 border-b-2 border-purple-500 text-purple-400 font-medium"
                            >
                                🔀 Pull Requests
                            </Link>
                            <div className="py-4 px-2 border-b-2 border-transparent text-gray-400 font-medium">
                                📊 Insights
                            </div>
                        </nav>
                    </div>

                    {/* PR Sub-navigation */}
                    <div className="border-b border-gray-700">
                        <nav className="flex space-x-6 px-6">
                            <button
                                onClick={() => setActiveTab('conversation')}
                                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'conversation'
                                        ? 'border-purple-500 text-purple-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                💬 Conversation {pullRequest.comments.length > 0 && `(${pullRequest.comments.length})`}
                            </button>
                            <button
                                onClick={() => setActiveTab('commits')}
                                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'commits'
                                        ? 'border-purple-500 text-purple-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                📝 Commits ({pullRequest.commits_count})
                            </button>
                            <button
                                onClick={() => setActiveTab('files')}
                                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'files'
                                        ? 'border-purple-500 text-purple-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                📄 Files Changed ({pullRequest.files_changed})
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'conversation' && renderConversationTab()}
                        {activeTab === 'commits' && renderCommitsTab()}
                        {activeTab === 'files' && renderFilesTab()}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}