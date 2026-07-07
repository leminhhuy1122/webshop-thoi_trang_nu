import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Xin chào! Tôi là Trợ lý Thời trang AI của AURA. Bạn có cần tôi tư vấn chọn đầm dự tiệc, áo blazer hay size đồ không?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    // Thêm tin nhắn của khách hàng vào hội thoại
    const updatedMessages = [...messages, { role: 'user', text: userText } as Message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Gọi API Chat AI ở backend
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: updatedMessages.slice(0, -1) // Không gửi tin nhắn vừa tạo trong history
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([...updatedMessages, { role: 'assistant', text: data.reply }]);
      } else {
        addToast(data.message || 'Lỗi xử lý tư vấn', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Lỗi kết nối tới Trợ lý AI', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Nút bong bóng chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-black hover:bg-neutral-800 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <MessageCircle className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-black text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest">AURA AI ASSISTANT</h4>
                <p className="text-[9px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping"></span>
                  Đang hoạt động
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-black text-white' : 'bg-neutral-200 text-black/60'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bong bóng tin nhắn */}
                <div className={`rounded-2xl p-3 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white border border-black/5 text-black rounded-tl-none shadow-sm'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-neutral-200 text-black/60 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-black/5 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-black/5 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Hỏi về đầm váy, blazer, size đồ..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[#F3F2F0] rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 ring-black/10 transition-shadow"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
