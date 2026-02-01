import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Plus,
  MessageSquare,
  Paperclip,
  Send,
  User,
  LogOut,
  X as CloseIcon,
  Brain,
  ChevronLeft,
  ChevronRight,
  Trash2
} from "lucide-react";

// --- Mock Data ---
const mockChatHistory = [
  { id: 1, title: "Concepts of ML" },
  { id: 2, title: "Definition of Database" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  // Sidebar starts open on desktop, hidden on mobile by default (controlled by CSS)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [chatHistory, setChatHistory] = useState(mockChatHistory);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (!currentInput.trim()) return;

    const newUserMessage = { role: "user", content: currentInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "ai",
        content: "Here is the detailed response you requested. I've enabled scrolling and auto-scroll for you, and ensured the toggle button works correctly!"
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileMessage = { role: "user", content: `I've uploaded ${file.name}. Can you summarize it?` };
    setMessages((prev) => [...prev, fileMessage]);

    setTimeout(() => {
      const aiResponse = { role: "ai", content: `Sure, analyzing ${file.name}...` };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
    const newChat = { id: Date.now(), title: `New Chat ${chatHistory.length + 1}` };
    setChatHistory([newChat, ...chatHistory]);
    // Close sidebar on mobile after starting a new chat
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const loadChat = (chatId) => {
    const chatTitle = chatHistory.find((chat) => chat.id === chatId)?.title || "New Chat";
    setMessages([{ role: "ai", content: `You are now viewing the chat: "${chatTitle}".` }]);
    // Close sidebar on mobile after loading a chat
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation(); // Prevent triggering the loadChat function
    setChatHistory(chatHistory.filter(chat => chat.id !== chatId));
    
    // If we're currently viewing the deleted chat, clear messages
    if (messages.length > 0 && messages[0].content.includes(chatHistory.find(chat => chat.id === chatId)?.title)) {
      setMessages([]);
    }
  };

  const SidebarLink = ({ icon, text, onClick, onDelete, showDelete = false }) => (
    <button
      onClick={onClick}
      className="group flex items-center justify-between w-full p-3 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors relative"
    >
      <div className="flex items-center flex-1 min-w-0">
        {icon}
        <span className="ml-3 truncate">{text}</span>
      </div>
      
      {/* Delete button that appears on hover */}
      {showDelete && (
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all duration-200 ml-2 flex-shrink-0"
          title="Delete chat"
        >
          <Trash2 size={16} />
        </button>
      )}
    </button>
  );

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">

      {/* Sidebar Overlay for Mobile (to close sidebar when tapping outside) */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-gray-900 text-white p-4 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:transform md:transition-all md:duration-300 ${
          isSidebarOpen ? "md:translate-x-0 md:w-64" : "md:-translate-x-full md:w-0"
        } md:overflow-hidden`}
      >
        {/* Sidebar Header - Toggle button removed from desktop */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain size={24} />
            <h1 className="text-xl font-bold">IntelliLearn</h1>
          </div>
          {/* Close Button: Visible only on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <button
          onClick={handleNewChat}
          className="flex items-center w-full p-3 mb-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus size={20} className="mr-2" /> New Chat
        </button>

        {/* Chat History Scrollable Area */}
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <h3 className="px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider">History</h3>
          {chatHistory.map((chat) => (
            <SidebarLink
              key={chat.id}
              icon={<MessageSquare size={18} />}
              text={chat.title}
              onClick={() => loadChat(chat.id)}
              onDelete={(e) => deleteChat(chat.id, e)}
              showDelete={true}
            />
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <SidebarLink icon={<LogOut size={18} />} text="Logout" onClick={handleLogout} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${
        isSidebarOpen ? "md:ml-0" : "md:ml-0"
      }`}>

        {/* Header with Toggle Button - Always visible */}
        <header className="flex items-center p-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full text-gray-700 hover:bg-gray-100 mr-3"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-blue-600" />
            <h1 className="text-lg font-bold text-gray-800">IntelliLearn</h1>
          </div>
        </header>

        {/* Main Content (Messages): Scrollable area for the chat history */}
        <main
          className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          style={{ minHeight: 0 }} // Ensures the flex container doesn't overflow its parent
        >
          {/* Inner container to center content and control message flow */}
          <div className="max-w-4xl w-full mx-auto h-full flex flex-col">

            {messages.length === 0 ? (
              // Empty state: uses flex-1 to center vertically in the h-full container
              <div className="flex-1 flex flex-col items-center justify-center text-gray-800 gap-4 px-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Brain size={32} className="text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-center">Hey, what can I help you with today?</h2>
                <p className="text-gray-500 text-center">Upload a document to get started.</p>
              </div>
            ) : (
              // Messages: Use flex-1 and justify-end to ensure messages stick to the bottom
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
                          ? "bg-blue-600 text-white order-1 rounded-br-none" // User bubble style
                          : "bg-white text-gray-800 border border-gray-200 order-2 rounded-tl-none" // AI bubble style
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

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex-shrink-0">
          <div className="max-w-4xl w-full mx-auto flex items-end gap-2">
            {/* File Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 md:p-3 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <Paperclip size={20} className="md:size-6" />
            </button>
            {/* Input Textarea */}
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Ask Questions from your uploaded content..."
              className="flex-1 p-3 text-gray-800 resize-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-xl transition-all duration-200 max-h-[150px] overflow-y-auto"
              rows={1}
            />
            {/* Send Button */}
            <button
              type="submit"
              onClick={handleSend}
              disabled={!currentInput.trim()}
              className="p-2 md:p-3 text-white bg-blue-600 rounded-xl disabled:bg-gray-400 hover:bg-blue-700 transition-colors flex-shrink-0 shadow-lg"
            >
              <Send size={20} className="md:size-5" />
            </button>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
    </div>
  );
}