class WebSocketManager {
    constructor(url, onMessage, onError, onConnected) {
        this.url = url;
        this.onMessage = onMessage;
        this.onError = onError;
        this.onConnected = onConnected;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
        this.reconnectDelay = 1000;
    }

    connect() {
        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.onConnected?.(true); // 连接成功时通知
            };

            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.onMessage?.(message);
            };

            this.ws.onerror = (error) => {
                console.log('WebSocket error:', error);
                this.onError?.(error);
                this.attemptReconnect();
            };

            this.ws.onclose = () => {
                console.log('WebSocket closed');
                this.onConnected?.(false); // 连接关闭时通知
                this.attemptReconnect();
            };
        } catch (error) {
            console.log('WebSocket connection error:', error);
            this.onError?.(error);
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    sendMessage(message) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
            return true;
        }
        return false;
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// 统一的 WebSocket 服务接口
export const echoWebSocketService = {
    // 创建新的聊天连接
    createChatConnection(chatId, onMessage, onError, onConnected) {
        const wsUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws/chat'}?chatId=${chatId}`;
        const wsManager = new WebSocketManager(wsUrl, onMessage, onError, onConnected);
        wsManager.connect();
        return wsManager;
    },

    // 构建用户消息
    buildUserMessage(chatId, content) {
        return {
            type: 'user',
            id: Date.now(),
            chatId,
            content,
            timestamp: new Date().toISOString(),
            userId: "yangx.xiao",
        };
    },


    // 解析接收到的消息
    parseReceivedMessage(message) {
        try {
            return typeof message === 'string' ? JSON.parse(message) : message
        } catch (error) {
            console.log('Error parsing message:', error);
            return null;
        }
    }
};