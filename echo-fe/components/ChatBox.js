import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatBox = () => {
    const [messages, setMessages] = useState([
        { id: 1, content: '你好！我能为你提供什么帮助？', sender: 'bot' },
    ]);

    const handleSendMessage = (messageText) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { id: prevMessages.length + 1, content: messageText, sender: 'user' },
        ]);

        // 模拟机器人回复
        setTimeout(() => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: prevMessages.length + 1, content: '这是一个演示机器人回复。', sender: 'bot' },
            ]);
        }, 1000);
    };

    return (
        <div className="max-w-3xl mx-auto p-6l">
            <ScrollArea className="flex-1 p-4 space-y-4">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
            </ScrollArea>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatBox;
