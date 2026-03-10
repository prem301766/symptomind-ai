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
  RefreshCw,
  X,
  Minimize2,
  Maximize2,
  Mic,
  MicOff
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useVoiceToText } from '../hooks/useVoiceToText';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatbot({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: `Hello ${user?.name || 'there'}! I'm your AI Health Assistant. How can I help you today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isRecording, toggleRecording } = useVoiceToText((transcript) => {
    setInput(prev => prev + (prev ? ' ' : '') + transcript);
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

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
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-indigo-200/50 overflow-hidden flex flex-col mb-4 transition-all duration-300",
              isMinimized ? "w-72" : "w-[400px] max-w-[calc(100vw-3rem)]"
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">AI Health Assistant</h3>
                  {!isMinimized && <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Online & Secure</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 mb-2">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={14} />
                    <p className="text-[10px] text-red-700 font-bold leading-relaxed uppercase tracking-tight">
                      Informational only. Not medical advice. Dial 112 for emergencies.
                    </p>
                  </div>

                  {messages.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex items-start gap-3",
                        message.role === 'user' ? "flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                        message.role === 'user' ? "bg-indigo-600 text-white" : "bg-slate-100 text-indigo-600"
                      )}>
                        {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={cn(
                        "max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed",
                        message.role === 'user' 
                          ? "bg-indigo-600 text-white rounded-tr-none" 
                          : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                      )}>
                        <div className="markdown-body prose prose-sm max-w-none">
                          <Markdown>{message.text}</Markdown>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <Bot size={16} />
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                        <Loader2 className="animate-spin text-indigo-600" size={14} />
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <form onSubmit={handleSend} className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isRecording ? "Listening..." : "Ask a health question..."}
                      className={cn(
                        "flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm",
                        isRecording && "border-red-400 ring-2 ring-red-100"
                      )}
                    />
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={cn(
                        "p-2.5 rounded-xl transition-all shadow-sm",
                        isRecording 
                          ? "bg-red-500 text-white animate-pulse" 
                          : "bg-white text-slate-400 hover:text-indigo-600 border border-slate-200"
                      )}
                      title={isRecording ? "Stop recording" : "Voice input"}
                    >
                      {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                    <button
                      type="submit"
                      disabled={!input.trim() || loading || isRecording}
                      className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                  <div className="mt-2 flex items-center justify-between px-1">
                    <button 
                      onClick={clearChat}
                      className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1"
                    >
                      <RefreshCw size={10} /> Clear
                    </button>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={10} /> Gemini AI
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={cn(
          "bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 rounded-2xl shadow-2xl shadow-indigo-200 flex items-center gap-3 group transition-all duration-300",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <div className="relative">
          <MessageSquare size={24} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
        </div>
        <span className="font-black text-sm tracking-tight pr-1">Health Assistant</span>
      </motion.button>
    </div>
  );
}
