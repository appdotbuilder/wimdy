import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    issues_count?: number;
    pull_requests_count?: number;
    open_issues_count?: number;
    open_pull_requests_count?: number;
    owner: {
        id: number;
        name: string;
    };
    commits: Commit[];
    [key: string]: unknown;
}

interface CodeFile {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size?: number;
    lastModified?: string;
}

interface Props {
    repository: Repository;
    [key: string]: unknown;
}

export default function RepositoryShow({ repository }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;
    const [activeTab, setActiveTab] = useState<'code' | 'issues' | 'pulls' | 'insights'>('code');
    const [showCloneModal, setShowCloneModal] = useState(false);

    // Mock file browser data - in real app this would come from backend
    const mockFiles: CodeFile[] = [
        { name: '.gitignore', path: '.gitignore', type: 'file', size: 1250, lastModified: '2024-01-15' },
        { name: 'README.md', path: 'README.md', type: 'file', size: 3200, lastModified: '2024-01-14' },
        { name: 'package.json', path: 'package.json', type: 'file', size: 850, lastModified: '2024-01-13' },
        { name: 'src', path: 'src', type: 'directory', lastModified: '2024-01-15' },
        { name: 'docs', path: 'docs', type: 'directory', lastModified: '2024-01-12' },
        { name: 'tests', path: 'tests', type: 'directory', lastModified: '2024-01-14' },
        { name: 'vite.config.ts', path: 'vite.config.ts', type: 'file', size: 680, lastModified: '2024-01-10' },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
        return `${Math.round(bytes / (1024 * 1024))} MB`;
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
    const cloneUrl = `https://github.com/${repository.owner.name}/${repository.name}.git`;

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const navigateToIssues = () => {
        router.get(`/repositories/${repository.slug}/issues`);
    };

    const navigateToPullRequests = () => {
        router.get(`/repositories/${repository.slug}/pull-requests`);
    };

    const renderCodeTab = () => (
        <div className="space-y-6">
            {/* Branch Info & Clone */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
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
                    <Button 
                        onClick={() => setShowCloneModal(true)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        💾 Clone or Download
                    </Button>
                </div>
                
                {showCloneModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Clone Repository</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowCloneModal(false)}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    ✕
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        HTTPS Clone URL
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={cloneUrl}
                                            readOnly
                                            className="flex-1 bg-gray-900 border border-gray-600 rounded-l px-3 py-2 text-sm text-gray-300 font-mono"
                                        />
                                        <Button
                                            onClick={() => copyToClipboard(cloneUrl)}
                                            className="bg-gray-700 hover:bg-gray-600 border border-l-0 border-gray-600 rounded-r px-3"
                                        >
                                            📋
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400">
                                    <p className="mb-2">Clone this repository:</p>
                                    <code className="bg-gray-900 px-2 py-1 rounded text-xs">
                                        git clone {cloneUrl}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* File Browser */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                        📁 Repository Files
                    </h2>
                </div>
                <div className="divide-y divide-gray-700">
                    {mockFiles.map((file, index) => (
                        <div key={index} className="p-4 hover:bg-gray-750 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">
                                        {file.type === 'directory' ? '📁' : '📄'}
                                    </span>
                                    <div>
                                        <div className="font-medium text-white">
                                            {file.name}
                                        </div>
                                        {file.type === 'file' && file.size && (
                                            <div className="text-sm text-gray-400">
                                                {formatFileSize(file.size)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400">
                                    {file.lastModified && formatDate(file.lastModified)}
                                </div>
                            </div>
                        </div>
                    ))}
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
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => copyToClipboard(commit.hash)}
                                            className="border-gray-600 text-gray-400 hover:bg-gray-700"
                                        >
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
        </div>
    );

    const renderInsightsTab = () => (
        <div className="space-y-6">
            {/* Repository Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-green-400">
                                {repository.commits.reduce((total, commit) => total + commit.additions, 0)}
                            </div>
                            <div className="text-sm text-gray-400">Total Additions</div>
                        </div>
                        <div className="text-3xl">➕</div>
                    </div>
                </div>
            </div>

            {/* Issues & Pull Requests Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-red-400">{repository.issues_count || 0}</div>
                            <div className="text-sm text-gray-400">Total Issues</div>
                        </div>
                        <div className="text-3xl">🐛</div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-orange-400">{repository.open_issues_count || 0}</div>
                            <div className="text-sm text-gray-400">Open Issues</div>
                        </div>
                        <div className="text-3xl">🔓</div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-cyan-400">{repository.pull_requests_count || 0}</div>
                            <div className="text-sm text-gray-400">Total PRs</div>
                        </div>
                        <div className="text-3xl">🔀</div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-pink-400">{repository.open_pull_requests_count || 0}</div>
                            <div className="text-sm text-gray-400">Open PRs</div>
                        </div>
                        <div className="text-3xl">🔄</div>
                    </div>
                </div>
            </div>

            {/* Language Breakdown */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📊 Language Breakdown</h3>
                {repository.language ? (
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full ${getLanguageColor(repository.language)}`}></div>
                            <span className="text-white font-medium">{repository.language}</span>
                        </div>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div className={`h-2 rounded-full ${getLanguageColor(repository.language)} w-4/5`}></div>
                        </div>
                        <span className="text-gray-400 text-sm">80%</span>
                    </div>
                ) : (
                    <div className="text-gray-400">No language data available</div>
                )}
            </div>

            {/* Activity Chart Placeholder */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📈 Commit Activity</h3>
                <div className="h-48 bg-gray-900 rounded border border-gray-600 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">📊</div>
                        <p>Activity chart coming soon!</p>
                    </div>
                </div>
            </div>
        </div>
    );

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
                                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-300 bg-yellow-900/30">
                                            🔒 Private
                                        </Badge>
                                    )}
                                    {repository.is_fork && (
                                        <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-900/30">
                                            🍴 Fork
                                        </Badge>
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
                            <button 
                                onClick={() => setActiveTab('code')}
                                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                                    activeTab === 'code' 
                                        ? 'border-purple-500 text-purple-400' 
                                        : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                📁 Code
                            </button>
                            <button 
                                onClick={navigateToIssues}
                                className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-300 font-medium transition-colors"
                            >
                                🐛 Issues
                            </button>
                            <button 
                                onClick={navigateToPullRequests}
                                className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-300 font-medium transition-colors"
                            >
                                🔀 Pull Requests
                            </button>
                            <button 
                                onClick={() => setActiveTab('insights')}
                                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                                    activeTab === 'insights' 
                                        ? 'border-purple-500 text-purple-400' 
                                        : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                📊 Insights
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'code' && renderCodeTab()}
                        {activeTab === 'insights' && renderInsightsTab()}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}