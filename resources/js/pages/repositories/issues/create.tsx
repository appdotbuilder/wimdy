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
    owner: {
        name: string;
    };
}

interface Props {
    repository: Repository;
    [key: string]: unknown;
}

export default function CreateIssue({ repository }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        priority: 'medium',
        assignee_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/repositories/${repository.slug}/issues`);
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
                        <Link href={`/repositories/${repository.slug}/issues`} className="hover:text-white">
                            Issues
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">New Issue</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-white">🐛 Create New Issue</h1>
                </div>

                {/* Form */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
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
                                placeholder="Enter a descriptive title for the issue"
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
                                placeholder="Provide a detailed description of the issue, including steps to reproduce, expected behavior, and actual behavior."
                                rows={8}
                                className="w-full bg-gray-900 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                                required
                            />
                            {errors.description && (
                                <div className="text-red-400 text-sm">{errors.description}</div>
                            )}
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority" className="text-sm font-medium text-gray-300">
                                Priority
                            </Label>
                            <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                <SelectTrigger className="w-full bg-gray-900 border-gray-600 text-white focus:border-purple-500">
                                    <SelectValue placeholder="Select priority level" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                    <SelectItem value="low" className="text-green-400 focus:bg-gray-700">
                                        🟢 Low Priority
                                    </SelectItem>
                                    <SelectItem value="medium" className="text-yellow-400 focus:bg-gray-700">
                                        🟡 Medium Priority
                                    </SelectItem>
                                    <SelectItem value="high" className="text-orange-400 focus:bg-gray-700">
                                        🟠 High Priority
                                    </SelectItem>
                                    <SelectItem value="critical" className="text-red-400 focus:bg-gray-700">
                                        🔴 Critical Priority
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && (
                                <div className="text-red-400 text-sm">{errors.priority}</div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center space-x-4 pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {processing ? 'Creating...' : '🐛 Create Issue'}
                            </Button>
                            <Link href={`/repositories/${repository.slug}/issues`}>
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
                    <h3 className="text-lg font-semibold text-white mb-4">💡 Writing Great Issues</h3>
                    <div className="space-y-3 text-sm text-gray-400">
                        <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <div>
                                <strong className="text-white">Use a clear, descriptive title</strong>
                                <p>Summarize the issue in one sentence</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <div>
                                <strong className="text-white">Include steps to reproduce</strong>
                                <p>Help others understand how to recreate the issue</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <div>
                                <strong className="text-white">Describe expected vs actual behavior</strong>
                                <p>What should happen vs what actually happens</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <div>
                                <strong className="text-white">Set appropriate priority</strong>
                                <p>Help maintainers understand urgency level</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}