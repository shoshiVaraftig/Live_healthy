import React, { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import './ChatBot.css';
import { useAuthStore } from '../store/authStore';
import { usePersonalStore } from '../store/personalStore';


type Message = {
  role: 'user' | 'trainer';
  content: string;
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'trainer', content: 'Hi! I’m your personal diet assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthStore();
  const userId = user?.id?.toString(); // ודא שזה מומר ל־string כמו בדרישת השרת
  const { personalData } = usePersonalStore();
  const personality = personalData?.chatPersonality || 'friendly';





  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5181/api/PersonalTrainer/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Input: input.trim(),
          Personality: personality,
          UserId: userId// <–– כאן את מוסיפה את ה־ID
        })
      });
      const data = await response.json();
console.log(data);
      const trainerReply = data.answer || 'מצטער, לא הצלחתי לקלוט את בקשתך אנא נסה שוב';
      setMessages(prev => [...prev, { role: 'trainer', content: trainerReply }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'trainer',
        content: 'Server error. Please try again later.'
      }]);
      console.error('Chat error:', error);
    }

    setLoading(false);
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="chat-input"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={loading} className="chat-send-button">
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
