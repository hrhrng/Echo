import React, { useState, useEffect } from 'react';
import {
    Clock,
    MessageSquare,
    CheckCircle,
    FileText,
    AlertCircle,
    Star,
    StarOff
} from 'lucide-react';
import {projectApi} from "@/services/api";
import ProjectTimeline from "@/components/panel/ProjectTimeline";
import {CollapsibleSection, CollapsibleSection2} from "@/components/ProjectPanel";

const ProjectOverview = ({ onQuoteClick, onToggleStar }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectData, setProjectData] = useState(null);

    // 数据获取函数
    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const data = await projectApi.getProjectData("youhuixianxiang");
            setProjectData(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 组件加载时获取数据
    useEffect(() => {
        fetchProjectData();
    }, []);


    // 组件加载时获取数据
    useEffect(() => {
        fetchProjectData();
    }, []);

    // 计算基础统计数据
    const getBasicStats = (data) => {
        if (!data) return { duration: '0天', messageCount: '0', solvedCount: '0' };

        const tasks = [...data.tasks];
        const messageCount = tasks.reduce((acc, task) =>
            acc + (task.messageIds?.length || 0), 0);
        const solvedCount = data.doneIssues.length;

        // 找出最早和最晚的任务来计算项目持续时间
        const dates = tasks
            .map(task => task.createTime)
            .filter(Boolean)
            .map(date => new Date(date));

        let duration = 0;
        if (dates.length > 0) {
            const earliestDate = new Date(Math.min(...dates));
            const latestDate = new Date(Math.max(...dates));
            duration = Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24));
        }

        return {
            duration: `${duration}天`,
            messageCount: messageCount.toString(),
            solvedCount: solvedCount.toString()
        };
    };

    // 处理任务优先级样式
    const getPriorityClass = (priority) => {
        switch(priority) {
            case 'high':
                return 'bg-red-50 text-red-600';
            case 'medium':
                return 'bg-yellow-50 text-yellow-600';
            default:
                return 'bg-blue-50 text-blue-600';
        }
    };

    // 获取任务状态标签
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { text: '待处理', class: 'bg-yellow-50 text-yellow-600' },
            'in_progress': { text: '进行中', class: 'bg-blue-50 text-blue-600' },
            'done': { text: '已完成', class: 'bg-green-50 text-green-600' }
        };
        return statusMap[status] || { text: '未知', class: 'bg-gray-50 text-gray-600' };
    };

    // 加载状态
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    // 错误状态
    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">加载失败: {error}</div>
            </div>
        );
    }

    // 数据为空状态
    if (!projectData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">暂无数据</div>
            </div>
        );
    }

    const basicStats = getBasicStats(projectData);

    // 渲染待处理任务内容
    const renderPendingTasks = (projectData) => (
        <div className="divide-y divide-gray-50">
            {projectData.tasks
                .filter(task => task.status === 'pending' && task.name)
                .map((task) => (
                    <div key={task.taskId} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityClass(task.priority)}`}>
                                    {task.priority === 'high' ? '高优' : task.priority === 'medium' ? '中优' : '低优'}
                                </span>
                                <span className="font-medium text-gray-900">{task.name}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                {task.createTime ? new Date(task.createTime).toLocaleDateString('zh-CN') : ''}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.content}</p>
                        {task.messageIds && task.messageIds.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {task.messageIds.map((quoteId) => (
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
                        {task.deadline && (
                            <div className="mt-2 text-sm text-gray-500">
                                截止日期: {new Date(task.deadline).toLocaleDateString('zh-CN')}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );

    // 渲染已解决问题内容
    const renderResolvedIssues = (projectData) => (
        <div className="divide-y divide-gray-50">
            {projectData.doneIssues.filter(issue => issue.name).map((issue) => (
                <div key={issue.issueId} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-900">{issue.name}</span>
                                {issue.messageIds && issue.messageIds.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {issue.messageIds.map((quoteId) => (
                                            <button
                                                key={quoteId}
                                                onClick={() => onQuoteClick(quoteId)}
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
                        <p className="text-sm text-gray-600">{issue.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {issue.resolveTime && (
                            <span>解决于 {new Date(issue.resolveTime).toLocaleDateString('zh-CN')}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    // 渲染基础统计信息
    const renderBasicStats = (stats) => (
        <div className="grid grid-cols-3 gap-4">
            {[
                { icon: Clock, label: '项目时长', value: stats.duration },
                { icon: MessageSquare, label: '消息数量', value: stats.messageCount },
                { icon: CheckCircle, label: '已解决问题', value: stats.solvedCount },
            ].map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">加载中...</div>
        </div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-64">
            <div className="text-red-500">加载失败: {error}</div>
        </div>;
    }

    if (!projectData) {
        return <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">暂无数据</div>
        </div>;
    }

    const pendingTasksCount = projectData.tasks.filter(t => t.status === 'pending').length;

    return (
        <div className="space-y-6">
            {/* 基础统计信息 */}
            {renderBasicStats(basicStats)}

            {/* 时间线 */}
            <CollapsibleSection2
                icon={Clock}
                title="项目时间线"
                defaultExpanded={true}
            >
                <ProjectTimeline
                    data={projectData}
                    onQuoteClick={onQuoteClick}
                />
            </CollapsibleSection2>

            {/* 待处理任务 - 改造成可折叠的 */}
            <CollapsibleSection2
                icon={AlertCircle}
                title="待处理任务"
                defaultExpanded={true}
                action={
                    <span className="px-2.5 py-1 text-xs bg-yellow-50 text-yellow-600 rounded-full">
                        {pendingTasksCount} 项待处理
                    </span>
                }
            >
                {renderPendingTasks(projectData)}
            </CollapsibleSection2>

            {/* 已解决问题 - 改造成可折叠的 */}
            <CollapsibleSection2
                icon={CheckCircle}
                title="已解决问题"
                defaultExpanded={false}
                action={
                    <span className="px-2.5 py-1 text-xs bg-green-50 text-green-600 rounded-full">
                        {projectData.doneIssues.length} 项已解决
                    </span>
                }
            >
                {renderResolvedIssues(projectData)}
            </CollapsibleSection2>
        </div>
    );
};
export default ProjectOverview;