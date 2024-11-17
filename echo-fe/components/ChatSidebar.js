// ChatSidebar.jsx
import { memo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChatList from "@/components/ChatList";

const ChatSidebar = memo(({ isRightCollapsed, toggleRightSidebar, chatContainerRef, activeId, groupId }) => {
    // 添加日志来追踪 props 的变化
    useEffect(() => {
        console.log('ChatSidebar received new activeId:', activeId);
    }, [activeId]);

    return (
        <>
            <button
                onClick={toggleRightSidebar}
                className="flex items-center justify-center w-6 bg-gray-100 hover:bg-gray-200 border-y border-gray-200"
                aria-label={isRightCollapsed ? "展开面板" : "收起面板"}
            >
                {isRightCollapsed ?
                    <ChevronLeft className="w-4 h-4 text-gray-600" /> :
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                }
            </button>
            <div
                ref={chatContainerRef}
                className={`
                    overflow-y-auto bg-gray-50 
                    transform will-change-transform
                    ${isRightCollapsed ? 'w-0' : 'w-1/3'}
                `}
                style={{
                    transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                key={activeId} // 强制重新渲染
            >
                <ChatList
                    activeId={activeId}
                    groupId={groupId}
                    key={`${groupId}-${activeId}`} // 强制 ChatList 重新渲染
                />
            </div>
        </>
    );
}, (prevProps, nextProps) => {
    // 返回 false 表示需要重新渲染
    if (prevProps.activeId !== nextProps.activeId) return false;
    if (prevProps.isRightCollapsed !== nextProps.isRightCollapsed) return false;
    if (prevProps.groupId !== nextProps.groupId) return false;
    return true;
});

ChatSidebar.displayName = 'ChatSidebar';

export default ChatSidebar;