// Mock data types
/**
 * @typedef {Object} ProjectStats
 * @property {string} duration - Project duration
 * @property {string} messageCount - Number of effective communications
 * @property {string} solvedCount - Number of solved problems
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} name - Member name
 * @property {string} role - Member role
 * @property {boolean} isLead - Whether the member is a team lead
 */

/**
 * @typedef {Object} Team
 * @property {string} name - Team name
 * @property {import('lucide-react').LucideIcon} icon - Team icon component
 * @property {string} colorClass - CSS classes for team color styling
 * @property {TeamMember[]} members - Team members
 */

/**
 * @typedef {Object} TimelineItem
 * @property {number} id - Item ID
 * @property {string} user - Username
 * @property {string} action - Action performed
 * @property {string} time - Time of action
 * @property {string} result - Result of action
 * @property {number[]} quotes - Quote references
 */

/**
 * @typedef {Object} Todo
 * @property {number} id - Todo ID
 * @property {string} title - Todo title
 * @property {string} detail - Todo details
 * @property {'high' | 'medium' | 'low'} priority - Priority level
 * @property {string} assignee - Assigned person
 * @property {string} deadline - Deadline date
 * @property {string} date - Creation date
 * @property {string[]} labels - Todo labels
 * @property {boolean} isStarred - Whether the todo is starred
 * @property {number[]} quotes - Quote references
 */

/**
 * @typedef {Object} ResolvedIssue
 * @property {string} title - Issue title
 * @property {string} detail - Issue details
 * @property {string} conclusion - Issue conclusion
 * @property {string} resolvedBy - Person who resolved
 * @property {string} createdDate - Creation date
 * @property {string} resolvedDate - Resolution date
 * @property {string} duration - Time taken to resolve
 * @property {string} conclusionDate - Conclusion date
 * @property {number[]} quotes - Quote references
 * @property {number[]} conclusionQuotes - Conclusion quote references
 */

import React, { useState, useEffect } from 'react';
import {
    Clock,
    MessageSquare,
    CheckCircle,
    FileText,
    UserCheck,
    AlertCircle,
    Code,
    PenTool,
    Briefcase,
    Shield,
    Star,
    StarOff
} from 'lucide-react';

// Mock data service
const mockDataService = {
    async getProjectData() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            stats: {
                duration: "45天",
                messageCount: "268",
                solvedCount: "24"
            },
            teams: [
                {
                    name: '研发团队',
                    icon: Code,
                    colorClass: 'bg-blue-50 text-blue-500',
                    members: [
                        { name: '张三', role: '前端开发', isLead: true },
                        { name: '李四', role: '后端开发' },
                        { name: '王五', role: '系统架构师' }
                    ]
                },
                {
                    name: '设计团队',
                    icon: PenTool,
                    colorClass: 'bg-violet-50 text-violet-500',
                    members: [
                        { name: '赵六', role: 'UI设计师', isLead: true },
                        { name: '钱七', role: 'UX设计师' }
                    ]
                },
                {
                    name: '产品团队',
                    icon: Briefcase,
                    colorClass: 'bg-green-50 text-green-500',
                    members: [
                        { name: '孙八', role: '产品经理', isLead: true },
                        { name: '周九', role: '产品专员' }
                    ]
                },
                {
                    name: '测试团队',
                    icon: Shield,
                    colorClass: 'bg-yellow-50 text-yellow-500',
                    members: [
                        { name: '吴十', role: '测试负责人', isLead: true },
                        { name: '郑十一', role: '测试工程师' }
                    ]
                }
            ],
            timeline: [
                {
                    id: 1,
                    user: "张三",
                    action: "提交了文档",
                    time: "2小时前",
                    result: "已完成",
                    quotes: [1, 2]
                },
                {
                    id: 2,
                    user: "李四",
                    action: "解决了问题",
                    time: "4小时前",
                    result: "已验证",
                    quotes: [3]
                }
            ],
            todos: [
                {
                    id: 1,
                    title: "优化系统性能",
                    detail: "进行系统性能分析，找出瓶颈并提出优化方案",
                    priority: "high",
                    assignee: "张三",
                    deadline: "2024-03-20",
                    date: "2024-03-15",
                    labels: ["技术优化", "性能"],
                    isStarred: true,
                    quotes: [4, 5]
                },
                {
                    id: 2,
                    title: "完善用户文档",
                    detail: "编写详细的用户使用手册和API文档",
                    priority: "medium",
                    assignee: "李四",
                    deadline: "2024-03-25",
                    date: "2024-03-16",
                    labels: ["文档", "用户体验"],
                    isStarred: false,
                    quotes: [6, 7]
                }
            ],
            resolvedIssues: [
                {
                    title: "数据库查询性能问题",
                    detail: "系统在高并发场景下数据库查询响应缓慢",
                    conclusion: "1. 优化了关键SQL查询语句\n2. 添加了适当的索引\n3. 实现了查询缓存机制\n\n经测试，查询响应时间降低了60%",
                    resolvedBy: "张三",
                    createdDate: "2024-03-10",
                    resolvedDate: "2024-03-14",
                    duration: "4天",
                    conclusionDate: "2024-03-15",
                    quotes: [8, 9],
                    conclusionQuotes: [10]
                },
                {
                    title: "用户认证机制优化",
                    detail: "现有认证方式安全性不足，需要加强",
                    conclusion: "1. 实现了JWT token认证\n2. 添加了双因素认证支持\n3. 加强了密码策略\n\n系统安全性得到显著提升",
                    resolvedBy: "李四",
                    createdDate: "2024-03-08",
                    resolvedDate: "2024-03-12",
                    duration: "4天",
                    conclusionDate: "2024-03-13",
                    quotes: [11, 12],
                    conclusionQuotes: [13]
                }
            ]
        };
    }
};

// Main ProjectOverview component
const ProjectOverview = ({ onQuoteClick, onToggleStar }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await mockDataService.getProjectData();
                setProjectData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">加载失败: {error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 基础统计信息 */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: Clock, label: '项目时长', value: projectData.stats.duration },
                    { icon: MessageSquare, label: '有效沟通', value: projectData.stats.messageCount },
                    { icon: CheckCircle, label: '解决问题', value: projectData.stats.solvedCount },
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

            {/* 团队成员信息 */}
            <div className="grid grid-cols-2 gap-4">
                {projectData.teams.map((team, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${team.colorClass}`}>
                                <team.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-medium text-gray-900">{team.name}</h3>
                        </div>
                        <div className="space-y-3">
                            {team.members.map((member, mIndex) => (
                                <div key={mIndex} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">{member.name}</span>
                                        {member.isLead && (
                                            <span className="px-1.5 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">
                                                负责人
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-gray-500">{member.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 项目时间线 */}
            <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-4">项目流水</h4>
                <div className="space-y-4">
                    {projectData.timeline.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-500 w-20">{item.time}</span>
                                <span className="font-medium text-gray-900 w-24">{item.user}</span>
                                <span className="text-gray-600">{item.action}</span>
                                <span className="text-green-600">{item.result}</span>
                            </div>
                            {item.quotes && (
                                <div className="flex flex-wrap gap-1">
                                    {item.quotes.map((quote) => (
                                        <button
                                            key={quote}
                                            onClick={() => onQuoteClick(quote)}
                                            className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium 
                                            text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 
                                            rounded-md transition-colors"
                                        >
                                            <FileText className="w-3 h-3" />
                                            <span>{quote}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 项目待办事项 */}
            <div className="bg-white rounded-lg border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            未解决的待办事项
                        </h4>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 text-xs bg-yellow-50 text-yellow-600 rounded-full">
                                    {projectData.todos.length} 项待处理
                                </span>
                                <span className="px-2.5 py-1 text-xs bg-amber-50 text-amber-600 rounded-full">
                                    {projectData.todos.filter(todo => todo.isStarred).length} 项关注
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-gray-50">
                    {projectData.todos.map((todo) => (
                        <div key={todo.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                        todo.priority === 'high'
                                            ? 'bg-red-50 text-red-600'
                                            : todo.priority === 'medium'
                                                ? 'bg-yellow-50 text-yellow-600'
                                                : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {todo.priority === 'high' ? '高优' : todo.priority === 'medium' ? '中优' : '低优'}
                                    </span>
                                    <span className="font-medium text-gray-900">{todo.title}</span>
                                    {todo.quotes && (
                                        <div className="flex flex-wrap gap-1">
                                            {todo.quotes.map((quote) => (
                                                <button
                                                    key={quote}
                                                    onClick={() => onQuoteClick(quote)}
                                                    className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium
                                                    text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50
                                                    rounded-md transition-colors"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    <span>{quote}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onToggleStar(todo.id)}
                                        className={`p-1 rounded-lg transition-colors ${
                                            todo.isStarred
                                                ? 'text-amber-500 hover:bg-amber-50'
                                                : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        {todo.isStarred ? (
                                            <Star className="w-5 h-5 fill-current"/>
                                        ) : (
                                            <StarOff className="w-5 h-5"/>
                                        )}
                                    </button>
                                    <span className="text-sm text-gray-500">{todo.date}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{todo.detail}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <UserCheck className="w-4 h-4"/>
                                        <span>{todo.assignee}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4"/>
                                        <span>{todo.deadline}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {todo.labels?.map((label, i) => (
                                        <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 已解决问题列表 */}
            <div className="bg-white rounded-lg border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500"/>
                            已解决的问题及结论
                        </h4>
                        <span className="px-2.5 py-1 text-xs bg-green-50 text-green-600 rounded-full">
                            {projectData.resolvedIssues.length} 项已解决
                        </span>
                    </div>
                </div>
                <div className="divide-y divide-gray-50">
                    {projectData.resolvedIssues.map((issue, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-gray-900">{issue.title}</span>
                                        <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-violet-50 text-violet-600 rounded-full">
                                            <Clock className="w-3 h-3"/>
                                            耗时 {issue.duration}
                                        </span>
                                        {issue.quotes && (
                                            <div className="flex flex-wrap gap-1">
                                                {issue.quotes.map((quote) => (
                                                    <button
                                                        key={quote}
                                                        onClick={() => onQuoteClick(quote)}
                                                        className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium
                                                        text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50
                                                        rounded-md transition-colors"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        <span>{quote}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <div className="flex flex-col items-end text-xs">
                                            <span>创建于 {issue.createdDate}</span>
                                            <span>解决于 {issue.resolvedDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">{issue.detail}</p>
                            </div>
                            {/* 结论部分 */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-violet-500" />
                                    <span className="text-sm font-medium text-gray-700">结论</span>
                                    {issue.conclusionQuotes && (
                                        <div className="flex flex-wrap gap-1">
                                            {issue.conclusionQuotes.map((quote) => (
                                                <button
                                                    key={quote}
                                                    onClick={() => onQuoteClick(quote)}
                                                    className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium
                                                    text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50
                                                    rounded-md transition-colors"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    <span>{quote}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                    {issue.conclusion}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                    <div className="flex items-center gap-1">
                                        <UserCheck className="w-4 h-4" />
                                        <span>{issue.resolvedBy}</span>
                                    </div>
                                    <span>{issue.conclusionDate}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;