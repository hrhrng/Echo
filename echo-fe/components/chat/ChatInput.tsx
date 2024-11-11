import React, {useState, useRef, useLayoutEffect} from 'react';
import {Layout, Lightbulb, MessagesSquare, Send} from 'lucide-react';
import { ReferencedItems, type ReferenceItem } from './reference/ReferencedItems';
import { useReference } from '@/contexts/ReferenceContext';
import QuestionSuggestions from "@/components/chat/QuestionSuggestion";

interface ChatInputProps {
    onClose: () => void;
    onSendMessage: (message: string) => void;
    isPanelOpen?: boolean;
    onRendered: (height: number) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onClose, onSendMessage, isPanelOpen = false , onRendered}) => {
    const [message, setMessage] = useState('');
    const { references, addReference, clearReferences } = useReference();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const rootRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (rootRef.current && onRendered) {
            // 获取实际高度
            const boundingHeight = rootRef.current.getBoundingClientRect().height;
            // 通知父组件已渲染完成，并传递高度
            onRendered(boundingHeight);
        }
    }, [onRendered]); // 当onRendered变化时重新执行

    const handleContentChange = () => {
        if (rootRef.current && onRendered) {
            const height = rootRef.current.getBoundingClientRect().height;
            onRendered(height);
        }
    };


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

        handleContentChange();
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

    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleQuestionSelect = (question) => {
        setMessage(question);
        setShowSuggestions(false);
    };


    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6" ref={rootRef}>

                <div className="mb-0">
                    <ReferencedItems onItemRemove={()=>handleContentChange()} onSuggestionSelect={handleQuestionSelect}/>
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