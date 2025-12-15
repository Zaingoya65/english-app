import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ChatService {
    constructor() {
        this.sessionId = this.generateSessionId();
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async sendMessage(message, options = {}) {
        try {
            const response = await axios.post(`${API_URL}/chat`, {
                message,
                sessionId: this.sessionId,
                mode: options.mode || 'default',
                topic: options.topic || ''
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            // console.error('Chat service error:', error);

            // Handle specific error cases
            if (error.response?.status === 503) {
                return {
                    success: false,
                    error: 'The AI model is loading. Please wait a moment and try again.'
                };
            }

            if (error.response?.status === 401) {
                return {
                    success: false,
                    error: 'API authentication failed. Please check your configuration.'
                };
            }

            if (error.response?.data?.message) {
                return {
                    success: false,
                    error: error.response.data.message
                };
            }

            return {
                success: false,
                error: 'Failed to connect to the chat service. Please try again.'
            };
        }
    }

    async generateReport() {
        try {
            const response = await axios.post(`${API_URL}/chat/report`, {
                sessionId: this.sessionId
            });

            return {
                success: true,
                report: response.data.report
            };
        } catch (error) {
            // console.error('Report generation error:', error);
            return {
                success: false,
                error: 'Failed to generate report.'
            };
        }
    }

    async clearHistory() {
        try {
            await axios.delete(`${API_URL}/chat/history/${this.sessionId}`);
            return { success: true };
        } catch (error) {
            // console.error('Failed to clear history:', error);
            return { success: false };
        }
    }

    resetSession() {
        this.sessionId = this.generateSessionId();
    }
}

export default new ChatService();
