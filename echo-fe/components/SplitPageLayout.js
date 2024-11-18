import React, { useCallback, useRef, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatSidebar from './ChatSidebar';
import ChatInterface from "@/components/ChatInterface";
import { ReferenceProvider } from "@/contexts/ReferenceContext";

// 创建一个统一管理滚动状态的 Context
const ScrollContext = React.createContext(null);

const SplitPageLayout = () => {
    // 基础状态管理
    const [isRightCollapsed, setIsRightCollapsed] = useState(true);
    const [isLeftPinned, setIsLeftPinned] = useState(false);
    const [selectedItem, setSelectedItem] = useState("youhuixianxiang");
    const [isLeftExpanded, setIsLeftExpanded] = useState(false);
    const [currentChatId, setCurrentChatId] = useState("youhuixianxiang");

    // 滚动和高亮相关状态
    const [activeId, setActiveId] = useState(null);
    const [pendingScroll, setPendingScroll] = useState(null);
    const virtuosoRef = useRef(null);

    // 清除高亮的定时器引用
    const clearHighlightTimer = useRef(null);

    const togglePin = () => setIsLeftPinned(!isLeftPinned);

    // 处理侧边栏展开/收起
    const toggleRightSidebar = useCallback(() => {
        setIsRightCollapsed(prev => !prev);
    }, []);

    // 处理选择变更
    const handleItemSelect = useCallback((itemId) => {
        setSelectedItem(itemId);
        setCurrentChatId(itemId);
    }, []);

    // 统一处理引用点击
    const handleQuotaClick = useCallback((id) => {
        console.log("要滚动到的id:", id);

        if (isRightCollapsed) {
            setPendingScroll(id);
            setIsRightCollapsed(false);
            return;
        }

        executeScroll(id);
    }, [isRightCollapsed]);

    const executeScroll = useCallback((id) => {
        if (!virtuosoRef.current) return;

        // 清除之前的定时器
        if (clearHighlightTimer.current) {
            clearTimeout(clearHighlightTimer.current);
        }

        // 设置高亮
        setActiveId(id);

        // 通知 ChatList 需要滚动到指定 id
        virtuosoRef.current.context = { scrollToId: id };

        clearHighlightTimer.current = setTimeout(() => {
            setActiveId(null);
        }, 5000);
    }, []);

    // 监听侧边栏展开状态，处理待执行的滚动
    useEffect(() => {
        if (!isRightCollapsed && pendingScroll !== null) {
            // 等待过渡动画完成
            const timer = setTimeout(() => {
                executeScroll(pendingScroll);
                setPendingScroll(null);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isRightCollapsed, pendingScroll, executeScroll]);

    // 清理定时器
    useEffect(() => {
        return () => {
            if (clearHighlightTimer.current) {
                clearTimeout(clearHighlightTimer.current);
            }
        };
    }, []);

    // 提供给 Context 的值
    const scrollContextValue = {
        virtuosoRef,
        activeId,
        executeScroll
    };

    return (
        <ScrollContext.Provider value={scrollContextValue}>
            <div className="flex h-screen">
                <Sidebar
                    isLeftExpanded={isLeftExpanded}
                    isLeftPinned={isLeftPinned}
                    togglePin={togglePin}
                    setSelectedItem={handleItemSelect}
                    selectedItem={selectedItem}
                    setIsLeftExpanded={setIsLeftExpanded}
                />

                <div
                    className={`flex-1 overflow-y-auto transition-all duration-300 ${
                        isLeftPinned ? 'ml-64' : 'ml-0'
                    }`}
                >
                    <ReferenceProvider>
                        <ChatInterface
                            chatId={currentChatId}
                            onQuotaClick={handleQuotaClick}
                            key={currentChatId}
                        />
                    </ReferenceProvider>
                </div>

                <ChatSidebar
                    isRightCollapsed={isRightCollapsed}
                    toggleRightSidebar={toggleRightSidebar}
                    groupId={currentChatId}
                />
            </div>
        </ScrollContext.Provider>
    );
};

export {ScrollContext};

export default SplitPageLayout;