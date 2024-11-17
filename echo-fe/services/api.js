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

        // 处理401未授权情况
        if (response.status === 401) {
            // 可以在这里处理token刷新或跳转到登录页
            throw new ApiError('Unauthorized', 401);
        }

        // 处理404
        if (response.status === 404) {
            throw new ApiError('Resource not found', 404);
        }

        // 处理500及其他错误
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

        // 如果响应为空，返回null
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // 处理网络错误
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
