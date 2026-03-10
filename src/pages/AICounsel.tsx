import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AICounsel({ user }: { user: any }) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: `Hello ${user?.name || 'there'}! I'm your AI Health Counselor. How can I help you today? Whether you have questions about wellness, symptoms, or general health information, I'm here to provide guidance.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await geminiService.chat(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        role: 'model', 
        text: `Chat cleared. How else can I assist you today, ${user?.name || 'friend'}?` 
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <MessageSquare className="text-white" size={24} />
            </div>
            AI Health Counsel
          </h1>
          <p className="text-slate-500 font-medium mt-1">Empathetic guidance for your wellness journey.</p>
        </div>
        <button 
          onClick={clearChat}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors"
        >
          <RefreshCw size={16} />
          Clear Chat
        </button>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
        <p className="text-xs text-red-700 font-medium leading-relaxed">
          <strong>Disclaimer:</strong> This AI counselor provides health information for educational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-4",
                message.role === 'user' ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                message.role === 'user' ? "bg-indigo-600 text-white" : "bg-slate-100 text-indigo-600"
              )}>
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                message.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
              )}>
                <div className="markdown-body">
                  <Markdown>{message.text}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                <Loader2 className="animate-spin text-indigo-600" size={18} />
                <span className="text-sm text-slate-500 font-medium">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your health or wellness..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                <Sparkles size={18} />
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-indigo-600 text-white p-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500" /> Secure Chat</span>
            <span className="flex items-center gap-1"><Sparkles size={12} className="text-indigo-400" /> Powered by Gemini AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
