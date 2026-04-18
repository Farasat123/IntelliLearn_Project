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
  Check,
  Copy
} from "lucide-react";
import { supabase } from "../supabaseClient";
import ragApi from "../services/ragApi";
import { useDocumentUpload } from "../hooks/useDocumentUpload";
import { useTheme } from "../context/ThemeContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Component for copying text to clipboard
function CopyButton({ text, isDark = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${copied
          ? isDark
            ? "bg-green-500/20 text-green-300 border-green-500/30"
            : "bg-green-100 text-green-600 border-green-200"
          : isDark
            ? "hover:bg-slate-700 text-slate-300 hover:text-blue-300 border-transparent"
            : "hover:bg-gray-100 text-gray-500 hover:text-blue-600 border-transparent"
        } border`}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied && <span className="text-[10px] font-bold uppercase tracking-wider">Copied</span>}
    </button>
  );
}

// Component for an individual citation badge with tooltip
function CitationBadge({ num, citation }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="relative inline-block mx-0.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <sup className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
        [{num}]
      </sup>
      {hovered && citation && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-4 bg-gray-900 text-white text-xs rounded-xl shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="font-bold mb-1.5 text-blue-400 flex items-center gap-2">
            <FileText size={14} />
            {citation.file_name}
          </div>
          <div className="text-gray-300 mb-2 pb-2 border-b border-gray-700">
            {citation.section_title && (
              <span className="font-medium text-gray-200">
                {citation.section_title} •{" "}
              </span>
            )}
            <span className="bg-gray-800 px-1.5 py-0.5 rounded">Page {citation.page}</span>
          </div>
          <div className="text-gray-400 leading-relaxed italic line-clamp-4 bg-gray-950/50 p-2 rounded-lg">
            "{citation.chunk_text}"
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </span>
  );
}

// Component to render message content with citation tooltips and Markdown support
function MessageWithCitations({ content, citations, isDark = false }) {
  // Helper to find and replace citation markers in text
  const processText = (text) => {
    if (typeof text !== "string") return text;

    const parts = [];
    const citationRegex = /\[(\d+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const num = parseInt(match[1]);
      const citation = citations.find((c) => c.number === num);
      parts.push(<CitationBadge key={`${num}-${match.index}`} num={num} citation={citation} />);

      lastIndex = citationRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Recursively process children to find text and handle citations
  const renderCitations = (children) => {
    return React.Children.map(children, (child) => {
      if (typeof child === "string") {
        return processText(child);
      }
      if (React.isValidElement(child) && child.props.children) {
        return React.cloneElement(child, {
          children: renderCitations(child.props.children),
        });
      }
      return child;
    });
  };

  const components = {
    // Override standard elements to include citation processing and custom styling
    p: ({ children }) => (
      <p className="mb-4 last:mb-0 leading-relaxed">{renderCitations(children)}</p>
    ),
    ol: ({ children }) => (
      <ol className={`list-decimal pl-6 space-y-2 mb-4 ml-2 marker:font-bold ${isDark ? "marker:text-slate-100" : "marker:text-gray-900"}`}>
        {children}
      </ol>
    ),
    ul: ({ children }) => (
      <ul className={`list-disc pl-6 space-y-2 mb-4 ml-2 ${isDark ? "marker:text-slate-300" : "marker:text-gray-700"}`}>
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className={`pl-1 leading-relaxed ${isDark ? "text-slate-100" : "text-gray-800"}`}>
        {renderCitations(children)}
      </li>
    ),
    strong: ({ children }) => (
      <strong className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{renderCitations(children)}</strong>
    ),
    h1: ({ children }) => <h1 className={`text-2xl font-bold mb-4 mt-6 ${isDark ? "text-white" : "text-gray-900"}`}>{renderCitations(children)}</h1>,
    h2: ({ children }) => <h2 className={`text-xl font-bold mb-3 mt-5 ${isDark ? "text-white" : "text-gray-900"}`}>{renderCitations(children)}</h2>,
    h3: ({ children }) => <h3 className={`text-lg font-bold mb-2 mt-4 ${isDark ? "text-white" : "text-gray-900"}`}>{renderCitations(children)}</h3>,
    code: ({ inline, children }) =>
      inline ? (
        <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${isDark ? "bg-slate-700 text-pink-300" : "bg-gray-100 text-pink-600"}`}>
          {children}
        </code>
      ) : (
        <pre className={`p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono shadow-inner ${isDark ? "bg-slate-900 text-slate-100" : "bg-gray-800 text-gray-100"}`}>
          <code>{children}</code>
        </pre>
      ),
  };

  return (
    <div className={`prose max-w-none prose-p:my-0 prose-headings:mb-4 prose-li:my-0 ${isDark ? "prose-invert" : "prose-blue"}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}


export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Notification state
  const [notification, setNotification] = useState(null);
  const notificationTimerRef = useRef(null);

  const showNotification = (message, type = 'error') => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type });
    notificationTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.pptx', '.ppt', '.odt', '.txt', '.rtf'];

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

  // Load chat history when userId and topicId are available
  useEffect(() => {
    if (!userId || !topicId) return;

    const loadHistory = async () => {
      console.log('🔄 Loading chat history for topicId:', topicId);
      setLoadingHistory(true);
      try {
        const data = await ragApi.getChatHistory(topicId);
        console.log('✅ Chat history response:', data);
        console.log('📊 Total messages:', data.messages?.length || 0);

        // API returns newest first, we want oldest first for chat display
        const formattedMessages = (data.messages || []).reverse().map(msg => ({
          role: msg.role,
          content: msg.content,
          // Citations are not returned in chat history, only in /generate
        }));

        console.log('📝 Formatted messages:', formattedMessages);
        setMessages(formattedMessages);
      } catch (err) {
        console.error('❌ Failed to load chat history:', err);
        console.error('Error details:', err.message);
        // Don't show error to user, just start with empty messages
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
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

  const handleSend = async (e) => {
    e?.preventDefault();

    // Check if sources are uploaded and processed
    const processedDocs = uploadedSources.filter(doc => doc.status === 'done');
    if (processedDocs.length === 0) {
      alert("Please wait for at least one document to finish processing before chatting.");
      return;
    }

    if (!currentInput.trim() || isGenerating) return;

    const query = currentInput.trim();
    const newUserMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentInput("");

    // Call the RAG Retrieval API to generate AI response
    setIsGenerating(true);
    try {
      console.log('🚀 Sending question to API:', query);
      console.log('📍 User ID:', userId, 'Topic ID:', topicId);
      const data = await ragApi.generateResponse(userId, topicId, query);
      console.log('✅ API Response:', data);
      console.log('💾 Message storage status:', {
        user_message_stored: data.user_message_stored,
        assistant_message_stored: data.assistant_message_stored
      });

      // FALLBACK: If backend didn't store messages, store them manually
      if (!data.user_message_stored) {
        console.log('⚠️ Backend did not store user message, storing manually...');
        try {
          await ragApi.storeMessage(topicId, 'user', query);
          console.log('✅ User message stored manually');
        } catch (storeErr) {
          console.error('❌ Failed to manually store user message:', storeErr);
        }
      }

      if (!data.assistant_message_stored) {
        console.log('⚠️ Backend did not store assistant message, storing manually...');
        try {
          await ragApi.storeMessage(topicId, 'assistant', data.response);
          console.log('✅ Assistant message stored manually');
        } catch (storeErr) {
          console.error('❌ Failed to manually store assistant message:', storeErr);
        }
      }

      const aiResponse = {
        role: "assistant",
        content: data.response,
        citations: data.citations || []
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error('❌ Failed to generate response:', err);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error while generating a response. Please try again.",
        citations: []
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Upload files one by one
    for (let file of files) {
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        showNotification(`Unsupported file format: ${extension}. Please use PDF, Word, or PowerPoint files.`, 'error');
        continue;
      }

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
        showNotification(`Failed to upload ${file.name}: ${err.message}`, 'error');
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
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-gray-900"}`}
      ref={containerRef}
    >

      {/* Main Content Area - Two Panel Layout */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className={`flex items-center justify-between p-4 border-b flex-shrink-0 transition-colors ${isDark ? "bg-slate-900 border-slate-800 shadow-[0_10px_30px_rgba(2,6,23,0.4)]" : "bg-white border-gray-200 shadow-sm"}`}>
          <div className="flex items-center gap-3">
            <img
              src="/intellilogo.png"
              alt="IntelliLearn Logo"
              className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={() => navigate('/dashboard-home')}
              title="Go to Dashboard Home"
            />
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
                  className={`text-xl font-bold border-2 border-blue-500 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${isDark ? "text-slate-100 bg-slate-800" : "text-gray-800 bg-gray-100"}`}
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
                  className={`p-1.5 rounded-lg border transition-colors ${isDark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-300 text-gray-500 hover:bg-gray-100"}`}
                  title="Cancel"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ) : (
              <div
                className={`group flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
                onClick={() => { setIsEditingTitle(true); setEditTitleInput(displayTitle); }}
                title="Click to rename"
              >
                <h1 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-800"}`}>{displayTitle}</h1>
                <Pencil size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-slate-500" : "text-gray-400"}`} />
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
          <div className={`flex-1 flex flex-col overflow-hidden rounded-2xl shadow-lg border transition-colors ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-black"}`}>
            {/* Chat Messages Area */}
            <main
              className={`flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin ${isDark ? "scrollbar-thumb-slate-700 scrollbar-track-slate-900" : "scrollbar-thumb-gray-400 scrollbar-track-gray-200"}`}
              style={{ minHeight: 0 }}
            >
              <div className="max-w-4xl w-full mx-auto h-full flex flex-col">
                {uploadedSources.length === 0 ? (
                  // Empty state when no sources
                  <div className={`flex-1 flex flex-col items-center justify-center gap-4 px-4 ${isDark ? "text-slate-100" : "text-gray-800"}`}>
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <FileText size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center">Add a source to get started</h2>
                    <p className={`text-center ${isDark ? "text-slate-400" : "text-gray-500"}`}>Upload a document, PDF, or text file from the left panel</p>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Add a Source
                    </button>
                  </div>
                ) : messages.length === 0 ? (
                  // Empty state when sources uploaded but no messages
                  <div className={`flex-1 flex flex-col items-center justify-center gap-4 px-4 ${isDark ? "text-slate-100" : "text-gray-800"}`}>
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Brain size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center">Hey, what can I help you with today?</h2>
                    <p className={`text-center ${isDark ? "text-slate-400" : "text-gray-500"}`}>Ask questions about your uploaded sources</p>
                  </div>
                ) : (
                  // Messages display
                  <div className="flex-1 flex flex-col justify-end gap-4 pt-4">
                    {loadingHistory ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader size={32} className="animate-spin text-blue-600" />
                      </div>
                    ) : (
                      messages.map((msg, index) => (
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
                            className={`relative group p-3 md:p-4 rounded-xl shadow-md max-w-[85%] sm:max-w-[75%] lg:max-w-[80%] break-words transition-all ${msg.role === "user"
                              ? "bg-blue-600 text-white order-1 rounded-br-none"
                              : isDark
                                ? "bg-slate-800 text-slate-100 border border-slate-700 order-2 rounded-tl-none px-5 py-4"
                                : "bg-white text-gray-800 border border-gray-200 order-2 rounded-tl-none px-5 py-4"
                              }`}
                            style={{ wordBreak: "break-word" }}
                          >
                            {msg.role === "assistant" ? (
                              <>
                                <MessageWithCitations content={msg.content} citations={msg.citations || []} isDark={isDark} />
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <CopyButton text={msg.content} isDark={isDark} />
                                </div>
                              </>
                            ) : (
                              <>
                                {msg.content}
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <CopyButton text={msg.content} isDark={isDark} />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {/* Typing indicator */}
                    {isGenerating && (
                      <div className="flex items-start gap-3 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md bg-gray-200 text-gray-700">
                          <Brain size={16} className="md:size-5" />
                        </div>
                        <div className={`p-3 md:p-4 rounded-xl shadow-md rounded-tl-none ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"}`}>
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Auto-scroll target */}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </main>

            {/* Chat Input Area - Always Visible */}
            <div className={`sticky bottom-0 p-4 flex-shrink-0 transition-colors ${isDark ? "bg-slate-900" : "bg-white"}`}>
              {uploadedSources.length === 0 ? (
                // Disabled state when no sources
                <div className="max-w-4xl w-full mx-auto flex items-end gap-3">
                  <textarea
                    disabled
                    placeholder="Upload a source first to start chatting..."
                    className={`flex-1 p-3 resize-none border rounded-xl transition-all duration-200 max-h-[150px] overflow-y-auto cursor-not-allowed opacity-60 ${isDark ? "text-slate-500 bg-slate-800 border-slate-700" : "text-gray-400 bg-gray-50 border-gray-300"}`}
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
                    className={`flex-1 p-3 resize-none border-2 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-xl transition-all duration-200 max-h-[150px] overflow-y-auto ${isDark ? "text-slate-100 border-slate-700 bg-slate-800 hover:bg-slate-800/90" : "text-gray-800 border-gray-300 bg-white hover:bg-blue-50"}`}
                    rows={1}
                  />
                  {/* Send Button */}
                  <button
                    type="submit"
                    onClick={handleSend}
                    disabled={!currentInput.trim() || isGenerating}
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
          <div className={`rounded-xl shadow-2xl max-w-md w-full p-6 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white"}`}>
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>
              Delete Document
            </h3>

            {/* Message */}
            <p className={`text-center mb-2 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Are you sure you want to delete
            </p>
            <p className={`text-center font-semibold mb-2 break-words ${isDark ? "text-white" : "text-gray-800"}`}>
              "{docToDelete.file_name}"?
            </p>
            <p className={`text-center text-sm mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              This document and its processed data will be permanently removed. This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelDeleteDoc}
                disabled={isDeletingDoc}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors border ${isDark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
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

      {/* Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-right-10 duration-300">
          <div className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border ${notification.type === 'error'
              ? isDark
                ? 'bg-red-900/40 border-red-800 text-red-200'
                : 'bg-red-50 border-red-100 text-red-800'
              : isDark
                ? 'bg-green-900/40 border-green-800 text-green-200'
                : 'bg-green-50 border-green-100 text-green-800'
            }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'error'
                ? isDark
                  ? 'bg-red-900/60 text-red-300'
                  : 'bg-red-100 text-red-600'
                : isDark
                  ? 'bg-green-900/60 text-green-300'
                  : 'bg-green-100 text-green-600'
              }`}>
              {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            </div>
            <div className="flex-1 pr-8">
              <p className="font-semibold text-sm">Upload Issue</p>
              <p className="text-xs opacity-90">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className={`absolute top-2 right-2 p-1 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <CloseIcon size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}