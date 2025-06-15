import React, { useState, useEffect, useRef, type KeyboardEvent, type ChangeEvent } from 'react';
import './ChatBot.css';
import { useAuthStore } from '../store/authStore';
import { usePersonalStore } from '../store/personalStore';

type ChatMessage = {
  role: 'user' | 'trainer';
  content: string;
  timestamp?: string;
};

type ChatSession = {
  id: string;
  timestamp: string;
  messages: ChatMessage[];
};

type CategorizedHistory = {
  today: ChatSession[];
  week: ChatSession[];
  month: ChatSession[];
  older: ChatSession[];
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyView, setHistoryView] = useState(false);
  const [history, setHistory] = useState<CategorizedHistory | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuthStore();
  const { personalData } = usePersonalStore();
  const userId = user?.id?.toString();
  const personality = personalData?.chatPersonality || 'friendly';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNewChat = () => {
    setMessages([
      { role: 'trainer', content: 'שלום כאן המאמן שלך, איך אפשר לעזור היום?' }
    ]);
    setHistoryView(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

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
          UserId: userId
        })
      });

      const data = await response.json();
      const replyMessage: ChatMessage = {
        role: 'trainer',
        content: data.answer || 'מצטער, לא הצלחתי לקלוט את בקשתך.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, replyMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'trainer',
        content: 'תקלה בשרת. נסה שוב מאוחר יותר.'
      }]);
    }

    setLoading(false);
  };

  const loadHistory = async () => {
    if (!userId) return;
    setHistoryView(true);

    try {
      const response = await fetch(`http://localhost:5181/api/PersonalTrainer/history/${userId}`);
      const rawHistory: ChatMessage[] = await response.json();

      const sessions: ChatSession[] = [];
      let current: ChatSession | null = null;

      rawHistory.forEach((msg, idx) => {
        const ts = msg.timestamp ? new Date(msg.timestamp) : new Date();
        const id = `s${idx}`;

        const lastTimestamp = current?.messages.length
          ? current.messages[current.messages.length - 1]?.timestamp
          : null;

        const timeDiff =
          lastTimestamp && new Date(lastTimestamp)
            ? ts.getTime() - new Date(lastTimestamp).getTime()
            : Infinity;

        if (!current || timeDiff > 60 * 60 * 1000) {
          current = { id, timestamp: ts.toISOString(), messages: [] };
          sessions.push(current);
        }

        current.messages.push(msg);
      });

      const categorized = categorizeSessions(sessions);
      const isEmpty =
        categorized.today.length === 0 &&
        categorized.week.length === 0 &&
        categorized.month.length === 0 &&
        categorized.older.length === 0;

      if (isEmpty) {
        setMessages([
          { role: 'trainer', content: 'אין לך היסטוריית שיחות. ברוך הבא! 😊' }
        ]);
        setHistoryView(false);
      } else {
        setHistory(categorized);
      }

    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };


  const categorizeSessions = (sessions: ChatSession[]): CategorizedHistory => {
    const now = new Date();
    const result: CategorizedHistory = {
      today: [],
      week: [],
      month: [],
      older: []
    };

    sessions.forEach(session => {
      const time = new Date(session.timestamp);
      const diffDays = Math.floor((+now - +time) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) result.today.push(session);
      else if (diffDays <= 7) result.week.push(session);
      else if (diffDays <= 30) result.month.push(session);
      else result.older.push(session);
    });

    return result;
  };

  const renderSessionPreview = (session: ChatSession) => {
    const preview = session.messages.find(m => m.role === 'user')?.content || '';
    return (
      <div
        key={session.id}
        className="chat-preview"
        onClick={() => {
          setMessages(session.messages);
          setHistoryView(false);
        }}
      >
        <strong>●</strong> {preview.slice(0, 50)}...
      </div>
    );
  };

  if (!personalData) {
    return (
      <div className="chat-container">
        <div className="chat-message trainer">
          👋 כאן המאמן האישי שלך.
          <br />
          כדי להתחיל בשיחה, יש להיכנס <strong>לאזור האישי</strong>.
        </div>
      </div>
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="chat-container">
      <div className="chat-controls">
        <button onClick={loadHistory} className="chat-control-button">היסטוריית שיחות</button>
        <button onClick={startNewChat} className="chat-control-button">שיחה חדשה</button>
      </div>

      {historyView && history ? (
        <div className="chat-history-view">
          {Object.entries(history).map(([section, sessions]) => (
            sessions.length > 0 && (
              <div key={section} className="chat-history-section">
                <h4>
                  {{
                    today: 'היום',
                    week: 'השבוע האחרון',
                    month: 'החודש האחרון',
                    older: 'ישן יותר'
                  }[section as keyof CategorizedHistory]}
                </h4>
                {sessions.map(renderSessionPreview)}
              </div>
            )
          ))}
        </div>
      ) : (
        <>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div>{msg.content}</div>
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
              placeholder="הקלד כאן..."
            />
            <button onClick={handleSend} disabled={loading} className="chat-send-button">
              {loading ? '...' : 'שלח'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;
