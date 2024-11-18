/**
 * Transforms backend data format to frontend data structure
 */
export const transformProjectData = (backendData) => {
    const {
        effectiveMsgSize,
        projectTime,
        tasks,
        processingIssues,
        doneIssues
    } = backendData;

    // Group tasks by status
    const groupedTasks = {
        pending: tasks.filter(t => t.status === 'pending'),
        inProgress: tasks.filter(t => t.status === 'in_progress'),
        completed: tasks.filter(t => t.status === 'done')
    };

    // Transform tasks to include UI-specific fields
    const transformTask = (task) => ({
        taskId: task.taskId,
        name: task.name,
        content: task.content,
        createTime: task.createTime,
        deadline: task.deadline,
        status: task.status,
        priority: task.priority || 'medium',
        taskType: task.taskType,
        assigneeId: task.assigneeId,
        creatorId: task.creatorId,
        messageIds: task.messageIds || [],
        isStarred: false // 这个字段可能需要从其他API获取
    });

    // Transform issues
    const transformIssue = (issue) => ({
        issueId: issue.issueId,
        name: issue.name,
        description: issue.description,
        raiseTime: issue.raiseTime,
        resolveTime: issue.resolveTime,
        status: issue.status,
        severity: issue.severity,
        issueType: issue.issueType,
        referenceCount: issue.referenceCount,
        messageIds: issue.messageIds || []
    });

    // Extract team members from tasks
    const extractTeamMembers = () => {
        const memberMap = new Map();

        // Collect unique members from tasks
        tasks.forEach(task => {
            if (task.assigneeId) {
                memberMap.set(task.assigneeId, {
                    id: task.assigneeId,
                    name: task.assigneeId,
                    role: determineRole(task.taskType),
                    isLead: false
                });
            }
            if (task.creatorId) {
                memberMap.set(task.creatorId, {
                    id: task.creatorId,
                    name: task.creatorId,
                    role: determineRole(task.taskType),
                    isLead: false
                });
            }
        });

        // Group members by role
        const teamGroups = {
            '前端开发': [],
            '后端开发': [],
            '产品设计': [],
            '测试团队': []
        };

        memberMap.forEach(member => {
            const team = determineTeam(member.role);
            if (teamGroups[team]) {
                teamGroups[team].push(member);
            }
        });

        // Set team leads (first member of each team)
        Object.values(teamGroups).forEach(team => {
            if (team.length > 0) {
                team[0].isLead = true;
            }
        });

        return Object.entries(teamGroups)
            .filter(([_, members]) => members.length > 0)
            .map(([name, members]) => ({
                name,
                members
            }));
    };

    // Generate timeline from tasks and issues
    const generateTimeline = () => {
        const timelineEvents = [
            // From tasks
            ...tasks.map(task => ({
                id: task.taskId,
                type: 'task_created',
                content: `创建任务：${task.name}`,
                user: task.creatorId,
                time: task.createTime,
                result: getStatusText(task.status),
                quotes: task.messageIds?.slice(0, 2) || []
            })),
            // From resolved issues
            ...doneIssues.map(issue => ({
                id: issue.issueId,
                type: 'issue_resolved',
                content: `解决问题：${issue.name}`,
                user: issue.solverId || '未知',
                time: issue.resolveTime,
                result: '已解决',
                quotes: issue.messageIds?.slice(0, 2) || []
            }))
        ]
            .filter(event => event.time) // Filter out events without time
            .sort((a, b) => new Date(b.time) - new Date(a.time)) // Sort by time descending
            .slice(0, 10); // Take only the last 10 events

        return timelineEvents;
    };

    return {
        stats: {
            effectiveMsgSize,
            projectTime,
            pendingTasks: groupedTasks.pending.length,
            completedTasks: groupedTasks.completed.length,
            openIssues: processingIssues.filter(i => i.status === 'open').length,
            resolvedIssues: doneIssues.length
        },
        teams: extractTeamMembers(),
        tasks: {
            pending: groupedTasks.pending.map(transformTask),
            inProgress: groupedTasks.inProgress.map(transformTask),
            completed: groupedTasks.completed.map(transformTask)
        },
        issues: {
            active: processingIssues.map(transformIssue),
            resolved: doneIssues.map(transformIssue)
        },
        timeline: generateTimeline()
    };
};

// Helper functions
const determineRole = (taskType) => {
    switch (taskType) {
        case 'feature':
        case 'improvement':
            return '开发工程师';
        case 'bug_fix':
            return '测试工程师';
        case 'process':
            return '产品经理';
        default:
            return '团队成员';
    }
};

const determineTeam = (role) => {
    if (role.includes('前端')) return '前端开发';
    if (role.includes('后端')) return '后端开发';
    if (role.includes('测试')) return '测试团队';
    if (role.includes('产品')) return '产品设计';
    return '其他团队';
};

const getStatusText = (status) => {
    switch (status) {
        case 'pending': return '待处理';
        case 'in_progress': return '进行中';
        case 'done': return '已完成';
        default: return '未知状态';
    }
};

