import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

export default function AIAssistant() {
  const { user } = useUserStore();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I'm your PrithviNet assistant. I have access to your satellite imagery, terrain models, and IoT sensor networks. How can I help you with your geospatial data today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = {
        role: 'ai',
        content: data.reply,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        content: "I'm having trouble connecting to my brain modules. Please check if the local AI server is running." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 space-y-8 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
              msg.role === 'ai' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-slate-200 dark:bg-primary/20 border-slate-300 dark:border-primary/10 overflow-hidden'
            }`}>
              {msg.role === 'ai' ? (
                <span className="material-symbols-outlined text-sm">robot_2</span>
              ) : (
                <img
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCg5ZF5U33Kx7ribuzFhzI-600z5JT2AHII4hHXUWK7m3qoCmcqjDOlUVByAGrRBnlVBCE2XX5H32xDEb0nia9sos7UcUNcumMeexIRs5cFKbaIB5zWJv03YRxTL1TuNnwc1KWnel7yJZT6ndEhN6DozWb_O9z4Y45VfcmHtShUpLYTxIjQHrnfOKTYnclRUHw0ms51rQkFJ1QuCusQTsxTOoZ7EYURh_7tCrlem3SnRO2NWes0bfvv9TKTjqIukgr2HmJabThPKYk"}
                />
              )}
            </div>
            <div className={`space-y-2 flex flex-col ${msg.role === 'user' ? 'items-end' : ''}`}>
              <p className={`text-xs font-medium text-slate-500 dark:text-primary/60 uppercase tracking-wider ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                {msg.role === 'ai' ? 'Prithvi AI' : user?.name || 'Operator'}
              </p>
              <div className={`p-4 rounded-xl shadow-sm max-w-xl ${
                msg.role === 'ai' 
                  ? 'bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-tl-none' 
                  : 'bg-primary text-background-dark rounded-tr-none shadow-md'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-4 animate-in fade-in duration-300">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-sm">robot_2</span>
            </div>
            <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 p-4 rounded-xl rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Interface */}
      <div className="p-6 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md border-t border-slate-200 dark:border-primary/10">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* Suggested Prompts */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['Generate detailed breakdown', 'Export raw CSV data', 'Compare with last year'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                disabled={loading}
                className="text-xs font-medium px-4 py-2 rounded-full border border-slate-200 dark:border-primary/20 hover:border-primary hover:bg-primary/5 text-slate-600 dark:text-slate-400 hover:text-primary transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
          {/* Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative group"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 dark:text-primary/40 group-focus-within:text-primary transition-colors">auto_awesome</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="w-full bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl py-4 pl-12 pr-24 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm text-slate-900 dark:text-slate-100 disabled:opacity-50"
              placeholder="Ask Prithvi about your geospatial assets..."
            />
            <div className="absolute inset-y-2 right-2 flex items-center gap-2">
              <button type="button" className="p-2 hover:bg-slate-100 dark:hover:bg-primary/10 rounded-lg text-slate-400 dark:text-primary/40 transition-all">
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-background-dark rounded-lg px-4 h-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
              >
                <span className="text-xs font-bold uppercase tracking-wider">
                  {loading ? '...' : 'Send'}
                </span>
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </form>
          {/* Status Footer */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-primary/40 uppercase tracking-widest">System Ready • Model v4.2-Geo</span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-primary/40">
              Prithvi AI can make mistakes. Verify important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
