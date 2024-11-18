import React, { useState } from 'react';
import { X, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';
import { useReference } from '@/contexts/ReferenceContext';

export interface ReferenceItem {
    id: string | number;
    type: 'todo' | 'completed' | 'focus';
    title: string;
    sourceId?: string | number;
    createTime?: string;
}

interface ReferencedItemsProps {
    onItemRemove: () => void;
    onSuggestionSelect: (question: string) => void;
}

// 推荐问题列表
const suggestions = [
    "这个项目的后端开发是谁？",
    "目前项目进度如何？",
    "有哪些待解决的关键问题？",
    "下一步开发计划是什么？",
    "团队成员的分工情况如何？",
    "项目的主要里程碑有哪些？",
];

export const ReferencedItems: React.FC<ReferencedItemsProps> = ({ onItemRemove, onSuggestionSelect }) => {
    const { references, removeReference } = useReference();
    const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

    const handleRemove = (id) => {
        removeReference(id);
        onItemRemove();
    };

    const handleNextSuggestion = () => {
        setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    };

    const handleSelectSuggestion = () => {
        onSuggestionSelect(suggestions[currentSuggestionIndex]);
    };

    if (!references?.length && !suggestions.length) return null;

    return (
        <div className="p-2">
            <div className="flex justify-between items-center gap-2">
                {/* 左侧引用项 */}
                <div className="flex flex-wrap gap-2">
                    {references.map((item) => (
                        <div
                            key={item.id}
                            className="group flex items-center gap-2 px-3 py-1.5
                                bg-white hover:bg-blue-50
                                rounded-lg shadow-sm
                                border border-blue-100
                                text-sm text-gray-700
                                transition-colors duration-200"
                        >
                            <span>{item.title}</span>
                            <button
                                onClick={() => handleRemove(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5
                                    hover:bg-blue-100/50 rounded
                                    transition-all duration-200"
                            >
                                <X className="w-3 h-3"/>
                            </button>
                        </div>
                    ))}
                </div>

                {/* 右侧推荐问题 */}
                <div
                    className="flex items-center gap-2 px-3 py-1.5
                        bg-white hover:bg-blue-50
                        rounded-lg shadow-sm
                        border border-blue-100
                        text-sm text-gray-600
                        transition-colors duration-200
                        group cursor-pointer"
                    onClick={handleSelectSuggestion}
                >
                    <Lightbulb className="w-4 h-4 text-blue-500"/>
                    <span className="truncate max-w-[300px]">
                        {suggestions[currentSuggestionIndex]}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNextSuggestion();
                        }}
                        className="p-1 hover:bg-blue-100/50 rounded-full
                            opacity-0 group-hover:opacity-100
                            transition-all duration-200"
                    >
                        <RefreshCw className="w-3 h-3"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export type { ReferencedItemsProps };