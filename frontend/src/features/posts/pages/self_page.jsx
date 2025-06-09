import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import PostCard from "../../../components/PostCard.jsx";

function Self_page() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/posts/self",
          {
            withCredentials: true,
          }
        );
        setPosts(response.data.self_posts || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch post");
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!posts || posts.length === 0) return <div>No posts found</div>;

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {posts.map((post) => (
        <Col key={post.id}>
          <PostCard post={post} />
        </Col>
      ))}
    </Row>
  );
}

export default Self_page;
