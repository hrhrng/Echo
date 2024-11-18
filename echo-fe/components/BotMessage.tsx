import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {Message} from "postcss";
import {Action} from "@/components/ChatState";
import {Check, ClipboardIcon, Send, X} from "lucide-react";
import RemindDialog from "@/components/RemindDialog";
import {todoApi, todoUtils} from "@/services/api";

// 修改后的渲染引用函数
const renderMessageWithQuotes = (text: string, quotes: number[] = [], onQuoteClick: (id: number) => void) => {
    if (!quotes.length) {
        return text;
    }

    const regex = /([^]*?)\{\{quote:(\d+)\}\}/g;
    const parts: Array<{text: string; quoteId?: number}> = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const [, content, quoteId] = match;
        if (content) {
            parts.push({ text: content });
        }
        parts.push({ text: '', quoteId: parseInt(quoteId) });
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex) });
    }

    return parts.map((part, index) => (
        <React.Fragment key={index}>
            {part.text}
            {part.quoteId && (
                <QuoteNumber
                    number={quotes.findIndex(q => q === part.quoteId) + 1}
                    onClick={() => onQuoteClick(part.quoteId!)}
                />
            )}
        </React.Fragment>
    ));
};

const QuoteNumber = ({
                         number,
                         onClick
                     }: {
    number: number;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-medium
            bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full align-top
            transition-colors duration-200 relative -top-1 ml-0.5"
    >
        {number}
    </button>
);


// BotAvatar 组件修改，添加 onClick 属性
const BotAvatar = ({ onClick }: { onClick?: () => void }) => (
    <div
        onClick={onClick}
        className="relative flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-violet-100
            shadow-md flex items-center justify-center overflow-hidden group cursor-pointer
            transition-all duration-300 hover:shadow-lg hover:from-blue-200 hover:to-violet-200"
    >
        {/* Decorative background circles */}
        <div className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-blue-200/40
            transition-transform duration-300 group-hover:scale-125">
        </div>
        <div className="absolute -left-3 -bottom-3 w-7 h-7 rounded-full bg-violet-200/30
            transition-transform duration-300 group-hover:scale-125">
        </div>

        {/* Letter E with enhanced hover effect */}
        <span className="relative text-lg font-bold text-blue-500/90 font-mono transform
            transition-all duration-300 group-hover:scale-125 group-hover:text-blue-600
            hover:rotate-12"
        >
            E
        </span>

        {/* Highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/30
            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        </div>
    </div>
);

const GenUI: React.FC<{
    action: Action;
    onAccept: () => void;
    onDecline: () => void;
}> = ({ action, onAccept, onDecline }) => {
    const [isRemindDialogOpen, setIsRemindDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { type, message } = action.data;
    const todos = JSON.parse(message).todos;
    const todo = todos[0];

    // 处理添加待办
    const handleAddTodo = async () => {
        if (!todo.todoId || !todoUtils.isValidTodoId(todo.todoId)) {
            console.error('Invalid todo ID');
            return;
        }

        setIsSaving(true);
        try {
            const result = await todoApi.saveTodo(todo.todoId);
            const savedTodos = todoUtils.parseTodoResponse(result);
            console.log('Todo saved successfully:', savedTodos);
            onAccept(); // 保存成功后调用原来的 accept 回调
        } catch (error) {
            console.error('Failed to save todo:', error);
            // 这里可以添加错误提示
        } finally {
            setIsSaving(false);
        }
    };

    // 处理催办发送
    const handleRemind = (message: string, feedback?: string) => {
        console.log('Sending reminder:', { message, feedback, todo });
        onAccept();
        setIsRemindDialogOpen(false);
    };

    if (type === 'add') {
        return (
            <div className="mt-2 p-4 rounded-lg bg-blue-50 animate-message-appear">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-blue-900">
                            添加待办事项？
                        </h4>
                        <p className="mt-1 text-sm text-blue-700">
                            {todo.todoName}
                        </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <button
                            onClick={onDecline}
                            className="p-1.5 rounded-md text-blue-700 hover:bg-blue-100 transition-colors"
                            disabled={isSaving}
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleAddTodo}
                            className="p-1.5 rounded-md text-blue-700 hover:bg-blue-100 transition-colors"
                            disabled={isSaving}
                        >
                            <Check className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'send') {
        return (
            <>
                <div className="mt-2 p-4 rounded-lg bg-purple-50 animate-message-appear">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-purple-900">
                                发送催办提醒
                            </h4>
                            <p className="mt-1 text-sm text-purple-700">
                                {todo.todoName}
                            </p>
                            <p className="mt-0.5 text-xs text-purple-600">
                                接收人: {todo.qtalkId}
                            </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button
                                onClick={onDecline}
                                className="p-1.5 rounded-md text-purple-700 hover:bg-purple-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsRemindDialogOpen(true)}
                                className="px-3 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                            >
                                <Send className="w-4 h-4" />
                                发送
                            </button>
                        </div>
                    </div>
                </div>

                <RemindDialog
                    open={isRemindDialogOpen}
                    onOpenChange={setIsRemindDialogOpen}
                    todo={{
                        title: todo.todoId,
                        detail: todo.todoName,
                        assignee: todo.qtalkId
                    }}
                    onSend={handleRemind}
                    onRegenerate={() => {}}
                />
            </>
        );
    }

    return null;
};


const MessageContent = ({ content, quotes, onQuoteClick }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (content) {
            setIsReady(true);
        }
    }, [content]);

    const processContent = (text: string) => {
        if (!text || !quotes?.length) {
            return text || '';
        }

        const regex = /\{\{quote:(\d+)\}\}/g;
        return text.replace(regex, (_, quoteId) => {
            const index = quotes.findIndex(q => q === parseInt(quoteId)) + 1;
            return `[QUOTE_${index}]`;
        });
    };

    if (!isReady) {
        return <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>;
    }

    return (
        <div className="prose prose-slate max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="relative group">
                                <SyntaxHighlighter
                                    language={match[1]}
                                    style={oneLight}
                                    PreTag="div"
                                    {...props}
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: '0.375rem',
                                    }}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(String(children));
                                    }}
                                    className="absolute top-2 right-2 p-1.5 rounded-md
                                        bg-white/90 hover:bg-white shadow-sm opacity-0
                                        group-hover:opacity-100 transition-opacity"
                                >
                                    <ClipboardIcon className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    p({ node, children, ...props }) {
                        return (
                            <p {...props} className="whitespace-pre-wrap">
                                {React.Children.map(children, child => {
                                    if (typeof child !== 'string') return child;

                                    const parts = child.split(/(\[QUOTE_\d+\])/);
                                    return parts.map((part, index) => {
                                        const quoteMatch = part.match(/\[QUOTE_(\d+)\]/);
                                        if (quoteMatch) {
                                            const quoteNumber = parseInt(quoteMatch[1]);
                                            return (
                                                <QuoteNumber
                                                    key={index}
                                                    number={quoteNumber}
                                                    onClick={() => onQuoteClick(quotes[quoteNumber - 1])}
                                                />
                                            );
                                        }
                                        return part;
                                    });
                                })}
                            </p>
                        );
                    }
                }}
            >
                {processContent(content)}
            </ReactMarkdown>
        </div>
    );
};

// BotMessage 组件增加错误边界和数据验证
const BotMessage: React.FC<{
    message: Message;
    isNew?: boolean;
    onQuotaClick: (id: number) => void;
    onAvatarClick?: () => void;
    actionData?: Action;
    onGenUIAction?: (action: Action, accepted: boolean) => void;
}> = ({
          message,
          isNew,
          onQuotaClick,
          onAvatarClick,
          actionData,
          onGenUIAction
      }) => {
    const [hasError, setHasError] = useState(false);
    const [isContentReady, setIsContentReady] = useState(false);

    useEffect(() => {
        if (message?.content) {
            setIsContentReady(true);
        }
    }, [message]);

    if (hasError) {
        return (
            <div className="text-red-500 p-4">
                消息加载失败，请刷新页面重试
            </div>
        );
    }

    if (!isContentReady) {
        return (
            <div className="flex items-start gap-4 max-w-4xl mx-auto">
                <BotAvatar />
                <div className="flex-1 max-w-[85%] animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-start gap-4 max-w-4xl mx-auto transition-all duration-500 ${
            isNew ? 'animate-message-appear' : ''
        }`}>
            <BotAvatar onClick={onAvatarClick} />
            <div className="flex-1 max-w-[85%]">
                <MessageContent
                    content={message.content}
                    quotes={message.quotes}
                    onQuoteClick={onQuotaClick}
                />
                {isNew && actionData && (
                    <GenUI
                        action={actionData}
                        onAccept={() => onGenUIAction?.(actionData, true)}
                        onDecline={() => onGenUIAction?.(actionData, false)}
                    />
                )}
            </div>
        </div>
    );
};


export default BotMessage;