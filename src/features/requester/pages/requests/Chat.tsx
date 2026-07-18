import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { generateAvatarFallback } from '@/utils/avatar';

export const Chat = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isVolunteer = pathname.startsWith('/volunteer');
  const [messages, setMessages] = useState([
    { id: '1', sender_id: 'vol-123', content: "Hi! I can pick up your items in about 20 minutes. Does that work?", isMe: isVolunteer },
    { id: '2', sender_id: 'req-123', content: "Yes, that is perfect. Thank you so much!", isMe: !isVolunteer }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender_id: 'me', content: input, isMe: true }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-stone-50">
      <header className="p-4 flex items-center gap-4 bg-primary text-primary-foreground shrink-0 shadow-sm z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/20" aria-label="Go Back">
          <ArrowLeft className="w-8 h-8" />
        </button>
        <div className="flex items-center gap-3">
          <img 
            src={generateAvatarFallback(isVolunteer ? 'Community Member' : 'Volunteer')} 
            alt="Chat Partner" 
            className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" 
          />
          <div>
            <h1 className="text-xl font-bold">{isVolunteer ? 'Community Member' : 'Volunteer'}</h1>
            <p className="text-sm opacity-90">{isVolunteer ? 'Requester' : 'Verified Volunteer'}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-3xl px-5 py-4 text-xl leading-relaxed shadow-sm ${m.isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-white text-stone-800 border border-stone-100 rounded-bl-sm'}`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </main>

      <footer className="p-4 bg-white border-t border-stone-200 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <form 
          className="flex gap-3 max-w-2xl mx-auto"
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-16 px-6 text-xl rounded-full border-2 border-stone-200 focus:outline-none focus:border-primary bg-stone-50 transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-primary/90 transition-transform active:scale-95 shadow-md flex-shrink-0"
            aria-label="Send Message"
          >
            <Send className="w-7 h-7 -ml-1" />
          </button>
        </form>
      </footer>
    </div>
  );
};
