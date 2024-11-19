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
const QuoteNumber = React.memo(({
                                    number,
                                    onClick,
                                    highlighted = false
                                }: {
    number: number;
    onClick: () => void;
    highlighted?: boolean;
}) => (
    <button
        onClick={onClick}
        className={`
            inline-flex items-center justify-center w-4 h-4 text-[10px] font-medium
            ${highlighted
            ? 'bg-blue-200 hover:bg-blue-300 text-blue-700'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }
            rounded-full align-top transition-colors duration-200 
            relative -top-1 ml-0.5
        `}
    >
        {number}
    </button>
));


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
                        title: todo.todoName,
                        detail: todo.todoDesc,
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

    const processContent = (text) => {
        if (!text || !Array.isArray(quotes)) {
            return text || '';
        }

        // 保留缩进，但防止被识别为代码块
        text = text.split('\n').map(line => {
            // 如果行首有空格，添加特殊标记
            if (line.match(/^\s+/)) {
                return `&nbsp;${line.trimLeft()}`;
            }
            return line;
        }).join('\n');

        // 处理引用标记
        return text.replace(/\{\{quote:(\d+)\}\}/g, (_, quoteId) => {
            const index = quotes.findIndex(q => q === parseInt(quoteId));
            return index !== -1 ? `[QUOTE_${index + 1}]` : '';
        });
    };

    const renderTextWithQuotes = (text) => {
        // 还原被转义的空格
        text = text.replace(/&nbsp;/g, ' ');

        const parts = text.split(/(\[QUOTE_\d+])/);
        return parts.map((part, index) => {
            const quoteMatch = part.match(/\[QUOTE_(\d+)]/);
            if (quoteMatch) {
                const quoteNumber = parseInt(quoteMatch[1]);
                if (quoteNumber > 0 && quoteNumber <= quotes.length) {
                    return (
                        <QuoteNumber
                            key={`quote-${index}`}
                            number={quoteNumber}
                            onClick={() => onQuoteClick(quotes[quoteNumber - 1])}
                            highlighted={true}
                        />
                    );
                }
            }
            return part;
        });
    };

    const processNode = (node) => {
        if (typeof node === 'string') {
            return renderTextWithQuotes(node);
        }
        if (node?.props?.children) {
            return React.createElement(
                node.type,
                { ...node.props, key: Math.random() },
                React.Children.map(node.props.children, child => processNode(child))
            );
        }
        if (node?.props?.value) {
            return renderTextWithQuotes(node.props.value);
        }
        return node;
    };

    const Paragraph = ({ children, ...props }) => (
        <p {...props} className="whitespace-pre-wrap">
            {React.Children.map(children, child => processNode(child))}
        </p>
    );

    const ListItem = ({ children, ...props }) => (
        <li {...props}>
            {React.Children.map(children, child => processNode(child))}
        </li>
    );

    // 处理内联代码块
    const Code = ({ children, ...props }) => {
        // 如果内容以空格开头，说明是我们标记的缩进文本
        if (typeof children === 'string' && children.startsWith('&nbsp;')) {
            // 还原为普通文本并处理引用
            return renderTextWithQuotes(children);
        }
        // 否则按正常代码块处理
        return <code {...props}>{children}</code>;
    };

    if (!isReady) {
        return <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>;
    }

    return (
        <div className="prose prose-slate max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code: Code,
                    p: Paragraph,
                    li: ListItem,
                    // 处理块级代码
                    pre: ({ children, ...props }) => {
                        // 如果是我们的缩进文本，直接渲染为段落
                        if (children?.props?.children?.startsWith?.('&nbsp;')) {
                            return (
                                <p className="whitespace-pre-wrap">
                                    {renderTextWithQuotes(children.props.children)}
                                </p>
                            );
                        }
                        // 否则按正常代码块处理
                        return <pre {...props}>{children}</pre>;
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
    const [processedContent, setProcessedContent] = useState<string | null>(null);

    // 消息处理函数
    const processMessage = (message: Message) => {
        try {
            // 检查消息是否有效
            if (!message) {
                console.warn('Received invalid message');
                return null;
            }

            // 处理不同类型的消息内容
            if (typeof message.content === 'string') {
                return message.content;
            } else if (message.content === null || message.content === undefined) {
                console.warn('Message content is null or undefined');
                return '';
            } else {
                // 处理其他类型的消息内容
                const content = JSON.stringify(message.content);
                console.log('Processed non-string message content:', content);
                return content;
            }
        } catch (error) {
            console.error('Error processing message:', error);
            setHasError(true);
            return null;
        }
    };

    // 消息准备状态处理
    useEffect(() => {
        if (message) {
            const content = processMessage(message);
            setProcessedContent(content);
            setIsContentReady(!!content);
        } else {
            setIsContentReady(false);
            setProcessedContent(null);
        }
    }, [message]);

    // 错误处理
    if (hasError) {
        return (
            <div className="flex items-start gap-4 max-w-4xl mx-auto">
                <BotAvatar onClick={onAvatarClick} />
                <div className="text-red-500 p-4 rounded-lg bg-red-50">
                    消息处理失败，请刷新页面重试
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-2 text-red-600 hover:text-red-700 underline"
                    >
                        刷新页面
                    </button>
                </div>
            </div>
        );
    }

    // 加载状态
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

    // 正常渲染
    return (
        <div className={`flex items-start gap-4 max-w-4xl mx-auto transition-all duration-500 ${
            isNew ? 'animate-message-appear' : ''
        }`}>
            <BotAvatar onClick={onAvatarClick} />
            <div className="flex-1 max-w-[85%]">
                <MessageContent
                    content={processedContent}
                    quotes={message.quotes}
                    onQuoteClick={onQuotaClick}
                />
                {isNew && actionData && (
                    <GenUI
                        action={actionData}
                        onAccept={() => {
                            console.log('Action accepted:', actionData);
                            onGenUIAction?.(actionData, true);
                        }}
                        onDecline={() => {
                            console.log('Action declined:', actionData);
                            onGenUIAction?.(actionData, false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default BotMessage;