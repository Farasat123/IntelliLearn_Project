// src/services/ragApi.js
// RAG Backend API Service Layer
// This is the single source of truth for all backend API communications

const API_BASE_URL = import.meta.env.VITE_API_URL;
const RETRIEVAL_API_BASE_URL = import.meta.env.VITE_RETRIEVAL_API_URL;

class RAGApiService {
    constructor(baseUrl = API_BASE_URL, retrievalUrl = RETRIEVAL_API_BASE_URL) {
        this.baseUrl = baseUrl;
        this.retrievalUrl = retrievalUrl;
    }

    // ═══════════════════════════════════════════════════════════════
    // HEALTH
    // ═══════════════════════════════════════════════════════════════

    /**
     * Check if the backend API is healthy and running
     * @returns {Promise<{status: string}>}
     */
    async healthCheck() {
        try {
            const res = await fetch(`${this.baseUrl}/health`);
            if (!res.ok) {
                throw new Error(`Health check failed: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // TOPICS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Create a new topic for a user
     * @param {string} userId - User ID
     * @param {string} name - Topic name
     * @param {string|null} description - Optional topic description
     * @returns {Promise<{id: string, user_id: string, name: string, description: string}>}
     */
    async createTopic(userId, name, description = null) {
        try {
            const res = await fetch(`${this.baseUrl}/topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, name, description })
            });

            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.detail || `Failed to create topic: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Create topic error:', error);
            throw error;
        }
    }

    /**
     * List all topics for a user
     * @param {string} userId - User ID
     * @returns {Promise<{topics: Array, count: number}>}
     */
    async listTopics(userId) {
        try {
            const res = await fetch(`${this.baseUrl}/topics/${userId}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch topics: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('List topics error:', error);
            throw error;
        }
    }

    /**
     * Delete a topic and all associated documents and vectors
     * @param {string} topicId - Topic ID to delete
     * @returns {Promise<{status: string, topic_id: string, documents_deleted: number, message: string}>}
     */
    async deleteTopic(topicId) {
        try {
            const res = await fetch(`${this.baseUrl}/topics/${topicId}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.detail || `Failed to delete topic: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Delete topic error:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // DOCUMENTS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Upload a document file
     * @param {string} userId - User ID
     * @param {string} topicId - Topic ID
     * @param {File} file - File to upload
     * @returns {Promise<{document_id: string, file_path: string, file_name: string, user_id: string, topic_id: string, status: string, message: string}>}
     */
    async uploadDocument(userId, topicId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const url = `${this.baseUrl}/upload?user_id=${userId}&topic_id=${topicId}`;
            const res = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.detail || `Upload failed: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Upload document error:', error);
            throw error;
        }
    }

    /**
     * Start ingestion process for uploaded documents
     * @param {string[]} documentIds - Array of document IDs to ingest
     * @returns {Promise<{status: string, queued_count: number, message: string}>}
     */
    async ingestDocuments(documentIds) {
        try {
            const res = await fetch(`${this.baseUrl}/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document_ids: documentIds })
            });

            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.detail || `Ingestion failed: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Ingest documents error:', error);
            throw error;
        }
    }

    /**
     * List all documents in a topic
     * @param {string} topicId - Topic ID
     * @returns {Promise<{documents: Array, count: number}>}
     */
    async listDocuments(topicId) {
        try {
            const res = await fetch(`${this.baseUrl}/documents/${topicId}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch documents: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('List documents error:', error);
            throw error;
        }
    }

    /**
     * Get real-time status of a document
     * @param {string} documentId - Document ID
     * @returns {Promise<{document_id: string, file_name: string, status: string, processing_stage: string, progress_percent: number, stage_details: string, chunk_count: number, created_at: string}>}
     */
    async getDocumentStatus(documentId) {
        try {
            const res = await fetch(`${this.baseUrl}/documents/${documentId}/status`);

            if (!res.ok) {
                throw new Error(`Failed to get document status: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Get document status error:', error);
            throw error;
        }
    }

    /**
     * Delete a document and its vectors
     * @param {string} documentId - Document ID to delete
     * @returns {Promise<{status: string, document_id: string, message: string}>}
     */
    async deleteDocument(documentId) {
        try {
            const res = await fetch(`${this.baseUrl}/documents/${documentId}`, {
                method: "DELETE",
            });

            // If resource not found (404), treat as success to allow UI cleanup
            if (res.status === 404) {
                console.warn(`Document ${documentId} not found in backend, removing from UI.`);
                return true;
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || `Failed to delete document: (${res.status})`);
            }

            return true;
        } catch (error) {
            console.error("Delete document error:", error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // RAG RETRIEVAL (Chat & AI Responses)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Generate AI response from user query with citations
     * This is the primary endpoint for the chat feature
     * @param {string} userId - User ID
     * @param {string} topicId - Topic ID
     * @param {string} query - User's question
     * @returns {Promise<{query: string, response: string, citations: Array, retrieved_chunks: Array, context_used: string, user_message_stored: boolean, assistant_message_stored: boolean}>}
     */
    async generateResponse(userId, topicId, query) {
        try {
            const res = await fetch(`${this.retrievalUrl}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, topic_id: topicId, query })
            });

            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.detail || `Failed to generate response: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Generate response error:', error);
            throw error;
        }
    }

    /**
     * Get all chat history for a topic (newest first)
     * @param {string} topicId - Topic ID
     * @returns {Promise<{topic_id: string, messages: Array, total_count: number}>}
     */
    async getChatHistory(topicId) {
        try {
            const res = await fetch(`${this.retrievalUrl}/chat/history?topic_id=${topicId}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch chat history: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Get chat history error:', error);
            throw error;
        }
    }

    /**
     * Get recent messages for a topic
     * @param {string} topicId - Topic ID
     * @param {number} limit - Number of messages to fetch (default 5, max 20)
     * @returns {Promise<{topic_id: string, messages: Array, total_count: number}>}
     */
    async getRecentMessages(topicId, limit = 5) {
        try {
            const res = await fetch(`${this.retrievalUrl}/chat/recent?topic_id=${topicId}&limit=${limit}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch recent messages: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Get recent messages error:', error);
            throw error;
        }
    }

    /**
     * Manually store a message (fallback when /generate doesn't store automatically)
     * @param {string} topicId - Topic ID
     * @param {string} role - "user" or "assistant"
     * @param {string} content - Message text
     * @returns {Promise<any>}
     */
    async storeMessage(topicId, role, content) {
        try {
            const url = `${this.retrievalUrl}/chat/message?topic_id=${encodeURIComponent(topicId)}&role=${encodeURIComponent(role)}&content=${encodeURIComponent(content)}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Failed to store message: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Store message error:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CONVENIENCE: Upload + Ingest with Progress
    // ═══════════════════════════════════════════════════════════════

    /**
     * Upload a document and start ingestion, polling for progress
     * @param {string} userId - User ID
     * @param {string} topicId - Topic ID
     * @param {File} file - File to upload
     * @param {Function} onProgress - Callback for progress updates
     * @returns {Promise<Object>} - Final document status
     */
    async uploadAndIngest(userId, topicId, file, onProgress) {
        try {
            // Step 1: Upload
            onProgress?.({ stage: 'uploading', percent: 0 });
            const uploadResult = await this.uploadDocument(userId, topicId, file);

            // Step 2: Start ingestion
            onProgress?.({ stage: 'queued', percent: 5 });
            await this.ingestDocuments([uploadResult.document_id]);

            // Step 3: Poll for progress
            return new Promise((resolve, reject) => {
                const poll = async () => {
                    try {
                        const status = await this.getDocumentStatus(uploadResult.document_id);

                        onProgress?.({
                            stage: status.processing_stage,
                            percent: status.progress_percent,
                            details: status.stage_details
                        });

                        if (status.status === 'done') {
                            resolve(status);
                            return;
                        }

                        if (status.status === 'failed') {
                            reject(new Error('Document processing failed'));
                            return;
                        }

                        // Continue polling every 3 seconds
                        setTimeout(poll, 3000);
                    } catch (error) {
                        reject(error);
                    }
                };

                poll();
            });
        } catch (error) {
            console.error('Upload and ingest error:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const ragApi = new RAGApiService();
export default ragApi;
