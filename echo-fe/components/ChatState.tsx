import React, {useEffect, useRef, useState} from "react";
import {Check, Clock, Layout, Send, X} from "lucide-react";
import MessageInput from "@/components/MessageInput";
import ChatInput from "@/components/chat/ChatInput";
import RemindDialog from "@/components/RemindDialog";
import BotMessage from "@/components/BotMessage";


interface Quote {
    id: number;
    text: string;
}
interface Action {
    data: {
        type: 'add' | 'send';
        message: string;  // JSON string containing todos
    };
    type: 'action';
}
export {Action, Message}

// 新增 GenUI 组件
// 修改 GenUI 组件

interface Message {
    id: number;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    quotes?: number[];
}

// BotMessage 组件修改，添加 onAvatarClick 属性



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


const ChatState: React.FC<{
    messages: Message[];
    actionData?: Action;  // 当前的 action 数据
    onSendMessage: (message: string) => void;
    onQuotaClick: (id: number) => void;
    onOpenPanel: () => void;
    isPanelOpen?: boolean;
    onReturnToInitial: () => void;
    onGenUIAction?: (action: Action, accepted: boolean) => void;
}> = ({
          messages,
          actionData,
          onSendMessage,
          onQuotaClick,
          onOpenPanel,
          isPanelOpen = false,
          onReturnToInitial,
          onGenUIAction,
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
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 space-y-6">
                        {visibleMessages.map((message, index) => (
                            message.type === 'bot' ? (
                                <BotMessage
                                    key={message.id}
                                    message={message}
                                    isNew={index === visibleMessages.length - 1}
                                    onQuotaClick={onQuotaClick}
                                    onAvatarClick={onReturnToInitial}
                                    actionData={index === visibleMessages.length - 1 ? actionData : undefined}
                                    onGenUIAction={onGenUIAction}
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