import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatbotApi } from '../api/chatbotApi';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';

const ChatbotWidget = () => {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'Hello! I am your AI Hospitality Concierge. How can I help you plan your stay today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load chat history if logged in
  useEffect(() => {
    if (isAuthenticated && isOpen) {
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
          console.error('Failed to load chat history', err);
        }
      };
      loadHistory();
    }
  }, [isAuthenticated, isOpen]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || inputMessage;
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
        text: 'Sorry, I encountered a temporary connection issue. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    'Hotels in Pune?',
    'How do I cancel my booking?',
    'Check-in and check-out times?',
    'What room types are available?'
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-full)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 999,
            border: '2px solid var(--accent)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          aria-label="Open AI Concierge Chat"
        >
          <div style={{
            backgroundColor: 'var(--accent)',
            borderRadius: '50%',
            padding: '0.35rem',
            display: 'flex'
          }}>
            <Bot size={18} color="#ffffff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>AI Concierge</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>Ask anything 24/7</div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '560px',
          maxHeight: 'calc(100vh - 48px)',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          overflow: 'hidden',
          animation: 'modalEnter 0.2s ease-out'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            padding: '1rem 1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid var(--accent)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                backgroundColor: 'var(--accent)',
                borderRadius: '50%',
                padding: '0.4rem',
                display: 'flex'
              }}>
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>AI Concierge</span>
                  <Sparkles size={14} color="var(--accent)" />
                </h4>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Always active • Hospitality Assistant
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ color: '#ffffff', padding: '0.3rem', borderRadius: 'var(--radius-sm)' }}
              aria-label="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.5rem',
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Bot size={15} />
                  </div>
                )}

                <div style={{
                  maxWidth: '80%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-line',
                  backgroundColor: msg.sender === 'user' ? 'var(--accent)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  boxShadow: 'var(--shadow-sm)',
                  border: msg.sender === 'bot' ? '1px solid var(--border)' : 'none',
                }}>
                  {msg.text}
                  {msg.time && (
                    <div style={{
                      fontSize: '0.65rem',
                      marginTop: '0.35rem',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot size={15} />
                </div>
                <div style={{
                  backgroundColor: '#ffffff',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  gap: '0.3rem',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Concierge is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Prompts */}
          <div style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  fontSize: '0.725rem',
                  backgroundColor: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.875rem', padding: '0.55rem 0.8rem' }}
              placeholder="Ask about hotels, bookings, policies..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading || !inputMessage.trim()}
              style={{ padding: '0 0.85rem' }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
