import { useState, useEffect } from "react";
import { Card, Button, ListGroup, Spinner, Container, Row, Col, Badge, Alert } from "react-bootstrap";
import "../server.css";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../components/axios";

function ChatGroups() {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUsername,setCurrentUser]=useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/chats/UserChat-ids`, {
                    withCredentials: true
                });
                const userData= await axiosInstance.get(`/profile`);
                const currentUser=userData.data.user.username;
                setCurrentUser(currentUser);
                // If you want to fetch additional chat details, you can do it here
                // For now, we'll work with the chat IDs you're getting
                const chatData = res.data?.chats || [];
                const enhancedChats = chatData.map((chat) => {
                    const otherUsername = chat.user1_username === currentUser
                        ? chat.user2_username
                        : chat.user1_username;

                    return {
                        id: chat.chat_id,
                        title: `${otherUsername}`,
                        otherUsername,
                        lastMessage: "Click to view messages...",
                        timestamp: new Date().toLocaleDateString(),
                        unreadCount: Math.floor(Math.random() * 5),
                        isOnline: Math.random() > 0.5
                    };
                });
                
                setChats(enhancedChats);
            } catch (err) {
                console.error("Failed to load chats", err);
                setError("Failed to load your chats. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchChats();
    }, []);

    const handleChatClick = (chatId,otherUsername) => {
        // Navigate to the specific chat
        navigate(`/chat/${chatId}/${otherUsername}`);
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading your chats...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    {error}
                    <div className="mt-2">
                        <Button variant="outline-danger" size="sm" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
    <Container className="mt-4">
        <Row>
            <Col md={12} lg={10} xl={8} className="mx-auto">
                <Card className="shadow-sm">
                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">
                            <i className="fas fa-comments me-2"></i>
                            Your Chats
                        </h4>
                    </Card.Header>
                    
                    <Card.Body className="p-0">
                        {chats.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">No chats yet</h5>
                            </div>
                        ) : (
                            <ListGroup variant="flush">
                                {chats.map((chat) => (
                                    <ListGroup.Item 
                                        key={chat.id}
                                        className="chat-item border-0 border-bottom p-3"
                                        action
                                        onClick={() => handleChatClick(chat.id, chat.otherUsername)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="position-relative me-3">
                                                <div 
                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#007bff',
                                                        color: 'white',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {chat.title.charAt(0)}
                                                </div>
                                                {chat.isOnline && (
                                                    <div 
                                                        className="position-absolute rounded-circle"
                                                        style={{
                                                            width: '12px',
                                                            height: '12px',
                                                            backgroundColor: '#28a745',
                                                            border: '2px solid white',
                                                            bottom: '0',
                                                            right: '0'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0 fw-bold text-dark">
                                                        {chat.title}
                                                    </h6>
                                                    <small className="text-muted">
                                                        {chat.timestamp}
                                                    </small>
                                                </div>
                                                <p className="mb-0 text-muted small">
                                                    {chat.lastMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Card.Body>
                    
                    {chats.length > 0 && (
                        <Card.Footer className="text-center bg-light py-2">
                            <small className="text-muted">
                                Showing {chats.length} chat{chats.length !== 1 ? 's' : ''}
                            </small>
                        </Card.Footer>
                    )}
                </Card>
            </Col>
        </Row>
    </Container>
);
}

export default ChatGroups;