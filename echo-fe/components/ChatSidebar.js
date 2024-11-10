import { ChevronRight, ChevronLeft } from 'lucide-react';
import ChatList from './ChatList';

const ChatSidebar = ({ isRightCollapsed, toggleRightSidebar, chatContainerRef, activeId }) => {
    return (
        <>
            <button
                onClick={toggleRightSidebar}
                className="flex items-center justify-center w-6 bg-gray-100 hover:bg-gray-200 transition-colors border-y border-gray-200"
                aria-label={isRightCollapsed ? "展开面板" : "收起面板"}
            >
                {isRightCollapsed ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
            </button>
            <div
                ref={chatContainerRef}
                className={`
          overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out
          ${isRightCollapsed ? 'w-0 opacity-0' : 'w-1/3 opacity-100'}
        `}
            >
                <ChatList activeId={activeId} />
            </div>
        </>
    );
};

export default ChatSidebar;
