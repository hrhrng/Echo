// components/RemindDialog.js
// components/RemindDialog.js
import {Loader2, RefreshCw, Send, X} from "lucide-react";
import React, {useEffect, useState} from "react";
import {ApiError, reminderApi} from "@/services/api";
// components/RemindDialog.js
const RemindDialog = ({ open, onOpenChange, todo, onSend }) => {
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState('');

    // 打字机效果
    useEffect(() => {
        if (!message || currentIndex >= message.length) return;

        const timer = setTimeout(() => {
            setDisplayText(prev => prev + message[currentIndex]);
            setCurrentIndex(prev => prev + 1);
        }, 30); // 可以调整这个值来改变打字速度

        return () => clearTimeout(timer);
    }, [currentIndex, message]);

    const generateMessage = async () => {
        setIsGenerating(true);
        setError('');
        setDisplayText('');
        setCurrentIndex(0);

        try {
            const result = await reminderApi.generateReminder({
                todoId: todo.todoId,
                event: todo.title,
                before: message,
                userInstruction: feedback
            });

            if (result.success) {
                setMessage(result.message);
                // 重置打字机索引以开始新的打字效果
                setCurrentIndex(0);
            } else {
                setError(result.message || '生成失败');
            }
        } catch (error) {
            if (error instanceof ApiError) {
                setError(`生成失败: ${error.message}`);
            } else {
                setError('生成消息失败，请重试');
            }
            console.error('生成消息失败:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // 清理函数
    const cleanup = () => {
        setMessage('');
        setFeedback('');
        setDisplayText('');
        setCurrentIndex(0);
        setError('');
        setIsGenerating(false);
    };

    useEffect(() => {
        if (open) {
            generateMessage();
        } else {
            cleanup();
        }
    }, [open]);

    const handleSend = async () => {
        try {
            await reminderApi.sendReminder(message, todo.todoId);
            onSend(message, feedback);
            onOpenChange(false);
        } catch (error) {
            if (error instanceof ApiError) {
                setError(`发送失败: ${error.message}`);
            } else {
                setError('发送消息失败，请重试');
            }
            console.error('发送消息失败:', error);
        }
    };

    return open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">待办催办</h3>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <textarea
                            value={isGenerating ? displayText : message}
                            onChange={(e) => !isGenerating && setMessage(e.target.value)}
                            placeholder={isGenerating ? "正在生成催办消息..." : "请输入催办消息"}
                            className="w-full min-h-[200px] p-4 rounded-lg border border-gray-200
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                resize-none transition-all"
                            disabled={isGenerating}
                        />
                        {isGenerating && (
                            <div className="absolute right-3 top-3 flex items-center gap-2
                                text-sm text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                正在生成
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
                            className="w-full h-24 p-3 rounded-lg border border-gray-200
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                resize-none transition-all text-sm"
                            disabled={isGenerating}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
                    <button
                        onClick={generateMessage}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                            text-gray-700 bg-white border border-gray-300 rounded-lg
                            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        重新生成
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isGenerating || !message.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                            text-white bg-blue-600 rounded-lg hover:bg-blue-700
                            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                        发送催办
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default RemindDialog;