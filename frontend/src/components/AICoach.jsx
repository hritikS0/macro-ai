import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, User, Bot, RefreshCw, ChevronRight, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { cn } from '../utils/cn';

const AICoach = ({ activePlanId, onAction }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, [activePlanId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/diet/chat/history');
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch chat history');
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/diet/chat', { message: input });
      setMessages(prev => [...prev, response.data]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Apologies, I encountered a connection issue.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Chat Header */}
      <div className="p-6 border-b flex items-center justify-between bg-card/80 backdrop-blur-md sticky top-0 z-10 border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text">BioCoach AI</h3>
            <p className="text-[10px] font-bold text-accent uppercase tracking-tighter">Live Support</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 mt-10">
            <div className="p-4 bg-muted rounded-full mb-4 text-text-secondary">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">How can I assist your protocol today?</p>
          </div>
        )}
        
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex flex-col gap-2",
              m.role === 'user' ? "items-end" : "items-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm border",
              m.role === 'user' 
                ? "bg-primary text-white border-transparent rounded-tr-none" 
                : "bg-muted text-text border-border rounded-tl-none"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-start gap-2">
            <div className="bg-muted p-3 rounded-2xl rounded-tl-none border border-border">
               <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-6 border-t bg-card/80 backdrop-blur-md border-border">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="input pr-12"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary disabled:opacity-50 transition-all hover:scale-110"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default AICoach;
