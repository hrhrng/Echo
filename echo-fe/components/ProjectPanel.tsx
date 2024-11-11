import React, {useState} from 'react';
import {
    Layout,
    Send,
    Clock,
    AlertCircle,
    CheckCircle,
    Bell,
    UserCheck,
    FileText,
    Users,
    MessageSquare,
    ChevronRight,
    ArrowLeft,
    Quote, Shield, Briefcase, PenTool, Code, ChevronDown, Loader2, StarOff, Star
} from 'lucide-react';
import { patuaOne } from "@/app/font";
import RemindDialog from "@/components/RemindDialog";
import TeamMemberCard from "@/components/TeamMemberCard";
import {DraggableItem} from "@/components/panel/DraggableItem";
import {ReferenceItem} from "@/components/chat/reference/ReferencedItems";
import ChatInput from "@/components/chat/ChatInput";

// 引用标签组件
const QuoteTag = ({ quotes, onQuoteClick }: { quotes: number[]; onQuoteClick: (index: number) => void }) => (
    <div className="flex flex-wrap gap-1">
        {quotes.map((index) => (
            <button
                key={index}
                onClick={(e) => {
                    e.stopPropagation();
                    onQuoteClick(index);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-gray-500 hover:text-blue-600
          bg-gray-50 hover:bg-blue-50 rounded-md transition-colors group"
            >
                <Quote className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                <span>{index}</span>
            </button>
        ))}
    </div>
);

// 子组件：用户待办卡片
const TodoCard = ({ todo, quotes, onQuoteClick }) => {
    const [remindOpen, setRemindOpen] = useState(false);

    const handleSendRemind = (message: string) => {
        console.log('发送催办消息:', message);
        setRemindOpen(false);
    };

    const dragItem : ReferenceItem = {
        id: todo.id,
        type: 'todo',
        title: todo.title,
    };

    return (
        <DraggableItem item={dragItem}>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-900">{todo.title}</h4>
                                    <QuoteTag quotes={quotes} onQuoteClick={onQuoteClick} />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{todo.detail}</p>
                            </div>
                            <button
                                onClick={() => setRemindOpen(true)}
                                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                            >
                                催办
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <UserCheck className="w-4 h-4" />
                            <span>{todo.assignee}</span>
                        </div>
                    </div>

                    <RemindDialog
                        open={remindOpen}
                        onOpenChange={setRemindOpen}
                        todo={todo}
                        onSend={handleSendRemind}
                        onRegenerate={() => {}}
                    />
                </>
            </div>
        </DraggableItem>

    );
};

// 子组件：催办状态卡片
const RemindCard = ({ remind, quotes, onQuoteClick }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${remind.resolved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-gray-900">{remind.content}</span>
            </div>
            <QuoteTag quotes={quotes} onQuoteClick={onQuoteClick} />
        </div>
        <div className="mt-2 text-sm text-gray-500">{remind.date}</div>
    </div>
);

// 子组件：已完成事项及结论卡片
const CompletedItemCard = ({ item, itemQuotes, conclusionQuotes, onQuoteClick }) => {

    const dragItem : ReferenceItem = {
        id: item.id,
        type: 'completed',
        title: item.title,
    };

    return (
        <DraggableItem item={dragItem}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
                    {/* 事项部分 */}
                    <div className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{item.title}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600">已完成</span>
                                    <QuoteTag quotes={itemQuotes} onQuoteClick={onQuoteClick}/>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
                            </div>
                            <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                    </div>
                    {/* 结论部分 */}
                    <div className="p-4 bg-gray-50">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-violet-500"/>
                                    <span className="font-medium text-gray-900">关键结论</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 whitespace-pre-line">{item.conclusion}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                <div className="flex items-center gap-1">
                                    <UserCheck className="w-4 h-4"/>
                                    <span>{item.proposer}</span>
                                </div>
                                <span>{item.conclusionDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DraggableItem>

    )
};

const CollapsibleSection = ({
                                icon: Icon,
                                title,
                                children,
                                defaultExpanded = true,
                                action = null // 新增 action 参数
                            }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-2 sticky top-0 bg-gray-50 py-2 z-10">
                <div
                    className="flex-1 flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <Icon className={`w-5 h-5 ${title === "我的关注" ? "text-blue-500" : "text-blue-500"}`} />
                    <h3 className="text-lg font-medium">{title}</h3>
                    <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                    />
                </div>
                {action}
            </div>
            <div className={`space-y-6 transition-all duration-300 ease-in-out overflow-hidden ${
                isExpanded ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0'
            }`}>
                {children}
            </div>
        </section>
    );
};

// 新增：RegenerateButton 组件
const RegenerateButton = ({ onRegenerate, isLoading }) => (
    <button
        onClick={onRegenerate}
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg
            ${isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
        } transition-colors`}
    >
        {isLoading ? (
            <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>生成中...</span>
            </>
        ) : (
            <>
                <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M21 12a9 9 0 0 0-9-9M3 12a9 9 0 0 1 9-9M21 12a9 9 0 0 1-9 9M3 12a9 9 0 0 0 9 9" />
                </svg>
                <span>重新生成</span>
            </>
        )}
    </button>
);

// 修改项目流水展示组件，添加引用功能
const ProjectTimeline = ({ items , onQuoteClick}) => (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-4">项目流水</h4>
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm group">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 w-20">{item.time}</span>
                        <span className="font-medium text-gray-900 w-24">{item.user}</span>
                        <span className="text-gray-600">{item.action}</span>
                        <span className="text-green-600">{item.result}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <QuoteTag quotes={item.quotes} onQuoteClick={onQuoteClick} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// 子组件：项目概览卡片
// 修改：项目概览组件
const ProjectOverview = ({ stats, teams, onQuoteClick,onToggleStar }) => (
    <div className="space-y-6">
        {/* 基础统计信息 */}
        <div className="grid grid-cols-3 gap-4">
            {[
                { icon: Clock, label: '项目时长', value: stats.duration },
                { icon: MessageSquare, label: '有效沟通', value: stats.messageCount },
                { icon: CheckCircle, label: '解决问题', value: stats.solvedCount },
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
            {teams.map((team, index) => (
                <TeamMemberCard key={index} team={team} />
            ))}
        </div>

        {/* 项目流水线 */}
        <ProjectTimeline
            items={[
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
            ]}
            onQuoteClick={onQuoteClick}
        />

        {/* 项目待办事项 */}
        <ProjectTodoList
            todos={[
                {
                    id:0,
                    title: "优化系统性能",
                    detail: "进行系统性能分析，找出瓶颈并提出优化方案",
                    priority: "high",
                    assignee: "张三",
                    deadline: "2024-03-20",
                    date: "2024-03-15",
                    labels: ["技术优化", "性能"],
                    quotes: [4, 5]

                },
                {
                    id:1,
                    title: "完善用户文档",
                    detail: "编写详细的用户使用手册和API文档",
                    priority: "medium",
                    assignee: "李四",
                    deadline: "2024-03-25",
                    date: "2024-03-16",
                    labels: ["文档", "用户体验"],
                    quotes: [4, 5]
                },
                {
                    id:2,
                    title: "UI界面优化",
                    detail: "优化移动端适配和暗黑模式支持",
                    priority: "low",
                    assignee: "王五",
                    deadline: "2024-03-30",
                    date: "2024-03-17",
                    labels: ["UI设计", "移动端"],
                    quotes: [4, 5]
                }
            ]}
            onQuoteClick={onQuoteClick}
            onToggleStar={onToggleStar}
        />

        {/* 已解决问题列表 */}
        <ResolvedIssuesList
            issues={[
                {
                    title: "数据库查询性能问题",
                    detail: "系统在高并发场景下数据库查询响应缓慢",
                    conclusion: "1. 优化了关键SQL查询语句\n2. 添加了适当的索引\n3. 实现了查询缓存机制\n\n经测试，查询响应时间降低了60%",
                    resolvedBy: "张三",
                    createdDate: "2024-03-10",
                    resolvedDate: "2024-03-14",
                    duration: "4天",
                    conclusionDate: "2024-03-15",
                    quotes: [4, 5],
                    conclusionQuotes: [1]
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
                    quotes: [4, 5],
                    conclusionQuotes: [1]
                },
                {
                    title: "移动端适配问题",
                    detail: "部分页面在移动设备上显示异常，需要优化适配方案",
                    conclusion: "1. 重构了响应式布局代码\n2. 优化了移动端特定组件\n3. 添加了断点调试机制\n\n已完成全部移动端设备测试，显示正常",
                    resolvedBy: "王五",
                    createdDate: "2024-03-05",
                    resolvedDate: "2024-03-07",
                    duration: "2天",
                    conclusionDate: "2024-03-08",
                    quotes: [4, 5],
                    conclusionQuotes: [1]
                }
            ]}
            onQuoteClick={onQuoteClick}
        />

    </div>
);

const ProjectTodoList = ({ todos, onToggleStar, onQuoteClick }) => (
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
                            {todos.length} 项待处理
                        </span>
                        <span className="px-2.5 py-1 text-xs bg-amber-50 text-amber-600 rounded-full">
                            {todos.filter(todo => todo.isStarred).length} 项关注
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div className="divide-y divide-gray-50">
            {todos.map((todo) => (
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
                            <QuoteTag quotes={todo.quotes} onQuoteClick={onQuoteClick}/>
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
);

// 新增：已解决问题列表组件
const ResolvedIssuesList = ({issues, onQuoteClick}) => (
    <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500"/>
                    已解决的问题及结论
                </h4>
                <span className="px-2.5 py-1 text-xs bg-green-50 text-green-600 rounded-full">
                    {issues.length} 项已解决
                </span>
            </div>
        </div>
        <div className="divide-y divide-gray-50">
            {issues.map((issue, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-900">{issue.title}</span>
                                <span
                                    className="flex items-center gap-1 px-2 py-0.5 text-xs bg-violet-50 text-violet-600 rounded-full">
                                    <Clock className="w-3 h-3"/>
                                    耗时 {issue.duration}
                                </span>
                                <QuoteTag quotes={issue.quotes} onQuoteClick={onQuoteClick} />
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
                            <QuoteTag quotes={issue.conclusionQuotes} onQuoteClick={onQuoteClick} />
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
);
const ProjectPanel = ({ onClose, onSendMessage, onQuoteClick }) => {
    const [message, setMessage] = useState('');

    const [isRegenerating, setIsRegenerating] = useState(false);

    // 处理重新生成功能
    const handleRegenerate = async () => {
        setIsRegenerating(true);
        try {
            // 这里添加实际的重新生成逻辑
            await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟 API 调用
            console.log('重新生成完成');
        } catch (error) {
            console.error('重新生成失败:', error);
        } finally {
            setIsRegenerating(false);
        }
    };
    const handleToggleStar = async (todoId) => {
        try {
            // 这里调用后端API
            // await api.toggleTodoStar(todoId);
            console.log('Toggle star for todo:', todoId);
        } catch (error) {
            console.error('Failed to toggle star:', error);
        }
    };

    const [referencedItems, setReferencedItems] = useState([]);

    const handleAddReference = (item) => {
        setReferencedItems(prev => {
            // 防止重复添加
            if (prev.some(i => i.id === item.id)) {
                return prev;
            }
            return [...prev, item];
        });
    };

    const handleRemoveReference = (itemId) => {
        setReferencedItems(prev => prev.filter(item => item.id !== itemId));
    };
    // 示例团队数据
    const teams = [
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
    ];

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* 顶部导航 */}
            <div className="flex-none px-8 py-5 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-semibold tracking-wide text-gray-900">项目面板</h2>
                    </div>
                </div>
            </div>

            {/* 主内容区域 */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="px-8 pt-3 pb-6">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* 我的关注部分 */}
                        <CollapsibleSection icon={Bell} title="我的关注">
                            <div className="grid grid-cols-2 gap-6">
                                {/* 左侧：待办和催办 */}
                                <div className="space-y-6">
                                    {/* 待办事项 */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            待办事项
                                        </h4>
                                        <div className="space-y-3">
                                            <TodoCard
                                                todo={{
                                                    id: 1,
                                                    title: "更新项目文档",
                                                    detail: "需要更新最新的项目进展和结论",
                                                    assignee: "张三"
                                                }}
                                                quotes={[1, 2]}
                                                onQuoteClick={onQuoteClick}
                                            />
                                            <TodoCard
                                                todo={{
                                                    id: 2,
                                                    title: "代码审查",
                                                    detail: "检查新增功能的代码实现",
                                                    assignee: "李四"
                                                }}
                                                quotes={[3, 4]}
                                                onQuoteClick={onQuoteClick}
                                            />
                                        </div>
                                    </div>

                                    {/* 催办状态 */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-yellow-500" />
                                            已催办未响应
                                        </h4>
                                        <div className="space-y-3">
                                            <RemindCard
                                                remind={{
                                                    content: "项目文档更新",
                                                    date: "2024-03-15",
                                                    resolved: true
                                                }}
                                                quotes={[5]}
                                                onQuoteClick={onQuoteClick}
                                            />
                                            <RemindCard
                                                remind={{
                                                    content: "代码审查反馈",
                                                    date: "2024-03-16",
                                                    resolved: false
                                                }}
                                                quotes={[6]}
                                                onQuoteClick={onQuoteClick}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 右侧：已完成事项及结论 */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        已完成事项及结论
                                    </h4>
                                    <div className="space-y-4">
                                        <CompletedItemCard
                                            item={{
                                                id:3,
                                                title: "性能优化方案确认",
                                                detail: "完成了项目性能瓶颈分析和优化方案的制定",
                                                date: "2024-03-15",
                                                conclusion: "通过引入缓存层和优化数据库查询，预计可提升系统性能30%。具体措施包括：\n1. 引入 Redis 缓存热点数据\n2. 优化数据库索引结构\n3. 实现数据库读写分离",
                                                proposer: "李四",
                                                conclusionDate: "2024-03-15"
                                            }}
                                            itemQuotes={[7, 8]}
                                            conclusionQuotes={[9, 10]}
                                            onQuoteClick={onQuoteClick}
                                        />
                                        <CompletedItemCard
                                            item={{
                                                id:4,
                                                title: "架构设计方案确定",
                                                detail: "完成系统整体架构设计评审",
                                                date: "2024-03-14",
                                                conclusion: "决定采用微服务架构，使用 Kubernetes 作为容器编排平台。主要考虑：\n1. 系统模块解耦\n2. 便于扩展和维护\n3. 支持灰度发布",
                                                proposer: "王五",
                                                conclusionDate: "2024-03-14"
                                            }}
                                            itemQuotes={[11]}
                                            conclusionQuotes={[12, 13]}
                                            onQuoteClick={onQuoteClick}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* 项目总览部分 */}
                        {/* 项目总览部分 - 添加重新生成按钮 */}
                        <CollapsibleSection
                            icon={FileText}
                            title="项目总览"
                            action={
                                <RegenerateButton
                                    onRegenerate={handleRegenerate}
                                    isLoading={isRegenerating}
                                />
                            }
                        >
                            <ProjectOverview
                                stats={{
                                    duration: "45天",
                                    messageCount: "268",
                                    solvedCount: "24"
                                }}
                                teams={teams}
                                todos={[
                                    {
                                        id: 1,
                                        title: "优化系统性能",
                                        detail: "进行系统性能分析，找出瓶颈并提出优化方案",
                                        priority: "high",
                                        assignee: "张三",
                                        deadline: "2024-03-20",
                                        date: "2024-03-15",
                                        labels: ["技术优化", "性能"],
                                        isStarred: true
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
                                        isStarred: false
                                    },
                                    {
                                        id: 3,
                                        title: "UI界面优化",
                                        detail: "优化移动端适配和暗黑模式支持",
                                        priority: "low",
                                        assignee: "王五",
                                        deadline: "2024-03-30",
                                        date: "2024-03-17",
                                        labels: ["UI设计", "移动端"],
                                        isStarred: false
                                    }
                                ]}
                                onToggleStar={handleToggleStar}
                                onQuoteClick={onQuoteClick}
                            />
                        </CollapsibleSection>
                    </div>
                </div>
            </div>

            {/* 底部输入区域 */}
            <ChatInput onClose={onClose} onSendMessage={onSendMessage}/>
        </div>
    );
};

export default ProjectPanel;