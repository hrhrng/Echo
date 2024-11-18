import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChatList from "@/components/ChatList";

const ChatSidebar = memo(({ isRightCollapsed, toggleRightSidebar, groupId }) => {
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
                className={`
                    overflow-y-auto bg-gray-50 
                    transform transition-all duration-300 ease
                    ${isRightCollapsed ? 'w-0' : 'w-1/3'}
                `}
            >
                <ChatList groupId={groupId} />
            </div>
        </>
    );
});

ChatSidebar.displayName = 'ChatSidebar';

export default ChatSidebar;