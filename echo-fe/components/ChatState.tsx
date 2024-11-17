import React, {useEffect, useRef, useState} from "react";
import {Layout, Send} from "lucide-react";
import MessageInput from "@/components/MessageInput";
import ChatInput from "@/components/chat/ChatInput";


interface Quote {
    id: number;
    text: string;
}
interface Message {
    id: number;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    quotes?: number[];
}

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

// BotMessage 组件修改，添加 onAvatarClick 属性
const BotMessage = ({
                        message,
                        isNew,
                        onQuotaClick,
                        onAvatarClick
                    }: {
    message: Message;
    isNew?: boolean;
    onQuotaClick: (id: number) => void;
    onAvatarClick?: () => void;
}) => (
    <div className={`flex items-start gap-4 max-w-4xl mx-auto transition-all duration-500 ${
        isNew ? 'animate-message-appear' : ''
    }`}>
        <BotAvatar onClick={onAvatarClick} />
        <div className="flex-1 max-w-[85%]">
            <div className="prose text-gray-800">
                {renderMessageWithQuotes(message.content, message.quotes || [], onQuotaClick)}
            </div>
        </div>
    </div>
);



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



// 解析消息文本中的引用标记
const renderMessageWithQuotes = (text: string, quotes: number[] = [], onQuoteClick: (id: number) => void) => {
    console.log("quotes:"+JSON.stringify(quotes) + " text:" + text)
    if (!quotes.length) return text;

    // 使用正则表达式匹配引用标记和前面的文本
    const regex = /(.+?)\{\{quote:(\d+)\}\}/g;
    const parts: Array<{text: string; quoteId?: number}> = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const [, content, quoteId] = match;
        console.log("parseQuote:" + content+" "+quoteId)
        parts.push({ text: content });
        parts.push({ text: '', quoteId: parseInt(quoteId) });
        lastIndex = regex.lastIndex;
    }
    console.log("parts:"+JSON.stringify(parts))

    // 添加剩余的文本
    if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex) });
    }

    return (
        <span>
            {parts.map((part, index) => (
                <React.Fragment key={index}>
                    {part.text}
                    {part.quoteId && (
                        <QuoteNumber
                            number={quotes.findIndex(q => q === part.quoteId) + 1}
                            onClick={() => onQuoteClick(part.quoteId!)}
                        />
                    )}
                </React.Fragment>
            ))}
        </span>
    );
};




const UserMessage = ({ message, isNew }: { message: Message; isNew?: boolean }) => (
    <div className={`flex items-start justify-end gap-3 max-w-4xl mx-auto transition-all duration-500 ${
        isNew ? 'animate-message-appear' : ''
    }`}>
        <div className="max-w-[85%]">
            <div className="px-4 py-2.5 bg-gray-100 text-gray-800 rounded-2xl rounded-tr-sm">
                {message.content}
            </div>
        </div>
    </div>
);


const ChatState = ({
                       messages,
                       onSendMessage,
                       onQuotaClick,
                       onOpenPanel,
                       isPanelOpen = false,
                       onReturnToInitial
                   }: {
    messages: Message[];
    onSendMessage: (message: string) => void;
    onQuotaClick: (id: number) => void;
    onOpenPanel: () => void;
    isPanelOpen?: boolean;
    onReturnToInitial: () => void;
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (messages.length > visibleMessages.length) {
            setTimeout(() => {
                setVisibleMessages(messages);
            }, 100);
        }
    }, [messages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [visibleMessages]);

    return (
        <div className="h-screen flex flex-col relative">
            <div className="absolute inset-0 flex">
                <div className="flex-1 flex flex-col h-full">
                    <div className="flex-none py-6 px-6">
                        {/*<Logo className="transform scale-90" />*/}
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 space-y-6">
                        {visibleMessages.map((message, index) => (
                            message.type === 'bot' ? (
                                <BotMessage
                                    key={message.id}
                                    message={message}
                                    isNew={index === visibleMessages.length - 1}
                                    onQuotaClick={onQuotaClick}
                                    onAvatarClick={onReturnToInitial} // 添加头像点击回调
                                />
                            ) : (
                                <UserMessage
                                    key={message.id}
                                    message={message}
                                    isNew={index === visibleMessages.length - 1}
                                />
                            )
                        ))}
                        <div ref={messagesEndRef} className="h-32"/>
                    </div>
                </div>
            </div>
            <ChatInput
                onClose={onOpenPanel}
                onSendMessage={onSendMessage}
                isPanelOpen={isPanelOpen}
            />
        </div>
    );
};

export default ChatState