const ChatMessage = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`rounded-lg p-2 max-w-[70%] ${
                    isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
            >
                {message.content}
            </div>
        </div>
    );
};

export default ChatMessage;
