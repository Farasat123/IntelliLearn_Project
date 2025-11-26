// src/hooks/useChatHistory.js
import { useEffect, useState } from "react";

/**
 * Simple hook to persist chat history in localStorage
 * shape: [{ id, title, messages: [{role:'user'|'assistant', text, time}] }]
 */
export default function useChatHistory(storageKey = "intellilearn_chat_history") {
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch {}
  }, [history, storageKey]);

  function createConversation(title = "New Conversation") {
    const conv = {
      id: Date.now().toString(),
      title,
      messages: [],
      updatedAt: Date.now(),
    };
    setHistory((h) => [conv, ...h]);
    return conv;
  }

  function appendMessage(conversationId, message) {
    setHistory((h) =>
      h.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() } : c
      )
    );
  }

  function deleteConversation(conversationId) {
    setHistory((h) => h.filter((c) => c.id !== conversationId));
  }

  function updateTitle(conversationId, title) {
    setHistory((h) => h.map((c) => (c.id === conversationId ? { ...c, title } : c)));
  }

  function clearAll() {
    setHistory([]);
  }

  return {
    history,
    setHistory,
    createConversation,
    appendMessage,
    deleteConversation,
    updateTitle,
    clearAll,
  };
}
