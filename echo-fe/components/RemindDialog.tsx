import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Loader2, X } from 'lucide-react';

interface RemindDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    todo: {
        title: string;
        detail: string;
        assignee: string;
    };
    onSend: (message: string, feedback?: string) => void;
    onRegenerate: () => void;
}

const RemindDialog = ({ open, onOpenChange, todo, onSend }: RemindDialogProps) => {
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 生成消息的函数
    const generateMessage = async () => {
        setIsGenerating(true);
        try {
            // 这里替换为实际的API调用
            const response = await new Promise(resolve =>
                setTimeout(() => resolve(`亲爱的${todo.assignee}：\n\n关于"${todo.title}"的待办事项，想跟您确认一下进展情况。该任务详情为：${todo.detail}。\n\n期待您的回复！`), 1000)
            );
            setCurrentIndex(0);
            setIsTyping(true);
            return response as string;
        } catch (error) {
            console.error('生成消息失败:', error);
            return '';
        } finally {
            setIsGenerating(false);
        }
    };

    // 打字机效果
    useEffect(() => {
        if (!isTyping || !message) return;

        const timer = setTimeout(() => {
            if (currentIndex < message.length) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setIsTyping(false);
            }
        }, 30);

        return () => clearTimeout(timer);
    }, [currentIndex, isTyping, message]);

    // 初始生成和重置
    useEffect(() => {
        if (open) {
            generateMessage().then(newMessage => setMessage(newMessage || ''));
        } else {
            setMessage('');
            setFeedback('');
            setIsGenerating(false);
            setIsTyping(false);
            setCurrentIndex(0);
        }
    }, [open, todo]);

    // 自适应文本框高度
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleRegenerate = async () => {
        const newMessage = await generateMessage();
        setMessage(newMessage || '');
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg" onClick={e => e.stopPropagation()}>
                {/* 对话框头部 */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">待办催办</h3>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* 对话框内容 */}
                <div className="p-4 space-y-4">
                    <div className="relative">
            <textarea
                ref={textareaRef}
                value={isTyping ? message.slice(0, currentIndex) : message}
                onChange={(e) => !isTyping && setMessage(e.target.value)}
                placeholder="正在生成催办消息..."
                className="w-full min-h-[200px] p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                resize-none transition-all"
                disabled={isGenerating || isTyping}
            />

                        {(isGenerating || isTyping) && (
                            <div className="absolute right-3 top-3 flex items-center gap-2 text-sm text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isGenerating ? '正在生成' : '正在输入'}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            修改建议（选填）
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="请输入你的修改建议..."
                            className="w-full h-24 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                resize-none transition-all text-sm"
                        />
                    </div>
                </div>

                {/* 对话框底部 */}
                <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button
                        onClick={handleRegenerate}
                        disabled={isGenerating || isTyping}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
              rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        重新生成
                    </button>
                    <button
                        onClick={() => onSend(message, feedback)}
                        disabled={isGenerating || isTyping || !message.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600
              rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                        发送催办
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemindDialog;