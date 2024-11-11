import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ReferenceItem } from '@/components/chat/reference/ReferencedItems';
import ProjectPanel from "@/components/ProjectPanel";

interface ReferenceContextType {
    references: ReferenceItem[];
    addReference: (item: ReferenceItem) => void;
    removeReference: (id: ReferenceItem['id']) => void;
    clearReferences: () => void;
}

const ReferenceContext = createContext<ReferenceContextType | null>(null);

export const ReferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [references, setReferences] = useState<ReferenceItem[]>([]);

    const value = useMemo(() => ({
        references,
        addReference: (item: ReferenceItem) => {
            setReferences(prev =>
                prev.some(ref => ref.id === item.id)
                    ? prev
                    : [...prev, item]
            );
        },
        removeReference: (id: ReferenceItem['id']) => {
            setReferences(prev => prev.filter(ref => ref.id !== id));
        },
        clearReferences: () => {
            setReferences([]);
        }
    }), [references]);

    return (
        <ReferenceContext.Provider value={value}>
            {children}
        </ReferenceContext.Provider>
    );
};

export const useReference = () => {
    const context = useContext(ReferenceContext);
    if (!context) {
        throw new Error('useReference must be used within a ReferenceProvider');
    }
    return context;
};
