import { createContext, useContext, useRef, useState } from 'react';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
    const [activeChat, setActiveChat] = useState(null);
    const [isRightCollapsed, setIsRightCollapsed] = useState(true);
    const virtuosoRef = useRef(null);
    const highlightTimeoutRef = useRef(null);

    const toggleRightSidebar = () => {
        setIsRightCollapsed(prev => !prev);
    };

    const scrollToChat = async (chatId) => {
        // 如果侧边栏是折叠的，先展开
        if (isRightCollapsed) {
            setIsRightCollapsed(false);
            // 等待侧边栏展开动画完成
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        setActiveChat(chatId);

        // 清除之前的定时器
        if (highlightTimeoutRef.current) {
            clearTimeout(highlightTimeoutRef.current);
        }

        // 设置新的定时器，5秒后取消高亮
        highlightTimeoutRef.current = setTimeout(() => {
            setActiveChat(null);
        }, 5000);
    };

    return (
        <ChatContext.Provider value={{
            activeChat,
            isRightCollapsed,
            toggleRightSidebar,
            virtuosoRef,
            scrollToChat
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);