import { useState, useRef, useEffect } from 'react';
import AiChatUi from '../components/AiChatUi';
import { aiService } from '../services/aiService';

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I'm your PrithviNet assistant. I have access to your satellite imagery, terrain models, and IoT sensor networks. How can I help you with your geospatial data today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.sendMessage(userMsg);
      setMessages(prev => [...prev, res]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting to the network." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
        <AiChatUi messages={messages} />
        {loading && (
          <div className="flex items-start gap-4 px-6 mb-8 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-sm">robot_2</span>
            </div>
            <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 p-4 rounded-xl rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md border-t border-slate-200 dark:border-primary/10">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {['Generate detailed breakdown', 'Export raw CSV data', 'Compare with last year'].map(p => (
              <button 
                key={p}
                onClick={() => setInput(p)}
                className="text-xs font-medium px-4 py-2 rounded-full border border-slate-200 dark:border-primary/20 hover:border-primary hover:bg-primary/5 text-slate-600 dark:text-slate-400 transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 dark:text-primary/40 group-focus-within:text-primary transition-colors">auto_awesome</span>
            </div>
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="w-full bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl py-4 pl-12 pr-24 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm text-slate-900 dark:text-slate-100" 
              placeholder="Ask Prithvi about your geospatial assets..." 
            />
            <div className="absolute inset-y-2 right-2 flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-primary/10 rounded-lg text-slate-400 transition-all">
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-background-dark rounded-lg px-4 h-full flex items-center justify-center gap-2 transition-all font-bold"
              >
                <span className="text-xs uppercase tracking-wider">Send</span>
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
