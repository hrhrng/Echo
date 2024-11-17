import { useCallback, useRef, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatSidebar from './ChatSidebar';
import ChatInterface from "@/components/ChatInterface";
import { ReferenceProvider } from "@/contexts/ReferenceContext";

const SplitPageLayout = () => {
    const chatContainerRef = useRef(null);
    // 高亮的activeId
    const [activeId, setActiveId] = useState(null);
    const [isRightCollapsed, setIsRightCollapsed] = useState(true);
    const [isLeftPinned, setIsLeftPinned] = useState(false);
    const [selectedItem, setSelectedItem] = useState("youhuixianxiang");
    const [isLeftExpanded, setIsLeftExpanded] = useState(false);
    const [currentChatId, setCurrentChatId] = useState("youhuixianxiang");

    const togglePin = () => setIsLeftPinned(!isLeftPinned);
    const toggleRightSidebar = () => setIsRightCollapsed(!isRightCollapsed);

    const activeIndexRef = useRef(null);

    // 处理项目选择变化，更新 chatId
    const handleItemSelect = useCallback((itemId) => {
        console.log("handleItemSelect"+JSON.stringify(itemId))
        setSelectedItem(itemId);
        // 根据选中的项目生成或获取对应的 chatId
        setCurrentChatId(itemId);
    }, []);

    // 初始化时设置默认 chatId
    useEffect(() => {
        setCurrentChatId(selectedItem);
    }, []);

    const handleQuotaClick = useCallback((index) => {
        console.log("scroll to index:" + index);

        const scrollToTarget = () => {
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

            // 设置高亮状态
            activeIndexRef.current = index;
            setActiveId(index);

            setTimeout(() => {
                if (activeIndexRef.current === index) {
                    activeIndexRef.current = null;
                    setActiveId(null);
                }
            }, 5000);
        };

        // 如果面板已经展开，直接执行滚动
        if (!isRightCollapsed) {
            requestAnimationFrame(scrollToTarget);
            return;
        }

        // 如果面板未展开，先展开面板，等待过渡动画完成后再滚动
        toggleRightSidebar();

        setTimeout(() => {
            requestAnimationFrame(scrollToTarget);
        }, 300);

    }, [isRightCollapsed, toggleRightSidebar]);

    return (
        <div className="flex h-screen">
            {/* 左侧边栏 */}
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
                        key={currentChatId} // 确保切换 chatId 时重新渲染
                    />
                </ReferenceProvider>
            </div>

            <ChatSidebar
                isRightCollapsed={isRightCollapsed}
                toggleRightSidebar={toggleRightSidebar}
                chatContainerRef={chatContainerRef}
                activeId={activeId}
                groupId={currentChatId} // 更新为使用当前的 chatId
            />
        </div>
    );
};

export default SplitPageLayout;