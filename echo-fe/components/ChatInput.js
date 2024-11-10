import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ChatInput = ({ onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex space-x-2">
                <Input
                    type="text"
                    placeholder="输入你的消息..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">发送消息</span>
                </Button>
            </div>
        </form>
    );
};

export default ChatInput;
