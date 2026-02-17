// src/services/ragApi.js
// RAG Backend API Service Layer
// This is the single source of truth for all backend API communications

const API_BASE_URL = import.meta.env.VITE_API_URL;

class RAGApiService {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
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
