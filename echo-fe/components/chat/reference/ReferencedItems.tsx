import React from 'react';
import { X } from 'lucide-react';
import { useReference } from '@/contexts/ReferenceContext';

export interface ReferenceItem {
    id: string | number;
    type: 'todo' | 'completed' | 'focus';
    title: string;
    sourceId?: string | number;
    createTime?: string;
}

interface ReferencedItemsProps {}

export const ReferencedItems: React.FC<ReferencedItemsProps> = () => {
    const { references, removeReference } = useReference();

    if (!references?.length) return null;

    return (
        <div className="p-2">
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
                            onClick={() => removeReference(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5
                                hover:bg-blue-100/50 rounded
                                transition-all duration-200"
                        >
                            <X className="w-3 h-3"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export type {ReferencedItemsProps};