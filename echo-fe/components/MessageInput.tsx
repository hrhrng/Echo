import React from "react";
import {Send} from "lucide-react";

const MessageInput = ({ onSend, placeholder = "输入你的问题..." }) => {
    const [message, setMessage] = React.useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-4 py-3 pr-12 rounded-r-xl bg-white border-l border-gray-200
                    focus:ring-2 focus:ring-blue-200 focus:border-transparent
                    transition-all placeholder-gray-400"
            />
            <button
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200
                    ${message.trim()
                    ? 'text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }`}
                onClick={handleSend}
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
    );
};

export default MessageInput;

