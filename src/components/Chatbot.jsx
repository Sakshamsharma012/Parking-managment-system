import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! I am your AI parking assistant. 🤖 How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // If user is not logged in, don't show the chatbot
  if (!user) return null;

  const handleSend = async (text = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: text }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await api.post('/chat', { message: text });
      // Add bot response
      setMessages((prev) => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Oops! I am having trouble connecting to the server.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSend(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-slide-up transform origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-primary-600 p-4 shrink-0 flex items-center justify-between shadow-md relative overflow-hidden">
             <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
             <div className="flex items-center space-x-3 relative z-10">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-inner">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">ParkSmart AI</h3>
                  <p className="text-purple-100 text-xs flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span>
                    Online
                  </p>
                </div>
             </div>
             <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors relative z-10"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-sm mr-2 shrink-0">
                    🤖
                  </div>
                )}
                <div 
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-purple-500 to-primary-500 text-white rounded-br-sm shadow-md' 
                    : 'bg-white text-surface-800 border border-gray-100 rounded-bl-sm shadow-sm whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-sm mr-2 shrink-0">
                    🤖
                  </div>
                 <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex space-x-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions (only show if no recent user messages or as a fixed tray) */}
          <div className="px-3 py-2 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
             <button onClick={() => handleQuickQuestion('Available slots?')} className="shrink-0 text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors border border-purple-100">🔌 Available</button>
             <button onClick={() => handleQuickQuestion('Recommend a slot')} className="shrink-0 text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors border border-primary-100">✨ Recommend</button>
             <button onClick={() => handleQuickQuestion('My bookings')} className="shrink-0 text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors border border-emerald-100">📅 My Bookings</button>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center bg-gray-50 rounded-full border border-gray-200 px-2 py-1 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-400 transition-all"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-3 py-2 text-sm text-surface-800 placeholder-gray-400"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2 ml-1 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-full hover:shadow-md disabled:opacity-50 disabled:hover:shadow-none transition-all transform active:scale-95"
              >
                <svg className="w-4 h-4 translate-x-px -translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-purple-600 to-primary-600 rounded-full text-white shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center relative group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">🤖</span>
          {/* Notification ping */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      )}
    </div>
  );
}
