// src/hooks/useDocumentUpload.js
// Custom React hook for managing document upload and ingestion workflow
// Handles: upload state, progress polling, memory cleanup

import { useState, useRef, useCallback, useEffect } from 'react';
import ragApi from '../services/ragApi';

/**
 * Custom hook for document upload with real-time progress tracking
 * @param {string} userId - Current user ID
 * @param {string} topicId - Topic ID to upload document to
 * @param {Function} onComplete - Callback when upload completes successfully
 * @returns {Object} Upload state and actions
 */
export function useDocumentUpload(userId, topicId, onComplete) {
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);
    const pollingRef = useRef(null);
    const mountedRef = useRef(true);

    // Cleanup on unmount (React 18 StrictMode compatible)
    useEffect(() => {
        // Reset to true on EVERY mount (fixes React StrictMode double-mount)
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            if (pollingRef.current) {
                clearTimeout(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, []);

    /**
     * Start polling for document status
     * @param {string} documentId - Document ID to poll
     */
    const startPolling = useCallback((documentId) => {
        const poll = async () => {
            // Don't continue if component unmounted
            if (!mountedRef.current) {
                return;
            }

            try {
                const status = await ragApi.getDocumentStatus(documentId);

                if (!mountedRef.current) return;

                setProgress(status);

                // Check if processing is complete
                if (status.status === 'done') {
                    setProcessing(false);
                    setProgress(status);
                    onComplete?.(status);
                    return; // Stop polling
                }

                // Check if processing failed
                if (status.status === 'failed') {
                    setProcessing(false);
                    setError(new Error(`Processing failed: ${status.stage_details || 'Unknown error'}`));
                    return; // Stop polling
                }

                // Continue polling if still processing
                if (status.status === 'processing' || status.status === 'pending') {
                    pollingRef.current = setTimeout(poll, 3000); // Poll every 3 seconds
                }
            } catch (err) {
                if (!mountedRef.current) return;

                console.error('Polling error:', err);
                setProcessing(false);
                setError(err);
            }
        };

        poll();
    }, [onComplete]);

    /**
     * Upload a file and start ingestion
     * @param {File} file - File to upload
     */
    const upload = useCallback(async (file) => {
        if (!userId || !topicId) {
            setError(new Error('User ID and Topic ID are required'));
            return;
        }

        setUploading(true);
        setError(null);
        setProgress(null);

        try {
            // Step 1: Upload file
            console.log('[UPLOAD] Step 1: Uploading file...', { userId, topicId, fileName: file.name });
            const uploadResult = await ragApi.uploadDocument(userId, topicId, file);
            console.log('[UPLOAD] Step 1 COMPLETE. Upload response:', JSON.stringify(uploadResult, null, 2));

            // Extract document_id immediately
            const documentId = uploadResult.document_id;
            if (!documentId) {
                console.error('[UPLOAD] ERROR: No document_id in upload response!', uploadResult);
                throw new Error('Upload succeeded but no document_id was returned.');
            }

            // Step 2: ALWAYS trigger ingestion after successful upload
            // This must happen regardless of component mount state
            console.log('[UPLOAD] Step 2: Starting ingestion with document_id:', documentId);
            const ingestResult = await ragApi.ingestDocuments([documentId]);
            console.log('[UPLOAD] Step 2 COMPLETE. Ingest response:', JSON.stringify(ingestResult, null, 2));

            // Only update UI state if component is still mounted
            if (!mountedRef.current) {
                console.log('[UPLOAD] Component unmounted, skipping UI updates (but ingestion was triggered!)');
                return;
            }

            setUploading(false);
            setProcessing(true);

            // Step 3: Start polling for progress
            console.log('[UPLOAD] Step 3: Starting status polling for document_id:', documentId);
            startPolling(documentId);

        } catch (err) {
            console.error('[UPLOAD] FAILED. Error:', err.message, err);
            if (!mountedRef.current) return;
            setUploading(false);
            setProcessing(false);
            setError(err);
        }
    }, [userId, topicId, startPolling]);

    /**
     * Cancel ongoing operations and cleanup
     */
    const cancel = useCallback(() => {
        if (pollingRef.current) {
            clearTimeout(pollingRef.current);
            pollingRef.current = null;
        }
        setUploading(false);
        setProcessing(false);
        setProgress(null);
    }, []);

    /**
     * Reset error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        upload,
        uploading,
        processing,
        progress,
        error,
        cancel,
        clearError,
        // Derived states
        isActive: uploading || processing,
        progressPercent: progress?.progress_percent || 0,
        processingStage: progress?.processing_stage || '',
        stageDetails: progress?.stage_details || ''
    };
}

export default useDocumentUpload;
