// components/DraggableItem.tsx
import React from 'react';
import type { ReferenceItem } from '../chat/reference/ReferencedItems';

interface DraggableItemProps {
    item: ReferenceItem;
    children: React.ReactNode;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ item, children }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        // 同时设置两种数据格式以确保兼容性
        e.dataTransfer.setData('application/json', JSON.stringify(item));
        e.dataTransfer.setData('text/plain', JSON.stringify(item));

        // 设置拖拽效果
        e.dataTransfer.effectAllowed = 'copy';

        // 可选：设置拖拽时的视觉反馈
        if (e.dataTransfer.setDragImage && item.title) {
            const elem = document.createElement('div');
            elem.textContent = item.title;
            elem.style.padding = '4px 8px';
            elem.style.background = '#fff';
            elem.style.border = '1px solid #e2e8f0';
            elem.style.borderRadius = '4px';
            elem.style.position = 'fixed';
            elem.style.top = '-100px';
            elem.style.left = '-100px';
            document.body.appendChild(elem);
            e.dataTransfer.setDragImage(elem, 0, 0);
            setTimeout(() => document.body.removeChild(elem), 0);
        }
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="cursor-grab active:cursor-grabbing"
        >
            {children}
        </div>
    );
};