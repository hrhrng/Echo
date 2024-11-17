import React, {useState, useEffect, useRef, useCallback, MutableRefObject} from 'react';
import { Layout, Send } from 'lucide-react';
import { patuaOne } from "@/app/font";
import ChatState from "@/components/ChatState";
import ProjectPanel from "@/components/ProjectPanel";
import {echoChatHistoryApi} from "@/services/api";
import {echoWebSocketService} from "@/services/webSocket";

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

// Logo 组件更新，添加点击事件
const Logo = ({ onClick }: { onClick?: () => void }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
    };

    return (
        <div className="flex flex-col items-center select-none">
            {/* 外层容器固定尺寸，防止内部变换影响布局 */}
            <div className="w-[180px] h-[65px] relative flex items-center justify-center">
                {/* 创建一个变换容器 */}
                <div className="absolute transform-gpu">
                    {/* 文字内容 */}
                    <span
                        className={`${patuaOne.className} text-[45px] cursor-pointer
                            block text-center text-[#000000]
                            transition-transform duration-20 ease-out
                            hover:scale-110 will-change-transform`}
                        onClick={handleClick}
                        style={{
                            WebkitFontSmoothing: 'antialiased',
                            backfaceVisibility: 'hidden'
                        }}
                    >
                        Echo
                    </span>
                </div>
            </div>
            <div className="w-[80px] h-[3px] bg-[#000000] my-2"></div>
        </div>
    );
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

const InitialChatState = ({
                              onStartChat,
                              onOpenPanel,
                              suggestedQuestions,
                              isLoading,
                                onReturnToChat,
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
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
                <Logo onClick={onReturnToChat}/>
                <div className="relative flex rounded-xl shadow-sm">
                    <button
                        onClick={togglePanelButton}
                        disabled={isLoading}
                        className={`flex-none px-4 py-3 rounded-l-xl flex items-center gap-2 transition-all duration-200
                              bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100 
                              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            placeholder={isLoading ? "加载历史记录中..." : "输入你的问题..."}
                            disabled={isLoading}
                            className="w-full px-4 py-3 pr-12 rounded-r-xl bg-white border-l border-gray-200
                                focus:ring-2 focus:ring-blue-200 focus:border-transparent
                                transition-all placeholder-gray-400"
                        />
                        <button
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200
                                ${message.trim() && !isLoading
                                ? 'text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow'
                                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            }`}
                            onClick={handleSend}
                            disabled={!message.trim() || isLoading}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {!isLoading && (
                    <SuggestedQuestions questions={suggestedQuestions} onSelect={onStartChat} />
                )}
            </div>
        </div>
    );
};

const ChatInterface = ({
                           chatId,
                           suggestedQuestions = [
                               "如何开始使用 React？",
                               "什么是虚拟 DOM？",
                               "React Hooks 的优势是什么？",
                               "如何处理状态管理？"
                           ],
                           onQuotaClick
                       }) => {
    // 从 sessionStorage 获取初始状态，如果没有则默认为 'initial'
    const getInitialState = () => {
        if (!chatId) return 'initial';
        const savedState = sessionStorage.getItem(`chat_state_${chatId}`);
        return savedState || 'initial';
    };

    const [messages, setMessages] = useState([]);
    const [currentState, setCurrentState] = useState(getInitialState);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const wsManagerRef = useRef(null);
    const connectionAttemptsRef = useRef(0);





    // 发送消息
    const handleSendMessage = useCallback((messageText) => {
        if (!wsManagerRef.current || !isConnected) {
            setError('未连接到服务器，请稍后重试');
            return;
        }

        // 构建消息对象
        const messageData = echoWebSocketService.buildUserMessage(chatId, messageText);

        // 乐观更新 UI
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: messageText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setCurrentState('chat');

        // 发送消息
        const sent = wsManagerRef.current.sendMessage(messageData);
        if (!sent) {
            setError('消息发送失败，请重试');
            // 回滚 UI 更新
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        }
    }, [chatId, isConnected]);

    // 创建一个新的 setCurrentState 包装函数来同时更新 state 和 sessionStorage
    const updateCurrentState = useCallback((newState) => {
        if (chatId) {
            sessionStorage.setItem(`chat_state_${chatId}`, newState);
        }
        setCurrentState(newState);
    }, [chatId]);



    // 从 chat 状态返回到 initial 状态
    const handleReturnToInitial = useCallback(() => {
        if (currentState === 'chat') {
            updateCurrentState('initial');
        }
    }, [currentState, updateCurrentState]);

    // 从 initial 状态返回到 chat 状态
    const handleReturnToChat = useCallback(() => {
        if (currentState === 'initial' && messages.length > 0) {
            updateCurrentState('chat');
        }
    }, [currentState, messages.length, updateCurrentState]);


    // 更新所有使用 setCurrentState 的地方
    const handleStartChat = useCallback((message) => {
        if (isLoading) return;
        updateCurrentState('chat');
        handleSendMessage(message);
    }, [isLoading, handleSendMessage, updateCurrentState]);

    const handlePanelToggle = useCallback(() => {
        if (isLoading) return;
        updateCurrentState(currentState === 'panel'
            ? (messages.length > 0 ? 'chat' : 'initial')
            : 'panel'
        );
    }, [isLoading, currentState, messages.length, updateCurrentState]);

    // 清理函数 - 在组件卸载或 chatId 改变时清理状态
    useEffect(() => {
        return () => {
            if (chatId) {
                // 可选：是否在组件卸载时清理存储的状态
                // sessionStorage.removeItem(`chat_state_${chatId}`);
            }
        };
    }, [chatId]);

    const maxConnectionAttempts = 5; // 最大连接尝试次数


    // 处理收到的 WebSocket 消息
    const handleWebSocketMessage = useCallback((message) => {
        const parsedMessage = echoWebSocketService.parseReceivedMessage(message);
        if (parsedMessage?.type === 'message') {
            setMessages(prev => [...prev, parsedMessage.data]);
        }
    }, []);



    // 处理 WebSocket 错误
    const handleWebSocketError = useCallback((error) => {
        console.log('WebSocket 连接尝试:', connectionAttemptsRef.current + 1);

        connectionAttemptsRef.current += 1;

        if (connectionAttemptsRef.current >= maxConnectionAttempts) {
            console.log('WebSocket 错误: 达到最大重试次数', error);
            setError('WebSocket 连接出错，请刷新页面重试');
            setIsConnected(false);
        } else {
            // 未达到最大尝试次数，不设置错误状态
            console.log(`WebSocket 连接失败，正在进行第 ${connectionAttemptsRef.current} 次重试...`);
        }
    }, []);

    const handleConnectionChange = useCallback((connected) => {
        setIsConnected(connected);
        if (connected) {
            setError(null);
            connectionAttemptsRef.current = 0;
        }
    }, []);



    // 初始化 WebSocket 连接
    useEffect(() => {
        if (!chatId) return;

        const wsManager = echoWebSocketService.createChatConnection(
            chatId,
            handleWebSocketMessage,
            handleWebSocketError,
            handleConnectionChange
        );

        wsManagerRef.current = wsManager;

        return () => {
            wsManager.disconnect();
        };
    }, [chatId, handleWebSocketMessage, handleWebSocketError]);


    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-4">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => {
                            connectionAttemptsRef.current = 0;
                            setError(null);
                            if (wsManagerRef.current) {
                                wsManagerRef.current.connect();
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        重试连接
                    </button>
                </div>
            </div>
        );
    }


    // 加载历史记录时的状态处理
    useEffect(() => {
        const fetchHistory = async () => {
            if (!chatId) return;

            setIsLoading(true);
            setError(null);

            try {
                console.log("chatId:"+JSON.stringify(chatId))
                const history = await echoChatHistoryApi.fetchChatHistory(chatId);
                if (history && history.length > 0) {
                    setMessages(history);
                    // 如果有历史记录且当前是初始状态，则切换到聊天状态
                    // if (currentState === 'initial') {
                    //     updateCurrentState('chat');
                    // }
                }
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch chat history:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [chatId, currentState, updateCurrentState]);




    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-4">
                    <p className="text-red-600">加载历史记录失败: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        重试
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentState === 'initial' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                <InitialChatState
                    onStartChat={handleStartChat}
                    onOpenPanel={handlePanelToggle}
                    suggestedQuestions={suggestedQuestions}
                    isLoading={isLoading}
                    onReturnToChat={handleReturnToChat}
                />
            </div>

            <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentState === 'chat' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                <ChatState
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isProjectPanelOpen={false}
                    onQuotaClick={onQuotaClick}
                    onOpenPanel={handlePanelToggle}
                    isLoading={isLoading}
                    onReturnToInitial={handleReturnToInitial}
                />
            </div>

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