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

interface Issue {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    created_at: string;
    updated_at: string;
    author: {
        name: string;
    };
    assignee?: {
        name: string;
    };
    comments: Comment[];
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
    issue: Issue;
    [key: string]: unknown;
}

export default function IssueShow({ repository, issue }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;
    const [showCommentForm, setShowCommentForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
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

    const handleStatusToggle = () => {
        const newStatus = issue.status === 'open' ? 'closed' : 'open';
        router.put(`/repositories/${repository.slug}/issues/${issue.id}`, {
            title: issue.title,
            description: issue.description,
            priority: issue.priority,
            status: newStatus,
            assignee_id: issue.assignee ? 1 : null // Placeholder since we don't have the actual ID
        });
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/repositories/${repository.slug}/issues/${issue.id}/comments`, {
            onSuccess: () => {
                reset();
                setShowCommentForm(false);
            }
        });
    };

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
                        <Link href={`/repositories/${repository.slug}/issues`} className="hover:text-white">
                            Issues
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">#{issue.id}</span>
                    </nav>
                    
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                                <h1 className="text-3xl font-bold text-white">
                                    {issue.title}
                                </h1>
                                <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                                    {issue.priority.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(issue.status)}>
                                    {issue.status.toUpperCase()}
                                </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>
                                    Created by <span className="text-white">{issue.author.name}</span> on {formatDate(issue.created_at)}
                                </span>
                                {issue.assignee && (
                                    <>
                                        <span>•</span>
                                        <span>
                                            Assigned to <span className="text-purple-400">{issue.assignee.name}</span>
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {auth.user && (
                                <>
                                    <Button
                                        onClick={handleStatusToggle}
                                        variant="outline"
                                        className={issue.status === 'open' 
                                            ? "border-purple-500 text-purple-400 hover:bg-purple-900/20"
                                            : "border-green-500 text-green-400 hover:bg-green-900/20"
                                        }
                                    >
                                        {issue.status === 'open' ? '✓ Close Issue' : '🔄 Reopen Issue'}
                                    </Button>
                                    <Link href={`/repositories/${repository.slug}/issues/${issue.id}/edit`}>
                                        <Button className="bg-gray-700 hover:bg-gray-600">
                                            ✏️ Edit
                                        </Button>
                                    </Link>
                                </>
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
                                className="py-4 px-2 border-b-2 border-purple-500 text-purple-400 font-medium"
                            >
                                🐛 Issues
                            </Link>
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
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Issue Description */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {issue.author.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-medium text-white">{issue.author.name}</div>
                                    <div className="text-sm text-gray-400">commented {formatDateTime(issue.created_at)}</div>
                                </div>
                            </div>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 whitespace-pre-wrap">{issue.description}</p>
                            </div>
                        </div>

                        {/* Comments */}
                        {issue.comments.map((comment) => (
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

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Issue Details */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">📋 Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Status</div>
                                    <Badge variant="outline" className={getStatusColor(issue.status)}>
                                        {issue.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Priority</div>
                                    <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                                        {issue.priority.toUpperCase()}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Author</div>
                                    <div className="text-white">{issue.author.name}</div>
                                </div>
                                {issue.assignee && (
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Assignee</div>
                                        <div className="text-white">{issue.assignee.name}</div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Created</div>
                                    <div className="text-white">{formatDateTime(issue.created_at)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Updated</div>
                                    <div className="text-white">{formatDateTime(issue.updated_at)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Participants */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">👥 Participants</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                        {issue.author.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-sm text-white">{issue.author.name}</div>
                                </div>
                                {issue.assignee && issue.assignee.name !== issue.author.name && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                            {issue.assignee.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-sm text-white">{issue.assignee.name}</div>
                                    </div>
                                )}
                                {/* Add unique commenters */}
                                {[...new Set(issue.comments.map(c => c.author.name))]
                                    .filter(name => name !== issue.author.name && name !== issue.assignee?.name)
                                    .map((name) => (
                                        <div key={name} className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-sm text-white">{name}</div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}