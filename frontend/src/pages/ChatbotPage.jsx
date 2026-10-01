import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatbotApi } from '../api/chatbotApi';
import { Bot, Send, Sparkles, MessageSquare, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ChatbotPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'bot',
      text: 'Welcome to Hospitality Platform! I am your AI Concierge.\n\nI can recommend top hotels in Pune, Mumbai, Goa, Nashik, or Bangalore, explain room types, detail our zero double-booking policy, or guide you through reservations and free cancellations. What would you like to know?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated) {
      const loadHistory = async () => {
        try {
          const history = await chatbotApi.getHistory();
          if (history && history.length > 0) {
            const formatted = [];
            history.forEach((item) => {
              formatted.push({
                id: `u-${item.id}`,
                sender: 'user',
                text: item.message,
                time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
              });
              formatted.push({
                id: `b-${item.id}`,
                sender: 'bot',
                text: item.response,
                time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
              });
            });
            setMessages(formatted);
          }
        } catch (err) {
          console.error('Failed to load history', err);
        }
      };
      loadHistory();
    }
  }, [isAuthenticated]);

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const result = await chatbotApi.sendMessage(textToSend.trim());
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: result.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting to the hospitality service right now. Please try again in a moment.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'Which hotels are available in Pune?',
    'How can I book a room?',
    'How can I cancel my booking?',
    'What is the check-in process?',
    'What room types are available?',
    'How much does a Deluxe room cost?',
    'How can I contact the hotel?'
  ];

  return (
    <div style={{ padding: '2.5rem 0 5rem 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> AI-POWERED HOSPITALITY CONCIERGE
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            Ask Our Virtual Assistant
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time inquiries, city stay suggestions, room pricing, and booking policies.
          </p>
        </div>

        {/* Suggested Queries Chips */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem', borderRadius: 'var(--radius-full)', backgroundColor: '#ffffff' }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Box Container */}
        <div className="card" style={{ height: '580px', display: 'flex', flexDirection: 'column' }}>
          {/* Messages Window */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.65rem'
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={18} />
                  </div>
                )}

                <div style={{
                  maxWidth: '75%',
                  padding: '0.9rem 1.2rem',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.925rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  boxShadow: 'var(--shadow-sm)',
                  border: msg.sender === 'bot' ? '1px solid var(--border)' : 'none'
                }}>
                  {msg.text}
                  {msg.time && (
                    <div style={{
                      fontSize: '0.7rem',
                      marginTop: '0.4rem',
                      textAlign: 'right',
                      opacity: 0.7,
                      color: msg.sender === 'user' ? '#ffffff' : 'var(--text-muted)'
                    }}>
                      {msg.time}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot size={18} />
                </div>
                <div style={{
                  backgroundColor: '#ffffff',
                  padding: '0.8rem 1.2rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem'
                }}>
                  AI Concierge is looking up hospitality information...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.75rem'
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Ask anything about hotels, Pune stays, prices, or policies..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !inputMessage.trim()}
              style={{ padding: '0.65rem 1.5rem' }}
            >
              <Send size={18} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
