import {memo, useMemo} from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";


const ChatItem = memo(({ chat, isActive }) => {
    const { id, content, sender, timestamp, qtalkId } = chat;

    // 优化后的柔和配色方案
    const getAvatarStyle = useMemo(() => {
        const colorPairs = [
            { bg: 'bg-violet-100', text: 'text-violet-600' },
            { bg: 'bg-sky-100', text: 'text-sky-600' },
            { bg: 'bg-rose-100', text: 'text-rose-600' },
            { bg: 'bg-emerald-100', text: 'text-emerald-600' },
            { bg: 'bg-amber-100', text: 'text-amber-600' },
            { bg: 'bg-indigo-100', text: 'text-indigo-600' },
            { bg: 'bg-teal-100', text: 'text-teal-600' },
            { bg: 'bg-fuchsia-100', text: 'text-fuchsia-600' }
        ];

        const index = Math.abs(qtalkId.split('').reduce((acc, char) =>
            acc + char.charCodeAt(0), 0)) % colorPairs.length;

        return colorPairs[index];
    }, [qtalkId]);

    const userInitial = useMemo(() => {
        return sender.charAt(0).toUpperCase();
    }, [sender]);

    const parsedContent = useMemo(() => parseMessage(content), [content]);

    const formattedTime = useMemo(() => {
        const date = new Date(timestamp);
        return {
            time: date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            relative: formatDistanceToNow(date, {
                locale: zhCN,
                addSuffix: true
            })
        };
    }, [timestamp]);

    return (
        <div
            className={`p-4 rounded-lg border transition-colors ${
                isActive
                    ? 'bg-blue-200 border-blue-500' // 从 blue-100 改为 blue-200，border 从 blue-200 改为 blue-500
                    : 'border-gray-100 hover:bg-gray-50'
            }`}
            data-chat-index={id}
        >
            <div className="flex gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white">
                    <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sender)}`}
                        alt={sender}
                    />
                    <AvatarFallback
                        className={`${getAvatarStyle.bg} ${getAvatarStyle.text} font-medium flex items-center justify-center`}
                    >
                        {userInitial}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{sender}</span>
                            <span className="text-xs text-gray-400">@{qtalkId}</span>
                        </div>
                        <div
                            className="text-xs text-gray-400"
                            title={formattedTime.time}
                        >
                            {formattedTime.relative}
                        </div>
                    </div>

                    <div className="text-gray-700 space-y-2">
                        {parsedContent.map((part, index) => (
                            <MessagePart key={index} part={part}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

// MessagePart component for rendering different message types
const MessagePart = ({part}) => {
    switch (part.type) {
        case 'text':
            return <div className="whitespace-pre-wrap break-words">{part.content}</div>;

        case 'image':
            return (
                <div className="relative group">
                    <img
                        src={part.url}
                        alt="聊天图片"
                        className="max-w-[300px] max-h-[200px] w-auto h-auto rounded-lg object-contain cursor-pointer hover:opacity-95"
                        onClick={() => {/* 可以添加点击放大查看功能 */}}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button className="text-white px-4 py-2 rounded-md bg-black/30 hover:bg-black/40">
                            查看原图
                        </button>
                    </div>
                </div>
            );

        case 'url':
            return (
                <a
                    href={part.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                    {part.url}
                </a>
            );

        default:
            return null;
    }
};

// Message parsing utility
const parseMessage = (message) => {
    const parts = [];
    const objRegex = /\[obj type="(image|url)" value="([^"]+)"(?:\s+width=(\d+)\s+height=(\d+))?\]/g;
    let lastIndex = 0;
    let match;

    while ((match = objRegex.exec(message)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: message.slice(lastIndex, match.index)
            });
        }

        // Add the matched object
        const [_, type, value, width, height] = match;
        if (type === 'image') {
            parts.push({
                type: 'image',
                url: value,
                width: width ? parseInt(width) : null,
                height: height ? parseInt(height) : null
            });
        } else if (type === 'url') {
            parts.push({
                type: 'url',
                url: value
            });
        }

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < message.length) {
        parts.push({
            type: 'text',
            content: message.slice(lastIndex)
        });
    }

    return parts;
};
ChatItem.displayName = 'ChatItem';


export default ChatItem;