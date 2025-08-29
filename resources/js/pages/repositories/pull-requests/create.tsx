import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Repository {
    id: number;
    name: string;
    slug: string;
    default_branch: string;
    owner: {
        name: string;
    };
}

interface Props {
    repository: Repository;
    [key: string]: unknown;
}

export default function CreatePullRequest({ repository }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        source_branch: '',
        target_branch: repository.default_branch,
    });

    // Mock available branches - in real app this would come from backend
    const mockBranches = [
        repository.default_branch,
        'feature/user-authentication',
        'feature/dashboard-improvements', 
        'bugfix/login-issue',
        'develop',
        'staging'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/repositories/${repository.slug}/pull-requests`);
    };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
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
                        <span className="text-white">New Pull Request</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-white">🔀 Create New Pull Request</h1>
                </div>

                {/* Branch Selection */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🌳 Compare Changes</h3>
                    <div className="grid md:grid-cols-3 gap-4 items-center">
                        {/* Source Branch */}
                        <div className="space-y-2">
                            <Label htmlFor="source_branch" className="text-sm font-medium text-gray-300">
                                Source Branch (from) *
                            </Label>
                            <Select value={data.source_branch} onValueChange={(value) => setData('source_branch', value)}>
                                <SelectTrigger className="w-full bg-gray-900 border-gray-600 text-white focus:border-purple-500">
                                    <SelectValue placeholder="Select source branch" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                    {mockBranches.filter(branch => branch !== data.target_branch).map((branch) => (
                                        <SelectItem key={branch} value={branch} className="text-white focus:bg-gray-700">
                                            🌿 {branch}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.source_branch && (
                                <div className="text-red-400 text-sm">{errors.source_branch}</div>
                            )}
                        </div>

                        {/* Arrow */}
                        <div className="text-center text-gray-400 text-2xl">
                            →
                        </div>

                        {/* Target Branch */}
                        <div className="space-y-2">
                            <Label htmlFor="target_branch" className="text-sm font-medium text-gray-300">
                                Target Branch (to) *
                            </Label>
                            <Select value={data.target_branch} onValueChange={(value) => setData('target_branch', value)}>
                                <SelectTrigger className="w-full bg-gray-900 border-gray-600 text-white focus:border-purple-500">
                                    <SelectValue placeholder="Select target branch" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                    {mockBranches.filter(branch => branch !== data.source_branch).map((branch) => (
                                        <SelectItem key={branch} value={branch} className="text-white focus:bg-gray-700">
                                            🌿 {branch}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.target_branch && (
                                <div className="text-red-400 text-sm">{errors.target_branch}</div>
                            )}
                        </div>
                    </div>

                    {data.source_branch && data.target_branch && (
                        <div className="mt-4 p-4 bg-gray-900 rounded border border-gray-600">
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-400">Comparing:</span>
                                <code className="bg-gray-800 px-2 py-1 rounded text-purple-400">
                                    {data.source_branch}
                                </code>
                                <span className="text-gray-400">→</span>
                                <code className="bg-gray-800 px-2 py-1 rounded text-blue-400">
                                    {data.target_branch}
                                </code>
                            </div>
                        </div>
                    )}
                </div>

                {/* PR Details Form */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">📝 Pull Request Details</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                                Title *
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Enter a descriptive title for the pull request"
                                className="w-full bg-gray-900 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                                required
                            />
                            {errors.title && (
                                <div className="text-red-400 text-sm">{errors.title}</div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                                Description *
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the changes in this pull request. Include:&#10;• What changes were made&#10;• Why these changes are needed&#10;• How to test the changes&#10;• Any breaking changes or migration steps"
                                rows={10}
                                className="w-full bg-gray-900 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                                required
                            />
                            {errors.description && (
                                <div className="text-red-400 text-sm">{errors.description}</div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center space-x-4 pt-4">
                            <Button
                                type="submit"
                                disabled={processing || !data.source_branch || !data.target_branch}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {processing ? 'Creating...' : '🔀 Create Pull Request'}
                            </Button>
                            <Link href={`/repositories/${repository.slug}/pull-requests`}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Tips */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">💡 Writing Great Pull Requests</h3>
                    <div className="space-y-3 text-sm text-gray-400">
                        <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <div>
                                <strong className="text-white">Use a clear, descriptive title</strong>
                                <p>Summarize what the PR accomplishes</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <div>
                                <strong className="text-white">Explain the "why" not just the "what"</strong>
                                <p>Help reviewers understand the reasoning behind changes</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <div>
                                <strong className="text-white">Include testing instructions</strong>
                                <p>Make it easy for reviewers to test your changes</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <div>
                                <strong className="text-white">Link related issues</strong>
                                <p>Reference any issues this PR addresses or closes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}