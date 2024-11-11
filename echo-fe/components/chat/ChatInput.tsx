import React, { useState, useRef } from 'react';
import { Layout, Send } from 'lucide-react';
import { ReferencedItems, type ReferenceItem } from './reference/ReferencedItems';
import { useReference } from '@/contexts/ReferenceContext';


interface ChatInputProps {
    onClose: () => void;
    onSendMessage: (data: { message: string; references: ReferenceItem[] }) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onClose, onSendMessage }) => {
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

        // 检查是否真的离开了容器
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

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage && !references.length) return;

        onSendMessage(trimmedMessage, references);  // 直接传递消息文本
        setMessage('');
        clearReferences();
    };

    return (
        <div className="flex-none bg-white border-t">
            {/* 引用内容展示区域 */}
            {references.length > 0 && (
                <div className="border-b border-gray-100">
                    <div className="max-w-6xl mx-auto">
                        <ReferencedItems/>
                    </div>
                </div>
            )}

            {/* 输入区域 */}
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div
                        ref={containerRef}
                        className={`relative flex rounded-xl shadow-sm ${
                            isDraggingOver ? 'ring-2 ring-blue-300' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {/* ... 按钮和输入框部分保持不变 ... */}
                        <button
                            onClick={onClose}
                            className="flex-none px-4 py-3 rounded-l-xl flex items-center gap-2 bg-gray-200 text-gray-800 shadow-inner"
                        >
                            <Layout className="w-4 h-4" />
                            <span className="text-sm font-medium">项目面板</span>
                        </button>
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="输入新的问题..."
                                className="w-full px-4 py-3 pr-12 rounded-r-xl bg-white border-l border-gray-200
                                    focus:ring-2 focus:ring-blue-200 focus:border-transparent
                                    transition-all placeholder-gray-400"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!message.trim() && !references.length}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg 
                                    transition-colors ${
                                    message.trim() || references.length
                                        ? 'text-blue-500 hover:bg-blue-50'
                                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                }`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;