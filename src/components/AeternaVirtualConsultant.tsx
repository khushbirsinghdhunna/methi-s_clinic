import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';
import { HeadingAnimator, DetailAnimator } from './AeternaBeforeAfter';

interface VirtualConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onBookClick: () => void;
}

const suggestedQuestions = [
  "What is rhinoplasty recovery like?",
  "Tell me about the deep plane facelift",
  "How does Dr. Vanita Methi approach body contouring?",
  "Am I a good candidate for breast augmentation?"
];

export default function AeternaVirtualConsultant({ isOpen, onClose, onOpen, onBookClick }: VirtualConsultantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "assistant",
      text: "Welcome to DR METHI ENT CARE AND SKIN TALKS. I am Dr. Vanita Methi's surgical consultation companion. Tell me, what aesthetic goals or procedure questions can I help you explore today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: `msg-${Date.now() + 1}`,
          sender: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `msg-err`,
        sender: "assistant",
        text: "I apologize, but I am experiencing a temporary connection issue. Please feel free to call our Park Avenue office directly at (212) 555-0100 for immediate, confidential assistance.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Widget Toggle Trigger */}
      {!isOpen && (
        <button
          id="virtual-advisor-trigger"
          onClick={onOpen}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-[#0B1426] hover:bg-[#C9A96E] text-[#ffffff] rounded-full items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group border border-[#C9A96E]/30 cursor-pointer hidden md:flex"
          aria-label="Open AI Surgery Advisor"
        >
          <span className="material-symbols-outlined text-[24px] animate-pulse">auto_awesome</span>
          
          {/* Subtle text tool tip */}
          <span className="absolute right-[110%] bg-[#0B1426] text-white font-display text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border border-[#C9A96E]/20 font-bold hidden sm:inline">
            <DetailAnimator text="AI SURGERY ADVISOR" />
          </span>
        </button>
      )}

      {/* Slide-out Sidebar Chat Console */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-[100vh] sm:h-[620px] bg-[#F8F6F2] shadow-2xl rounded-none sm:rounded-[28px] border border-[#D6D2CC] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="bg-[#0B1426] text-[#ffffff] px-6 py-5 flex items-center justify-between border-b border-[#C9A96E]/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#C9A96E]">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </div>
                <div>
                  <HeadingAnimator text="Methi Concierge" className="font-serif text-sm font-semibold tracking-wider block" />
                  <DetailAnimator text="Dr. Vanita Methi's Advisor" className="font-sans text-[10px] text-white/60 uppercase tracking-widest font-light block" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Book link */}
                <button
                  onClick={() => {
                    onBookClick();
                    onClose();
                  }}
                  className="font-display text-[10px] uppercase tracking-widest border border-[#C9A96E]/40 hover:border-[#C9A96E] px-3 py-1.5 rounded-full text-[#C9A96E] transition-colors"
                >
                  Book
                </button>
                <button 
                  onClick={onClose}
                  className="text-white/80 hover:text-white p-1"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m) => {
                const isAssistant = m.sender === 'assistant';

                return (
                  <div 
                    key={m.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`max-w-[85%] rounded-[20px] p-4 text-xs leading-relaxed font-sans shadow-sm ${
                      isAssistant 
                        ? 'bg-[#F0EDE8] text-[#0B1426] border border-[#D6D2CC]/50 rounded-tl-none' 
                        : 'bg-[#0B1426] text-white rounded-tr-none'
                    }`}>
                      <p className="whitespace-pre-line font-light">{m.text}</p>
                    </div>
                    <span className="text-[9px] text-[#4A5568]/50 uppercase tracking-widest mt-1 px-1">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="bg-[#F0EDE8] text-[#0B1426] rounded-[20px] rounded-tl-none p-4 border border-[#D6D2CC]/50 shadow-sm">
                    <div className="flex gap-1.5 items-center py-1">
                      <div className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Quick Suggestions (if conversation is initial / short) */}
            {messages.length < 5 && (
              <div className="px-6 py-2 shrink-0 border-t border-[#F0EDE8]">
                <DetailAnimator text="Suggested Concerns:" className="text-[9px] font-display tracking-widest uppercase text-[#C9A96E] font-bold mb-2 block" />
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, qidx) => (
                    <button
                      key={qidx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] font-sans text-[#0B1426] bg-[#F0EDE8] hover:bg-[#C9A96E]/20 border border-[#D6D2CC] rounded-full px-3 py-1.5 transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-4 border-t border-[#D6D2CC] bg-white flex gap-3 shrink-0 items-center">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputText);
                }}
                placeholder="Ask about procedures & recovery..."
                className="flex-1 bg-transparent border-none py-2 text-xs sm:text-sm outline-none font-sans text-[#0B1426]"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="w-9 h-9 rounded-full bg-[#0B1426] text-white flex items-center justify-center transition-all duration-300 disabled:opacity-40 hover:bg-[#C9A96E] cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>

          </div>
        )}
      </AnimatePresence>
    </>
  );
}
