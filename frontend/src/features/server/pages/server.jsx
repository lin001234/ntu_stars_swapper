import { useState, useEffect, useRef } from "react";
import { Card, Form, Button, ListGroup, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../components/axios";

function Chat() {
  const { chatId } = useParams();
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

  return (
    <Card className="p-3">
      <h5>Chat Room</h5>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <ListGroup className="mb-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {messages.map((msg, i) => (
              <ListGroup.Item key={i} variant={msg.system ? "secondary" : "light"}>
                {msg.system ? (
                  <em>{msg.content}</em>
                ) : (
                  <div>
                    <strong>{msg.sender_username}</strong>: {msg.content}
                    <div className="text-muted small">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </ListGroup.Item>
            ))}
            <div ref={messagesEndRef} />
          </ListGroup>

          <Form onSubmit={sendMessage}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Send
            </Button>
          </Form>
        </>
      )}
    </Card>
  );
}

export default Chat;
