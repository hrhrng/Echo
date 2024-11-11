import React, { useState } from 'react';
import {Layout, Send} from 'lucide-react';
import {patuaOne} from "@/app/font";
import ChatState from "@/components/ChatState";
import ProjectPanel from "@/components/ProjectPanel";

interface Quote {
    id: number;
    text: string;
}
interface Message {
    id: number;
    type: 'user' | 'bot';
    text: string;
    timestamp: Date;
    quotes?: Quote[];
}



const Logo = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Echo Text */}
            <div className={`${patuaOne.className} text-[#000000] text-[45px]`}>
                Echo
            </div>

            {/* Horizontal Line */}
            <div className="w-[80px] h-[3px] bg-[#000000] my-2"></div>

        </div>
    )
};




const SuggestedQuestions = ({ questions, onSelect }) => (
    <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500">推荐问题</h3>
        <div className="grid grid-cols-1 gap-2">
            {questions.map((question, index) => (
                <button
                    key={index}
                    className="text-left px-4 py-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => onSelect(question)}
                >
                    {question}
                </button>
            ))}
        </div>
    </div>
);


// ... 其他接口定义和小组件保持不变 ...




// InitialChatState 组件简化版本

const InitialChatState = ({
                              onStartChat,
                                onOpenPanel,
                              suggestedQuestions,
                          }) => {
    const [message, setMessage] = useState('');
    const [isPanelButtonActive, setIsPanelButtonActive] = useState(false);

    const handleSend = () => {
        if (message.trim()) {
            onStartChat(message.trim());
            setMessage('');
        }
    };

    const togglePanelButton = () => {
        onOpenPanel();
        setIsPanelButtonActive(!isPanelButtonActive);
        console.log('Toggle project panel');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
                <Logo />
                <div className="relative flex rounded-xl shadow-sm">
                    <button
                        onClick={togglePanelButton}
                        className={`flex-none px-4 py-3 rounded-l-xl flex items-center gap-2 transition-all duration-200
                              bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100'}`}
                    >
                        <Layout className="w-4 h-4" />
                        <span className="text-sm font-medium">项目面板</span>
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="输入你的问题..."
                            className="w-full px-4 py-3 pr-12 rounded-r-xl bg-white border-l border-gray-200
                                focus:ring-2 focus:ring-blue-200 focus:border-transparent
                                transition-all placeholder-gray-400"
                        />
                        <button
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200
                                ${message.trim()
                                ? 'text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow'
                                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            }`}
                            onClick={handleSend}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <SuggestedQuestions questions={suggestedQuestions} onSelect={onStartChat} />
            </div>
        </div>
    );
};

const ChatInterface = ({
                           suggestedQuestions = [
                               "如何开始使用 React？",
                               "什么是虚拟 DOM？",
                               "React Hooks 的优势是什么？",
                               "如何处理状态管理？"
                           ],
                           onQuotaClick
                       }) => {
    const [messages, setMessages] = useState([]);
    const [currentState, setCurrentState] = useState('initial'); // 'initial', 'chat', 'panel'
    const [message, setMessage] = useState('');

    const handleStartChat = (message) => {
        setMessages([
            {
                id: Date.now(),
                type: 'user',
                text: message,
                timestamp: new Date()
            },
            {
                id: Date.now() + 1,
                type: 'bot',
                text: '你好！关于这个问题，你可以参考之前的讨论 {{quote:30}} 和 {{quote:2}}',
                timestamp: new Date(),
                quotes: [
                    { id: 30, text: "React 状态管理最佳实践" },
                    { id: 2, text: "如何处理副作用" }
                ]
            }
        ]);
        setCurrentState('chat');
    };

    const handleSendMessage = (message) => {
        const newMessages = [
            {
                id: Date.now(),
                type: 'user',
                text: message,
                timestamp: new Date()
            },
            {
                id: Date.now() + 1,
                type: 'bot',
                text: `你说的是："${message}"`,
                timestamp: new Date()
            }
        ];

        setMessages(prev => [...prev, ...newMessages]);
        setCurrentState('chat');
    };

    const handlePanelToggle = () => {
        setCurrentState(currentState === 'panel'
            ? (messages.length > 0 ? 'chat' : 'initial')
            : 'panel'
        );
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Initial State */}
            <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentState === 'initial' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                <InitialChatState
                    onStartChat={handleStartChat}
                    onOpenPanel={handlePanelToggle}
                    suggestedQuestions={suggestedQuestions}
                />
            </div>

            {/* Chat State */}
            <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentState === 'chat' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                <ChatState
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isProjectPanelOpen={false}
                    onQuotaClick={onQuotaClick}
                    onOpenPanel={handlePanelToggle}
                />
            </div>

            {/* Project Panel */}
            <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentState === 'panel' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                <ProjectPanel
                    onClose={handlePanelToggle}
                    onSendMessage={handleSendMessage}
                    message={message}
                    setMessage={setMessage}
                    onQuoteClick={onQuotaClick}
                />
            </div>
        </div>
    );
};

export default ChatInterface;