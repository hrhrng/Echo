import {useCallback, useRef, useState} from 'react';
import Sidebar from './Sidebar';
import ChatSidebar from './ChatSidebar';
import CitationText from './CitationText';
import ChatBox from "@/components/ChatBox";
import ChatInterface from "@/components/ChatInterface";

const SplitPageLayout = () => {
    const chatContainerRef = useRef(null);
    // 高亮的activeId
    const [activeId, setActiveId] = useState(null);
    const [isRightCollapsed, setIsRightCollapsed] = useState(true);
    const [isLeftPinned, setIsLeftPinned] = useState(false);
    const [selectedItem, setSelectedItem] = useState(1);
    const [isLeftExpanded, setIsLeftExpanded] = useState(false);

    const togglePin = () => setIsLeftPinned(!isLeftPinned);
    const toggleRightSidebar = () => setIsRightCollapsed(!isRightCollapsed);

    const handleQuotaClick = useCallback((index) => {
        // 确保面板展开
        if (isRightCollapsed) {
            toggleRightSidebar();
        }

        // 使用requestAnimationFrame确保DOM更新后再滚动
        requestAnimationFrame(() => {

            setActiveId(index);

            if (!chatContainerRef.current) return;

            // 获取容器和目标元素
            const container = chatContainerRef.current;
            const targetElement = container.querySelector(`[data-chat-index="${index}"]`);

            if (!targetElement) return;

            // 计算滚动位置使目标元素居中
            const containerHeight = container.offsetHeight;
            const elementHeight = targetElement.offsetHeight;
            const elementTop = targetElement.offsetTop;
            const centerPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);

            // 平滑滚动到计算出的位置
            container.scrollTo({
                top: centerPosition,
                behavior: 'smooth'
            });
            // todo 高亮时间这里控制
            setTimeout(() => activeId === index ? setActiveId(null):null, 5000);
        });
    }, [isRightCollapsed, toggleRightSidebar]);

    return (
        <div className="flex h-screen">
            {/* 左侧边栏 */}
            <Sidebar
                isLeftExpanded={isLeftExpanded}
                isLeftPinned={isLeftPinned}
                togglePin={togglePin}
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
                setIsLeftExpanded={setIsLeftExpanded}
            />

            <div
                className={`flex-1 overflow-y-auto transition-all duration-300 ${
                    isLeftPinned ? 'ml-64' : 'ml-0'
                }`}
            >
                    <ChatInterface onQuotaClick={handleQuotaClick}/>
            </div>


            <ChatSidebar
                isRightCollapsed={isRightCollapsed}
                toggleRightSidebar={toggleRightSidebar}
                chatContainerRef={chatContainerRef}
                activeId={activeId}
            />
        </div>
    );
};

export default SplitPageLayout;
