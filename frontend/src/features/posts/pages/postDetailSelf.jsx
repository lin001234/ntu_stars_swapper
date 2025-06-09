import { useState, useEffect } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostDetailSelf(){
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

    const handleUpdate = async(e) =>{
        e.preventDefault();
        try{
            const response = await axios.put(`http://localhost:3000/api/posts/${id}`,{
                course_id,
                context,
                tag,
                index_id,
                index_exchange_id
            },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation' // This tells PostgREST to return the updated row
                }
            });
            // Handle the response based on your API's actual response structure
            const updatedPost = response.data.post || response.data; // Try both formats

            setPost(updatedPost);
            setIsEditing(false);
            setError(null); // Clear any previous errors 
        } catch(err){
            setError(err.response?.data?.error || err.message || "An unexpected error occurred");
            console.error('Update error:', err);
        }
    };

    const handleDelete = async() =>{
        if (window.confirm('Are you sure you want to delete this post?')){
            try{
                await axios.delete(`http://localhost:3000/api/posts/${id}`,{
                    withCredentials: true
                });
                navigate('/home');
            } catch (err){
                setError(err.response?.data?.error || err.message || "An unexpected error occurred");
                console.error('Update error:', err);;
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="container mt-4">
            <Card className="shadow">
                <Card.Body>
                    {isEditing ? (
                        <>
                            <Card.Title className="mb-4">Edit Post</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={course_id}
                                        onChange={(e) => setCourse_id(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Tag</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={tag}
                                        onChange={(e) => setTag(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Index ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={index_id}
                                        onChange={(e) => setIndex_id(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Index Exchange ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={index_exchange_id}
                                        onChange={(e) => setIndex_exchange_id(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between">
                                    <Button variant="success" type="submit">
                                        Save Changes
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title>{post.title || "Post Details"}</Card.Title>
                                <div>
                                    <Button 
                                        variant="outline-primary" 
                                        className="me-2"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outline-danger"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Card.Subtitle className="mb-2 text-muted">
                                Course ID: {post.course_id}
                            </Card.Subtitle>

                            <Card.Text className="mt-3 mb-3">
                                {post.context}
                            </Card.Text>

                            <div className="text-muted small">
                                {post.tag && <span className="me-3">Tag: {post.tag}</span>}
                                {post.index_id && <span className="me-3">Index ID: {post.index_id}</span>}
                                {post.index_exchange_id && <span>Exchange ID: {post.index_exchange_id}</span>}
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}
export default PostDetailSelf;