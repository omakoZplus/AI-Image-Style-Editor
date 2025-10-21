import React, { useState } from 'react';

interface PromptEditorProps {
    onSubmit: (prompt: string) => void;
    disabled: boolean;
}

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
        <path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17 15h2"/><path d="M11.8 17.8 13 19"/><path d="M4 21h1"/><path d="M9 15h.01"/><path d="M21 12v1a7 7 0 1 1-12.3-5.3"/><path d="M18 18h1a4 4 0 0 0 0-8h-1"/>
    </svg>
);

const PromptEditor: React.FC<PromptEditorProps> = ({ onSubmit, disabled }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSubmit(prompt.trim());
        }
    };
    
    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Add a retro filter, make it cyberpunk..."
                    disabled={disabled}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 resize-none"
                    rows={3}
                />
                <button
                    type="submit"
                    disabled={disabled || !prompt.trim()}
                    className="w-full flex items-center justify-center p-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    <WandIcon />
                    Generate
                </button>
            </form>
        </div>
    );
};

export default React.memo(PromptEditor);
