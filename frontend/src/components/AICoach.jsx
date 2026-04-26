import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, MessageSquare, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { cn } from '../utils/cn';

const AICoach = ({ activePlanId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextBefore, setNextBefore] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    fetchHistory();
  }, [activePlanId]);

  useEffect(() => {
    if (!loadingMore && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchHistory = async () => {
    try {
      setHasMore(true);
      setNextBefore(null);
      const response = await api.get('/diet/chat/history', { params: { limit: 20 } });
      const initialMessages = response.data?.messages || [];
      setMessages(initialMessages);
      setNextBefore(response.data?.nextBefore || null);
      setHasMore(initialMessages.length > 0);
    } catch (err) {
      console.error('Failed to fetch chat history');
    }
  };

  const loadOlder = async () => {
    if (!hasMore || loadingMore || fetchingRef.current) return;
    if (!nextBefore) return;
    fetchingRef.current = true;
    setLoadingMore(true);
    try {
      const el = scrollRef.current;
      const prevScrollHeight = el?.scrollHeight || 0;
      const prevScrollTop = el?.scrollTop || 0;
      const response = await api.get('/diet/chat/history', { params: { limit: 20, before: nextBefore } });
      const older = response.data?.messages || [];
      if (older.length === 0) {
        setHasMore(false);
        return;
      }
      setMessages(prev => [...older, ...prev]);
      setNextBefore(response.data?.nextBefore || null);
      requestAnimationFrame(() => {
        const nextScrollHeight = el?.scrollHeight || 0;
        if (el) el.scrollTop = (nextScrollHeight - prevScrollHeight) + prevScrollTop;
      });
    } catch (err) {
      // silent
    } finally {
      fetchingRef.current = false;
      setLoadingMore(false);
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop < 40) loadOlder();
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
    <div className="h-full flex flex-col bg-card min-h-0">
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
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar min-h-0" ref={scrollRef} onScroll={handleScroll}>
        {(hasMore && nextBefore) && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={loadOlder}
              disabled={loadingMore}
              className="text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text transition-colors flex items-center gap-1"
            >
              <ChevronDown className="w-3 h-3 rotate-180" />
              {loadingMore ? 'Loading…' : 'Load older'}
            </button>
          </div>
        )}
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
      <div className="p-6 border-t bg-card/80 backdrop-blur-md border-border sticky bottom-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <form onSubmit={handleSendMessage} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="input pr-12 resize-none leading-6 py-3 min-h-[44px] max-h-32 overflow-y-auto"
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
