import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Send,
  User,
  LogOut,
  X as CloseIcon,
  Brain,
  File,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader,
  Pencil,
  Check
} from "lucide-react";
import { supabase } from "../supabaseClient";
import ragApi from "../services/ragApi";
import { useDocumentUpload } from "../hooks/useDocumentUpload";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const topicId = location.state?.topicId;
  const courseName = location.state?.courseTitle || "Untitled Course";

  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [uploadedSources, setUploadedSources] = useState([]);
  const [leftPanelWidth, setLeftPanelWidth] = useState(350);
  const [isDragging, setIsDragging] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null); // { id, file_name }
  const [isDeletingDoc, setIsDeletingDoc] = useState(false);

  // Editable title state
  const [displayTitle, setDisplayTitle] = useState(courseName);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleInput, setEditTitleInput] = useState(courseName);
  const titleInputRef = useRef(null);

  // API integration states
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Get user ID from Supabase auth
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error getting user:', err);
        navigate('/login');
      }
    };
    getUser();
  }, [navigate]);

  // Fetch documents when userId and topicId are available
  useEffect(() => {
    if (!userId || !topicId) return;

    const loadDocuments = async () => {
      setLoading(true);
      try {
        const { documents } = await ragApi.listDocuments(topicId);
        setUploadedSources(documents || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load documents:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [userId, topicId]);

  // Document upload hook
  const { upload, uploading, processing, progress, error: uploadError } = useDocumentUpload(
    userId,
    topicId,
    async (completedDoc) => {
      // Refresh document list when upload completes
      try {
        const { documents } = await ragApi.listDocuments(topicId);
        setUploadedSources(documents || []);
      } catch (err) {
        console.error('Failed to refresh documents:', err);
      }
    }
  );

  // Auto-refresh document list while any docs are processing
  useEffect(() => {
    if (!userId || !topicId) return;

    const hasProcessing = uploadedSources.some(
      (doc) => doc.status === 'uploading' || doc.status === 'pending' || doc.status === 'processing'
    );

    if (!hasProcessing) return;

    const interval = setInterval(async () => {
      try {
        const { documents } = await ragApi.listDocuments(topicId);
        setUploadedSources(documents || []);
      } catch (err) {
        console.error('Auto-refresh failed:', err);
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [userId, topicId, uploadedSources]);

  // Handle dragging the divider
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;

      // Set minimum and maximum widths
      const minWidth = 250;
      const maxWidth = window.innerWidth - 400;

      if (newWidth > minWidth && newWidth < maxWidth) {
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Scroll to bottom when messages update
  useEffect(() => {
    // Scrolls to the bottom with a smooth animation
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSend = (e) => {
    e?.preventDefault();

    // Check if sources are uploaded and processed
    const processedDocs = uploadedSources.filter(doc => doc.status === 'done');
    if (processedDocs.length === 0) {
      alert("Please wait for at least one document to finish processing before chatting.");
      return;
    }

    if (!currentInput.trim()) return;

    const newUserMessage = { role: "user", content: currentInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentInput("");

    // Simulate AI response (TODO: Replace with actual RAG query)
    setTimeout(() => {
      const aiResponse = {
        role: "ai",
        content: "Here is the detailed response you requested based on the uploaded sources. I've analyzed the documents and prepared this response!"
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1200);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Upload files one by one
    for (let file of files) {
      // Optimistic UI: Add file immediately with 'uploading' status
      const tempId = `temp-${Date.now()}-${file.name}`;
      setUploadedSources((prev) => [
        ...prev,
        {
          id: tempId,
          file_name: file.name,
          status: 'uploading',
          progress_percent: 0,
          processing_stage: 'Uploading...',
        },
      ]);

      try {
        await upload(file);

        // Refresh the list from API to get real document data
        try {
          const { documents } = await ragApi.listDocuments(topicId);
          setUploadedSources(documents || []);
        } catch (refreshErr) {
          console.error('Failed to refresh after upload:', refreshErr);
          // Remove the temp entry on refresh failure
          setUploadedSources((prev) => prev.filter((doc) => doc.id !== tempId));
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        alert(`Failed to upload ${file.name}: ${err.message}`);
        // Remove the temp placeholder on error
        setUploadedSources((prev) => prev.filter((doc) => doc.id !== tempId));
      }
    }

    // Reset input
    fileInputRef.current.value = "";
  };

  const handleRemoveSource = (documentId, fileName) => {
    setDocToDelete({ id: documentId, file_name: fileName });
  };

  const handleConfirmDeleteDoc = async () => {
    if (!docToDelete) return;
    setIsDeletingDoc(true);
    try {
      await ragApi.deleteDocument(docToDelete.id);
      setUploadedSources((prev) => prev.filter((doc) => doc.id !== docToDelete.id));
    } catch (err) {
      console.error('Failed to delete document:', err);
      alert(`Failed to delete document: ${err.message}`);
    } finally {
      setIsDeletingDoc(false);
      setDocToDelete(null);
    }
  };

  const handleCancelDeleteDoc = () => {
    setDocToDelete(null);
  };

  const handleSaveTitle = async () => {
    const newTitle = editTitleInput.trim();
    if (!newTitle) {
      alert("Course title cannot be empty");
      return;
    }
    if (newTitle === displayTitle) {
      setIsEditingTitle(false);
      return;
    }

    // Update locally immediately
    setDisplayTitle(newTitle);
    setIsEditingTitle(false);

    // Persist to Supabase topics table
    try {
      const { error: updateError } = await supabase
        .from('topics')
        .update({ name: newTitle })
        .eq('id', topicId);

      if (updateError) {
        console.error('Failed to update topic name in Supabase:', updateError);
        // Revert on failure
        setDisplayTitle(displayTitle);
      }
    } catch (err) {
      console.error('Failed to save title:', err);
      setDisplayTitle(displayTitle);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans" ref={containerRef}>

      {/* Main Content Area - Two Panel Layout */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <Brain size={24} className="text-blue-600" />
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editTitleInput}
                  onChange={(e) => setEditTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') { setIsEditingTitle(false); setEditTitleInput(displayTitle); }
                  }}
                  className="text-xl font-bold text-gray-800 bg-gray-100 border-2 border-blue-500 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => { setIsEditingTitle(false); setEditTitleInput(displayTitle); }}
                  className="p-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
                  title="Cancel"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ) : (
              <div
                className="group flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors"
                onClick={() => { setIsEditingTitle(true); setEditTitleInput(displayTitle); }}
                title="Click to rename"
              >
                <h1 className="text-xl font-bold text-gray-800">{displayTitle}</h1>
                <Pencil size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">

            </button>
          </div>
        </header>

        {/* Two Panel Content Area */}
        <div className="flex flex-1 overflow-hidden gap-4 p-4">
          {/* LEFT PANEL - Sources/Documents */}
          <div
            style={{ width: `${leftPanelWidth}px` }}
            className="flex flex-col bg-gray-900 text-white overflow-hidden rounded-2xl shadow-lg"
          >
            {/* Sources Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText size={20} /> Sources
              </h2>
            </div>

            {/* Add Sources Button */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                <Plus size={18} />
                Add Sources
              </button>
            </div>

            {/* Uploaded Sources List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {uploadedSources.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                  <File size={32} className="mb-2" />
                  <p>No sources added yet</p>
                  <p className="text-xs mt-2">Click "Add Sources" to get started</p>
                </div>
              ) : (
                uploadedSources.map((doc) => {
                  const statusColors = {
                    uploading: 'bg-blue-600 text-white',
                    pending: 'bg-gray-700 text-gray-300',
                    processing: 'bg-yellow-600 text-white',
                    done: 'bg-green-600 text-white',
                    failed: 'bg-red-600 text-white'
                  };
                  const statusIcons = {
                    uploading: <Loader size={14} className="animate-spin" />,
                    pending: <Loader size={14} className="animate-spin" />,
                    processing: <Loader size={14} className="animate-spin" />,
                    done: <CheckCircle size={14} />,
                    failed: <AlertCircle size={14} />
                  };

                  return (
                    <div
                      key={doc.id}
                      className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <FileText size={18} className="text-blue-400 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-100 truncate break-words">
                            {doc.file_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${statusColors[doc.status]}`}>
                              {statusIcons[doc.status]}
                              {doc.status}
                            </span>
                            {doc.status === 'done' && doc.chunk_count > 0 && (
                              <span className="text-xs text-gray-500">{doc.chunk_count} chunks</span>
                            )}
                          </div>
                          {doc.status === 'processing' && doc.progress_percent !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>{doc.processing_stage}</span>
                                <span>{doc.progress_percent}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-1.5">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${doc.progress_percent}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveSource(doc.id, doc.file_name)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                          title="Remove source"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Upload Progress Indicator */}
              {(uploading || processing) && progress && (
                <div className="p-3 bg-gray-800 rounded-lg border-2 border-blue-500">
                  <div className="flex items-start gap-3">
                    <Loader size={18} className="text-blue-400 flex-shrink-0 mt-1 animate-spin" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 truncate">
                        {progress.file_name}
                      </p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{progress.processing_stage || 'Uploading...'}</span>
                          <span>{progress.progress_percent || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.progress_percent || 0}%` }}
                          />
                        </div>
                        {progress.stage_details && (
                          <p className="text-xs text-gray-500 mt-1">{progress.stage_details}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sources Footer */}
            {uploadedSources.length > 0 && (
              <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
                <p>{uploadedSources.length} source{uploadedSources.length !== 1 ? "s" : ""} loaded</p>
              </div>
            )}
          </div>

          {/* Draggable Divider */}
          <div
            onMouseDown={() => setIsDragging(true)}
            className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors active:bg-blue-600 rounded-full"
            title="Drag to resize panels"
          />

          {/* RIGHT PANEL - Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-lg border border-black">
            {/* Chat Messages Area */}
            <main
              className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
              style={{ minHeight: 0 }}
            >
              <div className="max-w-4xl w-full mx-auto h-full flex flex-col">
                {uploadedSources.length === 0 ? (
                  // Empty state when no sources
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-800 gap-4 px-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <FileText size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center">Add a source to get started</h2>
                    <p className="text-gray-500 text-center">Upload a document, PDF, or text file from the left panel</p>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Add a Source
                    </button>
                  </div>
                ) : messages.length === 0 ? (
                  // Empty state when sources uploaded but no messages
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-800 gap-4 px-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Brain size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center">Hey, what can I help you with today?</h2>
                    <p className="text-gray-500 text-center">Ask questions about your uploaded sources</p>
                  </div>
                ) : (
                  // Messages display
                  <div className="flex-1 flex flex-col justify-end gap-4 pt-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md ${msg.role === "user" ? "bg-blue-600 text-white order-2" : "bg-gray-200 text-gray-700 order-1"
                            }`}
                        >
                          {msg.role === "user" ? <User size={16} className="md:size-5" /> : <Brain size={16} className="md:size-5" />}
                        </div>
                        <div
                          className={`p-3 md:p-4 rounded-xl shadow-md max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] break-words whitespace-pre-wrap transition-all ${msg.role === "user"
                            ? "bg-blue-600 text-white order-1 rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 order-2 rounded-tl-none"
                            }`}
                          style={{ wordBreak: "break-word" }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {/* Auto-scroll target */}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </main>

            {/* Chat Input Area - Always Visible */}
            <div className="sticky bottom-0 bg-white p-4 flex-shrink-0">
              {uploadedSources.length === 0 ? (
                // Disabled state when no sources
                <div className="max-w-4xl w-full mx-auto flex items-end gap-3">
                  <textarea
                    disabled
                    placeholder="Upload a source first to start chatting..."
                    className="flex-1 p-3 text-gray-400 bg-gray-50 resize-none border border-gray-300 rounded-xl transition-all duration-200 max-h-[150px] overflow-y-auto cursor-not-allowed opacity-60"
                    rows={1}
                  />
                  <button
                    type="submit"
                    disabled={true}
                    className="p-2 md:p-3 text-white bg-gray-400 rounded-xl disabled:bg-gray-400 cursor-not-allowed flex-shrink-0 shadow-lg transition-colors"
                  >
                    <Send size={20} className="md:size-5" />
                  </button>
                </div>
              ) : (
                // Active state when sources uploaded
                <div className="max-w-4xl w-full mx-auto flex items-end gap-3">
                  {/* Textarea Input */}
                  <textarea
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    placeholder="Ask questions from your uploaded content..."
                    className="flex-1 p-3 text-gray-800 resize-none border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-xl transition-all duration-200 max-h-[150px] overflow-y-auto bg-white hover:bg-blue-50"
                    rows={1}
                  />
                  {/* Send Button */}
                  <button
                    type="submit"
                    onClick={handleSend}
                    disabled={!currentInput.trim()}
                    className="p-2 md:p-3 text-white bg-blue-600 rounded-xl disabled:bg-gray-400 hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex-shrink-0 shadow-lg"
                  >
                    <Send size={20} className="md:size-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
        accept=".pdf,.docx,.doc,.pptx,.ppt,.odt,.txt,.rtf"
        disabled={uploading || processing}
      />

      {/* Delete Document Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl shadow-2xl max-w-md w-full p-6 bg-white">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center mb-2 text-gray-800">
              Delete Document
            </h3>

            {/* Message */}
            <p className="text-center mb-2 text-gray-600">
              Are you sure you want to delete
            </p>
            <p className="text-center font-semibold mb-2 text-gray-800 break-words">
              "{docToDelete.file_name}"?
            </p>
            <p className="text-center text-sm mb-6 text-gray-500">
              This document and its processed data will be permanently removed. This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelDeleteDoc}
                disabled={isDeletingDoc}
                className="flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteDoc}
                disabled={isDeletingDoc}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${isDeletingDoc
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
                  }`}
              >
                {isDeletingDoc ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}