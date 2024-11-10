import ChatItem from './ChatItem';

const CHAT_HISTORY = Array(50).fill(null).map((_, index) => ({
    id: index + 1,
    text: `这是第 ${index + 1} 条聊天记录。`,
    timestamp: new Date(2024, 0, 1, 9, index).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
    }),
}));

const ChatList = ({ activeId }) => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">聊天记录</h2>
            <div className="space-y-3">
                {CHAT_HISTORY.map((chat) => (
                    <ChatItem key={chat.id} chat={chat} activeId={activeId} />
                ))}
            </div>
        </div>
    );
};

export default ChatList;
