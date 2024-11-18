// services/api.js

// 自定义API错误类
export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        this.timestamp = new Date();
    }
}

// API配置
const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
};

// 通用请求处理函数
async function fetchWithConfig(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const config = {
        ...options,
        headers: {
            ...API_CONFIG.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            throw new ApiError('Unauthorized', 401);
        }

        if (response.status === 404) {
            throw new ApiError('Resource not found', 404);
        }

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = null;
            }
            throw new ApiError(
                errorData?.message || 'An error occurred while fetching data',
                response.status,
                errorData
            );
        }

        // 如果响应为空或状态码为 204，直接返回
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return;
        }

        // 只有当确实有响应体时才尝试解析 JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408);
        }

        throw new ApiError(error.message || 'Network error', 500);
    }
}
// Chat API服务
export const qtChatHistoryApi = {
    // 获取聊天历史
    async fetchChatHistory(groupId) {
        if (!groupId) {
            throw new ApiError('Group ID is required', 400);
        }
        return await fetchWithConfig(`/qt/history/${groupId}`);
    }
};


export const echoChatHistoryApi = {
    // 获取聊天历史
    async fetchChatHistory(chatId) {
        if (!chatId) {
            throw new ApiError('Group ID is required', 400);
        }
        return await fetchWithConfig(`/echo/history/${chatId}`);
    }
};
// types/reminder.ts
export type TipGenStreamReq = {
    fromUser: string;
    toUser: string;
    before?: string;
    userInstruction?: string;
    event: string;
}

export type StreamResponse = {
    seqId: number;
    message: Record<string, any>;
    type: string;
    role: string;
    content: string;
    toolType: string;
    toolName: string;
    workflowId: string;
    workflowExecId: string;
    code: number;
}

export type QtReplyToGroupReq = {
    todoId: string
    toGroupId: string;
    sendMsg: string;
    userInfoList: Array<{
        userId: string;
        username: string;
    }>;
}

export type TipGenResponse = {
    success: boolean;
    message: string;
}
export const reminderApi = {
    // 流式生成催办消息
    async generateReminder(params: Partial<TipGenStreamReq>) {
        if (!params.event) {
            throw new ApiError('Event is required', 400);
        }

        const defaultParams: TipGenStreamReq = {
            fromUser: 'yangx.xiao',
            toUser: 'yifanyf.yu',
            event: params.event,
            before: params.before,
            userInstruction: params.userInstruction,
        };

        const response = await fetchWithConfig('/qunarMarketAgent/tipGen', {
            method: 'POST',
            body: JSON.stringify(defaultParams),
        });

        return response as TipGenResponse;
    },


    // 发送催办消息
    async sendReminder(message: string, todoId: string) {
        if (!message) {
            throw new ApiError('Message is required', 400);
        }

        const req: QtReplyToGroupReq = {
            todoId : todoId,
            toGroupId: '36bf2b105add11d18cdc7f4b594762c8',
            sendMsg: message,
            userInfoList: [{
                userId: "jianhua.luo",
                username: "罗健华"
            }]
        };

        await fetchWithConfig('/qt/replyToGroup', {
            method: 'POST',
            body: JSON.stringify(req),
        });

        return
    },
};



export const todoApi = {
    // Save a todo item
    async saveTodo(todoId) {
        if (!todoId) {
            throw new ApiError('Todo ID is required', 400);
        }

        const url = `/todo/save?${new URLSearchParams({ todoId }).toString()}`;
        return await fetchWithConfig(url, {
            method: 'GET',
        });
    },

    // Remove a todo item
    async removeTodo(todoId) {
        if (!todoId) {
            throw new ApiError('Todo ID is required', 400);
        }

        const url = `/todo/remove?${new URLSearchParams({ todoId }).toString()}`;
        return await fetchWithConfig(url, {
            method: 'GET',
        });
    },

    // Get all todos
    async getTodos() {
        return await fetchWithConfig(`/todo/get`, {
            method: 'GET',
        });
    }
};

// Helper function to handle todo data
export const todoUtils = {
    // Parse todo response
    parseTodoResponse(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            console.log('Failed to parse todo response:', error);
            return [];
        }
    },

    // Check if todo ID is valid
    isValidTodoId(todoId) {
        return todoId && (todoId.startsWith('Task') || todoId.startsWith('Issue'));
    }
};



import { mockProjectData } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//
// export const projectApi = {
//     // 获取项目数据
//     async getProjectData(projectId) {
//         if (!projectId) {
//             throw new ApiError('Project ID is required', 400);
//         }
//
//         const url = `/api/project/data?${new URLSearchParams({ projectId }).toString()}`;
//         return await fetchWithConfig(url, {
//             method: 'GET',
//         });
//     }
// };

export const mockProjectApi = {
    getProjectData: async (projectId) => {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟API响应
        return {
            code: 0,
            data: mockProjectData,
            message: "success"
        };
    }
};


export const projectApi = {
    getProjectData: async (projectId) => {
        // 使用mock服务
        const response = await mockProjectApi.getProjectData(projectId);

        if (response.code !== 0) {
            throw new Error(response.message || 'API error');
        }

        return response.data;
    }
};