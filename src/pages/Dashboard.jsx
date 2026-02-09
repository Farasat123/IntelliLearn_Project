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
  FileText
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseName = location.state?.courseTitle || "Untitled Course";
  
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [uploadedSources, setUploadedSources] = useState([]);
  const [leftPanelWidth, setLeftPanelWidth] = useState(350); // Initial left panel width
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

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

  const handleLogout = () => {
    // In a real app, this would also call a Firebase signOut function
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSend = (e) => {
    e?.preventDefault();
    
    // Check if sources are uploaded
    if (uploadedSources.length === 0) {
      alert("Please upload at least one source before starting a chat.");
      return;
    }

    if (!currentInput.trim()) return;

    const newUserMessage = { role: "user", content: currentInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "ai",
        content: "Here is the detailed response you requested based on the uploaded sources. I've analyzed the documents and prepared this response!"
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Add all selected files to sources
    for (let file of files) {
      const newSource = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type,
      };
      setUploadedSources((prev) => [...prev, newSource]);
    }

    // Reset input
    fileInputRef.current.value = "";
  };

  const handleRemoveSource = (sourceId) => {
    setUploadedSources((prev) => prev.filter((source) => source.id !== sourceId));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans" ref={containerRef}>

      {/* Main Content Area - Two Panel Layout */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <Brain size={24} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">{courseName}</h1>
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
                uploadedSources.map((source) => (
                  <div
                    key={source.id}
                    className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <FileText size={18} className="text-blue-400 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-100 truncate break-words">
                          {source.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{source.size}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveSource(source.id)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                        title="Remove source"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
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
                          className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md ${
                            msg.role === "user" ? "bg-blue-600 text-white order-2" : "bg-gray-200 text-gray-700 order-1"
                          }`}
                        >
                          {msg.role === "user" ? <User size={16} className="md:size-5" /> : <Brain size={16} className="md:size-5" />}
                        </div>
                        <div
                          className={`p-3 md:p-4 rounded-xl shadow-md max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] break-words whitespace-pre-wrap transition-all ${
                            msg.role === "user"
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
        accept=".pdf,.txt,.doc,.docx,.md"
      />
    </div>
  );
}