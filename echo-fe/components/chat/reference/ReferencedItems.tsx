// ReferencedItems.tsx
import React from 'react';
import { Quote, X } from 'lucide-react';
import { useReference } from '@/contexts/ReferenceContext';

export interface ReferenceItem {
    id: string | number;
    type: 'todo' | 'completed' | 'focus';
    title: string;
    // 添加其他可能需要的字段
    sourceId?: string | number;  // 源对象的ID
    createTime?: string;         // 创建时间，可用作备用key
}

interface ReferencedItemsProps {
}

export const ReferencedItems: React.FC<ReferencedItemsProps> = ({
                                                                }) => {
    const { references, removeReference } = useReference();

    if (!references?.length) return null;

    return (
        <div className="p-3 bg-gray-50 border-t border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Quote className="w-4 h-4" />
                <span>引用内容</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {references.map((item) => (
                    <div
                        key={item.id}
                        className="group flex items-center gap-2 max-w-fit px-2 py-1 bg-white rounded-lg border border-gray-200
                        text-sm text-gray-600"
                    >
                        <span>{item.title}</span>
                        <button
                            onClick={() => removeReference(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-100 rounded transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export type { ReferencedItemsProps };