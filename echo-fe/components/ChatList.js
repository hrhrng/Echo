import { useState, useEffect, useRef, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import ChatItem from './ChatItem';
import { qtChatHistoryApi } from '@/services/api';

const ChatList = memo(({ activeId, groupId }) => {
    console.log('ChatList render with activeId:', activeId); // 调试日志

    const [state, setState] = useState({
        chatHistory: [],
        loading: true,
        error: null,
        activeIndex: -1
    });

    const virtuosoRef = useRef(null);
    const isFirstRender = useRef(true);

    // 监听 activeId 变化，更新 activeIndex
    useEffect(() => {
        if (!activeId || !state.chatHistory.length) return;

        const index = state.chatHistory.findIndex(chat => chat.id === activeId);
        setState(prev => ({ ...prev, activeIndex: index }));

        if (index !== -1 && virtuosoRef.current) {
            // 使用 RAF 确保在下一帧执行滚动
            requestAnimationFrame(() => {
                virtuosoRef.current?.scrollToIndex({
                    index,
                    behavior: 'auto',
                    align: 'center'
                });
            });
        }
    }, [activeId, state.chatHistory]);

    // 获取聊天历史
    useEffect(() => {
        let mounted = true;

        const fetchChatHistory = async () => {
            if (!groupId) return;

            try {
                setState(prev => ({ ...prev, loading: true, error: null }));
                const data = await qtChatHistoryApi.fetchChatHistory(groupId);

                if (!mounted) return;

                setState(prev => ({
                    ...prev,
                    chatHistory: data,
                    loading: false,
                    activeIndex: activeId ? data.findIndex(chat => chat.id === activeId) : -1
                }));

                if (isFirstRender.current && !activeId) {
                    requestAnimationFrame(() => {
                        virtuosoRef.current?.scrollToIndex({
                            index: data.length - 1,
                            behavior: 'auto'
                        });
                    });
                }
                isFirstRender.current = false;
            } catch (error) {
                if (mounted) {
                    setState(prev => ({
                        ...prev,
                        error: error.message,
                        loading: false
                    }));
                }
            }
        };

        fetchChatHistory();
        return () => { mounted = false; };
    }, [groupId, activeId]);

    const { chatHistory, loading, error, activeIndex } = state;

    if (loading) return <div className="p-6 text-center text-gray-500">加载中...</div>;
    if (error) return <div className="p-6 text-center text-red-500">加载失败: {error}</div>;

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold p-6">
                聊天记录 {activeId ? `(当前选中: ${activeId})` : ''}
            </h2>
            <div className="flex-1">
                <Virtuoso
                    ref={virtuosoRef}
                    data={chatHistory}
                    initialTopMostItemIndex={activeIndex !== -1 ? activeIndex : chatHistory.length - 1}
                    followOutput={!activeId}
                    itemContent={(index, chat) => (
                        <div
                            className={`px-6 py-1.5 ${chat.id === activeId ? 'bg-blue-100' : ''}`}
                            key={chat.id}
                        >
                            <ChatItem
                                chat={chat}
                                isActive={chat.id === activeId}
                            />
                        </div>
                    )}
                    overscan={20}
                />
            </div>
        </div>
    );
});

ChatList.displayName = 'ChatList';

export default ChatList;