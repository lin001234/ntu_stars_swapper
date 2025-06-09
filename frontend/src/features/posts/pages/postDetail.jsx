import { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Badge} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostDetail(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [course_id, setCourse_id] = useState('');
    const [context, setContext] =useState('');
    const [tag, setTag] =useState('');
    const [index_id, setIndex_id] =useState('');
    const [index_exchange_id, setIndex_exchange_id] =useState('');

    useEffect(() =>{
        const fetchPost = async () =>{
            try{
                const response = await axios.get(`http://localhost:3000/api/posts/${id}`);
                setPost(response.data.id_post);
                setCourse_id(response.data.id_post.course_id);
                setContext(response.data.id_post.context);
                setTag(response.data.id_post.tag);
                setIndex_id(response.data.id_post.index_id);
                setIndex_exchange_id(response.data.id_post.index_exchange_id);
                setLoading(false);
            } catch(err){
                setError(err.response?.data?.error || err.message || "An unexpected error occurred");
                console.error('Update error:', err);
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="container mt-4">
            <Card className="shadow">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Card.Title>{post.title || "Post Details"}</Card.Title>
                    </div>

                    <Card.Subtitle className="mb-2 text-muted">
                        Course ID: {post.course_id}
                    </Card.Subtitle>

                    <Card.Text className="mt-3 mb-3">
                        {post.context}
                    </Card.Text>

                    <div className="text-muted small">
                        {post.tag && <span className="me-3">Tag: {post.tag}</span>}
                        {post.index_id && <span className="me-3">Index ID: {post.index_id}</span>}
                        {post.index_exchange_id && Array.isArray(post.index_exchange_id) && post.index_exchange_id.length > 0 && (
                            <div className="mt-2">
                                <span>Exchange IDs: </span>
                                {post.index_exchange_id.map((id, index) => (
                                    <Badge key={index} bg="info" className="me-1">
                                        {id}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
export default PostDetail;