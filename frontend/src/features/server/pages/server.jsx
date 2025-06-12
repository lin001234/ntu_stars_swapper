import { useState, useEffect, useRef } from "react";
import { Card, Form, Button, ListGroup, Spinner, Container, Row, Col, Badge } from "react-bootstrap";
import "../server.css";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../components/axios";

function Chat() {
  const { chatId,postOwnerUsername } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages on load
  useEffect(() => {
    const fetchMessages = async () => {
      if(!chatId){
        console.warn("chatId is undefined");
        return;
      }
      try {
        const res = await axiosInstance.get(`/chats/${chatId}`,
          {
            withCredentials:true
          }
        );
        setMessages(res.data?.messages || []);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await axiosInstance.post(`/chats/${chatId}`,
        { content: input },
        { withCredentials: true }
      );
      // Optionally append the new message to chat view:
      setMessages((prev) => [...prev, res.data.message]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
      const date = formatDate(msg.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

    // Send icon component
  const SendIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m22 2-7 20-4-9-9-4zm0 0-10 10"/>
    </svg>
  );

  // Close icon component  
  const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 6-12 12M6 6l12 12"/>
    </svg>
  );

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="avatar">💬</div>
            <div className="header-info">
              <h3 className="header-title">{postOwnerUsername}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ color: '#6b7280', margin: 0 }}>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p className="empty-text">No messages yet</p>
            <p className="empty-subtext">
              Start the conversation by sending a message below
            </p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date} className="message-group">
              <div className="date-separator">
                <div className="date-badge">{date}</div>
              </div>
              {msgs.map((message, index) => (
                <div
                  key={index}
                  ref={
                    date ===
                    Object.keys(messageGroups)[Object.keys(messageGroups).length - 1] &&
                    index === msgs.length - 1
                      ? messagesEndRef
                      : null
                  }
                >
                  {message.system ? (
                    <div className="system-message">
                      <div className="system-badge">{message.content}</div>
                    </div>
                  ) : (
                    <div className="message-container">
                      <div className="message-avatar">
                        {message.sender_username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <span className="sender-name">
                            {message.sender_username || 'Unknown User'}
                          </span>
                          <span className="message-time">
                            {formatMessageTime(message.created_at)}
                          </span>
                        </div>
                        <div className="message-bubble">{message.content}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="input-container">
        <form onSubmit={sendMessage} className="input-form">
          <input
            type="text"
            className={`message-input ${input ? 'focus' : ''}`}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className={`send-button ${!input.trim() || loading ? 'disabled' : ''}`}
            disabled={!input.trim() || loading}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
