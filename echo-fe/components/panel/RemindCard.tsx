import React, { useState, useEffect } from 'react';
import { todoApi } from "@/services/api";

interface Remind {
    todoName: string;
    urgeTime: string;
}

interface RemindCardProps {
    onQuoteClick: (index: number) => void;
    refreshInterval?: number;
}

const RemindCard: React.FC<RemindCardProps> = ({ onQuoteClick, refreshInterval = 2000 }) => {
    const [reminds, setReminds] = useState<Remind[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReminds = async (isInitial = false) => {
        if (isInitial) {
            setIsInitialLoading(true);
        } else {
            setIsRefreshing(true);
        }

        try {
            const result = await todoApi.getUrge();
            setReminds(result);
            setError(null);
        } catch (err) {
            setError('Failed to fetch reminds');
            console.error('Error fetching reminds:', err);
        } finally {
            if (isInitial) {
                setIsInitialLoading(false);
            } else {
                setIsRefreshing(false);
            }
        }
    };

    useEffect(() => {
        fetchReminds(true);
        const intervalId = setInterval(() => fetchReminds(false), refreshInterval);

        return () => clearInterval(intervalId);
    }, [refreshInterval]);

    if (isInitialLoading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
                <p className="text-red-600 text-sm">Error loading reminds: {error}</p>
            </div>
        );
    }

    return (
        <>
            {reminds.map((remind) => (
                <div key={remind.todoName} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{remind.todoName}</h4>
                        <span className="text-sm text-gray-500">{remind.urgeTime}</span>
                    </div>
                </div>
            ))}
        </>
    );
};

export default RemindCard;