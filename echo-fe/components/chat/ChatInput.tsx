import React, { useState, useRef } from 'react';
import {Layout, MessagesSquare, Send} from 'lucide-react';
import { ReferencedItems, type ReferenceItem } from './reference/ReferencedItems';
import { useReference } from '@/contexts/ReferenceContext';

interface ChatInputProps {
    onClose: () => void;
    onSendMessage: (message: string) => void;
    isPanelOpen?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onClose, onSendMessage, isPanelOpen = false }) => {
    const [message, setMessage] = useState('');
    const { references, addReference, clearReferences } = useReference();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
            setIsDraggingOver(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);

        try {
            const jsonData = e.dataTransfer.getData('application/json') ||
                e.dataTransfer.getData('text/plain');
            if (!jsonData) return;

            const data = JSON.parse(jsonData);
            addReference(data);
        } catch (error) {
            console.error('Error processing drop:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage && !references.length) return;

        onSendMessage(trimmedMessage);
        setMessage('');
    };

    const suggestedQuestions = [
        "这段代码如何优化性能？",
        "如何处理边界情况？",
        "有没有更好的实现方式？",
        "这个功能是否需要添加错误处理？"
    ]

    const handleQuestionClick = (question: string) => {
        onSendMessage(question);
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6">

            {references.length > 0 && (
                <div className="mb-0">
                    <ReferencedItems />
                </div>
            )}

            {/* 推荐问题模块 */}
            <div className="mb-3">
                <div className="rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gray-50/95 backdrop-blur-sm p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MessagesSquare className="w-4 h-4" />
                        <span>推荐问题</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuestionClick(question)}
                                className="px-3 py-1.5
                                bg-white hover:bg-blue-50
                                rounded-lg shadow-sm
                                border border-blue-100
                                text-sm text-gray-700
                                transition-all duration-200
                                hover:border-blue-200 hover:scale-[1.02]
                                active:scale-[0.98]"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            <div
                ref={containerRef}
                className={`relative flex rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                    bg-white/80 backdrop-blur-sm
                    ${isDraggingOver ? 'ring-2 ring-blue-300' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <button
                    onClick={onClose}
                    className={`flex-none px-4 py-3 rounded-l-xl flex items-center gap-2
                        transition-all duration-200 ${
                        isPanelOpen
                            ? 'bg-gray-200/90 text-gray-800 shadow-inner'
                            : 'text-gray-600 hover:bg-gray-50/30 active:bg-gray-100/30'
                    }`}
                >
                    <Layout className="w-4 h-4"/>
                    <span className="text-sm font-medium">项目面板</span>
                </button>
                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入新的问题..."
                        className="w-full px-4 py-3 pr-12 rounded-r-xl border-l border-gray-200/50
                            focus:ring-2 focus:ring-blue-200 focus:border-transparent bg-transparent
                            transition-all placeholder-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() && !references.length}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg 
                            transition-colors ${
                            message.trim() || references.length
                                ? 'text-blue-500 hover:bg-blue-50/30'
                                : 'text-gray-400 bg-gray-100/30 cursor-not-allowed'
                        }`}
                    >
                        <Send className="w-5 h-5"/>
                    </button>
                </div>
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">
                按 Enter 发送，Shift + Enter 换行
            </div>
        </div>
    );
};

export default ChatInput;