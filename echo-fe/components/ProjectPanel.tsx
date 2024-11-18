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
import {DraggableItem} from "@/components/panel/DraggableItem";
import {ReferenceItem} from "@/components/chat/reference/ReferencedItems";
import ChatInput from "@/components/chat/ChatInput";
import MessageInput from "@/components/MessageInput";
import TodoCard from "@/components/panel/TodoCard";
import ProjectOverview from "@/components/panel/ProjectOverview";
import {cn} from "@/lib/utils";

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

export const CollapsibleSection = ({
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


export const CollapsibleSection2 = ({
                                title,
                                children,
                                icon: Icon,
                                defaultExpanded = false,
                                className = '',
                                action
                            }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className={cn('', className)}> {/* 移除了白色背景和边框 */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-4 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <span className="text-sm font-medium text-gray-900">{title}</span>
                </div>
                <div className="flex items-center gap-3">
                    {action && <div className="flex-none">{action}</div>}
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 text-gray-400 transition-transform duration-200",
                            isExpanded ? "transform rotate-180" : ""
                        )}
                    />
                </div>
            </button>

            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-200",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div className="overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
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


// 新增：已解决问题列表组件
const ProjectPanel = ({ onClose, onSendMessage, onQuoteClick }) => {
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [chatInputHeight, setChatInputHeight] = useState(0);

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        try {
            // 实际重新生成的逻辑
            await new Promise(resolve => setTimeout(resolve, 2000));
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

    const handleChatInputRender = (height) => {
        setChatInputHeight(height);
    };

    return (
        <div className="h-full flex flex-col bg-gray-50"> {/* 修改这里 */}
            {/* 顶部导航 */}
            <div className="flex-none px-8 py-5 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-semibold tracking-wide text-gray-900">项目面板</h2>
                    </div>
                </div>
            </div>

            {/* 主内容区域 - 修改这里的结构 */}
            <div className="flex-1 min-h-0 flex flex-col">
                {/* 滚动区域容器 */}
                <div className="flex-1 overflow-y-auto">
                    <div className="px-8 pt-3 pb-6" style={{ marginBottom: chatInputHeight }}>
                        <div className="max-w-6xl mx-auto space-y-8">
                            {/* 我的关注部分 */}
                            <CollapsibleSection icon={Bell} title="我的关注">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* 左侧：待办和催办 */}
                                    <div className="space-y-6">
                                        {/* 待办事项 */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-500"/>
                                                待办事项
                                            </h4>
                                            <div className="space-y-3">
                                                <TodoCard
                                                    onQuoteClick={onQuoteClick}
                                                />
                                            </div>
                                        </div>

                                        {/* 催办状态 */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-yellow-500"/>
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
                                            <CheckCircle className="w-4 h-4 text-green-500"/>
                                            已完成事项及结论
                                        </h4>
                                        <div className="space-y-4">
                                            <CompletedItemCard
                                                item={{
                                                    id: 3,
                                                    title: "性能优化方案确认",
                                                    detail: "完成了项目性能瓶颈分析和优化方案的制定",
                                                    date: "2024-03-15",
                                                    conclusion: "通过引入缓存层和优化数据库查询，预计可提升系统性能30%。",
                                                    proposer: "李四",
                                                    conclusionDate: "2024-03-15"
                                                }}
                                                itemQuotes={[7, 8]}
                                                conclusionQuotes={[9, 10]}
                                                onQuoteClick={onQuoteClick}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleSection>

                            {/* 项目总览部分 */}
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
                                    onToggleStar={handleToggleStar}
                                    onQuoteClick={onQuoteClick}
                                />
                            </CollapsibleSection>
                        </div>
                    </div>
                </div>

                {/* ChatInput 部分 */}
                <div className="flex-none">
                    <ChatInput
                        onClose={onClose}
                        onSendMessage={onSendMessage}
                        isPanelOpen={true}
                        onRendered={handleChatInputRender}
                    />
                </div>
            </div>
        </div>
    );
};


export default ProjectPanel;