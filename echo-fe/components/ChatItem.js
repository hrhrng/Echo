const ChatItem = ({ chat, activeId }) => {
    return (
        <div
            id={`chat-${chat.id}`}
            className={`p-3 rounded-lg border pointer-events-none select-none ${
                activeId === chat.id ? 'bg-blue-100 border-blue-400' : 'border-gray-200'}`}
            data-chat-index={chat.id}
        >
            <div className="flex justify-between items-start">
                <p>
                    <span className="text-gray-500">#{chat.id}</span> {chat.text}
                </p>
                <span className="text-gray-500 text-sm ml-4">{chat.timestamp}</span>
            </div>
        </div>
    );
};

export default ChatItem;
