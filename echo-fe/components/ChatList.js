import { useState, useEffect, useContext } from 'react';
import { Virtuoso } from 'react-virtuoso';
import ChatItem from './ChatItem';
import { ScrollContext } from './SplitPageLayout';
import { qtChatHistoryApi } from '@/services/api';

const ChatList = ({ groupId }) => {
    const { virtuosoRef, activeId } = useContext(ScrollContext);
    const [state, setState] = useState({
        chatHistory: [],
        loading: true,
        error: null
    });

    // 监听滚动ID的变化
    useEffect(() => {
        if (state.chatHistory.length && activeId) {
            const targetIndex = state.chatHistory.findIndex(
                chat => chat.id === activeId
            );

            console.log("需要滚动到:", virtuosoRef.activeId);
            console.log("找到的索引:", targetIndex);

            if (targetIndex !== -1) {
                virtuosoRef.current?.scrollToIndex({
                    index: targetIndex,
                    align: 'center',
                    behavior: 'smooth'
                });
                // 清除滚动标记
                virtuosoRef.current.context = {};
            }
        }
    }, [activeId, state.chatHistory]);

    useEffect(() => {
        let mounted = true;
        const fetchChatHistory = async () => {
            if (!groupId) return;

            try {
                setState(prev => ({ ...prev, loading: true, error: null }));
                const data = await qtChatHistoryApi.fetchChatHistory(groupId);
                if (mounted) {
                    setState(prev => ({
                        ...prev,
                        chatHistory: data,
                        loading: false
                    }));
                }
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
    }, [groupId]);

    const { chatHistory, loading, error } = state;

    if (loading) return <div className="p-6 text-center text-gray-500">加载中...</div>;
    if (error) return <div className="p-6 text-center text-red-500">加载失败: {error}</div>;

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold p-6">聊天记录</h2>
            <div className="flex-1">
                <Virtuoso
                    ref={virtuosoRef}
                    data={chatHistory}
                    totalCount={chatHistory.length}
                    itemContent={(index, chat) => (
                        <ChatItem
                            chat={chat}
                            isActive={chat.id === activeId}
                        />
                    )}
                    overscan={200}
                    defaultItemHeight={100}
                />
            </div>
        </div>
    );
};

export default ChatList;