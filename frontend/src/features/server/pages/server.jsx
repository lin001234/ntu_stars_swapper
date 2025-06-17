import { useState, useEffect, useRef } from "react";
//import { Card, Form, Button, ListGroup, Spinner, Container, Row, Col, Badge } from "react-bootstrap";
import "../server.css";
import { useParams,useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../components/axios";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";

function Chat() {
  const { chatId,postOwnerUsername } = useParams();
  //const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  //const [loading, setLoading] = useState(true);
  const{
    messages,
    setSelectedId,
    getMessages,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
    isMessageLoading,
  } = useChatStore();

  const{socket} = useAuthStore();
  const socketRef = useRef(socket);

  useEffect(() =>{
    socketRef.current=socket;
  }, [chatId, socket]);

  // Function to mark messages as read
  const markMessagesAsRead = async () => {
    if (!chatId || !socketRef.current){
      console.warn("Cannot mark messages as read: socket/chatId not ready");
      return;
    }
    try {
      // Mark as read in backend database
      await axiosInstance.post('/chats/mark-read', 
        { chatId }, 
        { withCredentials: true }
      );
      
      // Emit socket event to update real-time UI
      socketRef.current.emit("markMessagesRead", { chatId });
      
      console.log(`Messages marked as read for chat: ${chatId}`);
    } catch (err) {
      console.error("Failed to mark messages as read", err);
    }
  };

  // clear selectedUser when component is unmounted
  useEffect(() =>{
    return() =>{
      setSelectedId(null);
      unsubscribeFromMessages();
      markMessagesAsRead();
    }
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages on load
  useEffect(() => {
    const fetchAndSub=async()=>{
      if(!chatId) return;

      setSelectedId(chatId);
      await getMessages();
      subscribeToMessages();

      setTimeout(() => {
        markMessagesAsRead();
      }, 500);
    };

    fetchAndSub();
  },[chatId]);

  // Mark as read when user scrolls to bottom or interacts with chat
  useEffect(() => {
    const handleUserInteraction = () => {
      markMessagesAsRead();
    };

    // Mark as read when user clicks anywhere in the messages container
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.addEventListener('click', handleUserInteraction);
      
      return () => {
        messagesContainer.removeEventListener('click', handleUserInteraction);
      };
    }
  }, [chatId, socket]);

  const HandleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({content:input});
    setInput("")
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
  const groupMessagesByDate = (msgs = []) => {
    const groups = {};
    msgs.forEach((msg) => {
      const date = formatDate(msg.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages|| []);

    // Send icon component
  const SendIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m22 2-7 20-4-9-9-4zm0 0-10 10"/>
    </svg>
  );

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-header-left">
            <button className="back-button" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="chat-avatar">💬</div>
            <div className="chat-header-info">
              <h3 className="chat-header-title">{postOwnerUsername}</h3>
              <p className="chat-header-subtitle">Active now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {isMessageLoading  ? (
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
                    /* Maybe change if it works
                    date === Object.keys(messageGroups).slice(-1)[0] &&
                    index === msgs.length - 1*/
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
        <form onSubmit={HandleSendMessage} className="input-form">
          <input
            type="text"
            className="message-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isMessageLoading}
            ref={inputRef}
          />
          <button
            type="submit"
            className={`send-button ${!input.trim() || isMessageLoading ? 'disabled' : ''}`}
            disabled={!input.trim() || isMessageLoading}
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
