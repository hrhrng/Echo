import React, { useState } from 'react';
import {
    Clock,
    MessageSquare,
    CheckCircle,
    FileText,
    UserCheck,
    AlertCircle,
    ChevronDown,
    ChevronRight
} from 'lucide-react';

const ProjectTimeline = ({ data, onQuoteClick }) => {
    // 生成并按日期分组的时间线
    const buildTimelineGroups = () => {
        // 从所有来源收集事件
        const timelineEvents = [
            ...data.tasks.map(task => ({
                id: task.taskId,
                type: 'task',
                user: task.creatorId,
                action: task.status === 'done' ? '完成任务' : '创建任务',
                content: task.name,
                detail: task.content,
                time: task.createTime,
                priority: task.priority,
                status: task.status,
                messageIds: task.messageIds
            })),
            ...data.doneIssues.map(issue => ({
                id: issue.issueId,
                type: 'issue',
                content: issue.name,
                detail: issue.description,
                time: issue.resolveTime || issue.createTime,
                status: 'resolved',
                messageIds: issue.messageIds
            })),
            ...data.processingIssues.filter(issue => issue.name).map(issue => ({
                id: issue.issueId,
                type: 'issue',
                content: issue.name,
                detail: issue.description,
                time: issue.createTime,
                status: issue.status,
                messageIds: issue.messageIds
            }))
        ].filter(event => event.time);

        // 按日期分组
        const groups = timelineEvents.reduce((acc, event) => {
            const date = new Date(event.time).toLocaleDateString('zh-CN');
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(event);
            return acc;
        }, {});

        // 对每个组内的事件按时间排序
        Object.keys(groups).forEach(date => {
            groups[date].sort((a, b) => new Date(b.time) - new Date(a.time));
        });

        // 返回按日期排序的分组
        return Object.entries(groups)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, events]) => ({
                date,
                events
            }));
    };

    // 维护每个日期组的展开状态
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (date) => {
        setExpandedGroups(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'done':
            case 'resolved':
                return 'bg-green-50 text-green-600';
            case 'pending':
            case 'open':
                return 'bg-yellow-50 text-yellow-600';
            case 'in_progress':
                return 'bg-blue-50 text-blue-600';
            default:
                return 'bg-gray-50 text-gray-600';
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const timelineGroups = buildTimelineGroups();

    return (
        <div className="space-y-6">
            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">日期跨度</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{timelineGroups.length}天</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">总事件数</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">
                        {timelineGroups.reduce((sum, group) => sum + group.events.length, 0)}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">已完成</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">
                        {timelineGroups.reduce((sum, group) =>
                            sum + group.events.filter(e =>
                                e.status === 'done' || e.status === 'resolved'
                            ).length, 0)}
                    </div>
                </div>
            </div>

            {/* 可折叠的时间线 */}
            <div className="bg-white rounded-lg border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        项目流水
                    </h4>
                </div>
                <div>
                    {timelineGroups.map(({ date, events }) => (
                        <div key={date} className="border-b border-gray-100 last:border-0">
                            {/* 日期头部，可点击展开/折叠 */}
                            <button
                                onClick={() => toggleGroup(date)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {expandedGroups[date] ?
                                        <ChevronDown className="w-4 h-4 text-gray-500" /> :
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                    }
                                    <span className="font-medium text-gray-900">{date}</span>
                                    <span className="text-sm text-gray-500">
                                        ({events.length}条记录)
                                    </span>
                                </div>
                            </button>

                            {/* 展开的事件列表 */}
                            {expandedGroups[date] && (
                                <div className="divide-y divide-gray-50">
                                    {events.map((event) => (
                                        <div key={event.id} className="pl-10 pr-4 py-3 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusClass(event.status)}`}>
                                                        {event.type === 'task' ? '任务' : '问题'}
                                                    </span>
                                                    <span className="font-medium text-gray-900">{event.content}</span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatTime(event.time)}
                                                </div>
                                            </div>
                                            {event.detail && (
                                                <p className="text-sm text-gray-600 mb-3">{event.detail}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                {event.user && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <UserCheck className="w-4 h-4" />
                                                        <span>{event.user}</span>
                                                    </div>
                                                )}
                                                {event.messageIds && event.messageIds.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {event.messageIds.map((quoteId) => (
                                                            <button
                                                                key={quoteId}
                                                                onClick={() => onQuoteClick(parseInt(quoteId))}
                                                                className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium
                                                                text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50
                                                                rounded-md transition-colors"
                                                            >
                                                                <FileText className="w-3 h-3" />
                                                                <span>{quoteId}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectTimeline;