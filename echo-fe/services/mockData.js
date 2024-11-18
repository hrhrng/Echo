export const mockProjectData = {
    stats: {
        duration: "45天",
        messageCount: "268",
        solvedCount: "24"
    },
    teams: [
        {
            name: '研发团队',
            icon: 'Code',
            colorClass: 'bg-blue-50 text-blue-500',
            members: [
                { name: '张三', role: '前端开发', isLead: true },
                { name: '李四', role: '后端开发' },
                { name: '王五', role: '系统架构师' }
            ]
        },
        {
            name: '设计团队',
            icon: 'PenTool',
            colorClass: 'bg-violet-50 text-violet-500',
            members: [
                { name: '赵六', role: 'UI设计师', isLead: true },
                { name: '钱七', role: 'UX设计师' }
            ]
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
        }
    ],
    reminders: [
        {
            id: 1,
            content: "项目文档更新",
            date: "2024-03-15",
            resolved: true,
            quotes: [5]
        }
    ],
    completedItems: [
        {
            id: 1,
            title: "性能优化方案确认",
            detail: "完成了项目性能瓶颈分析和优化方案的制定",
            date: "2024-03-15",
            conclusion: "通过引入缓存层和优化数据库查询，预计可提升系统性能30%。",
            proposer: "李四",
            conclusionDate: "2024-03-15",
            itemQuotes: [7, 8],
            conclusionQuotes: [9, 10]
        }
    ],
    issues: [
        {
            id: 1,
            title: "数据库查询性能问题",
            detail: "系统在高并发场景下数据库查询响应缓慢",
            conclusion: "1. 优化了关键SQL查询语句\n2. 添加了适当的索引\n3. 实现了查询缓存机制",
            resolvedBy: "张三",
            createdDate: "2024-03-10",
            resolvedDate: "2024-03-14",
            duration: "4天",
            conclusionDate: "2024-03-15",
            quotes: [4, 5],
            conclusionQuotes: [1]
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
        }
    ]
};