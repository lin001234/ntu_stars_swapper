import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import PostCard from "../../../components/PostCard.jsx";

function Filtered_posts() {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    course_id: "",
    tag: "",
    index_id: "",
    index_exchange_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      for (const key in filters) {
        if (filters[key]) params[key] = filters[key];
      }

      const response = await axios.get(
        "http://localhost:3000/api/posts/filter",
        { params }
      );
      setPosts(response.data.posts || []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Filter Posts</h2>
      <Form onSubmit={handleFilter} className="mb-4">
        <Row className="g-3">
          <Col md={3}>
            <Form.Control
              type="text"
              name="course_id"
              placeholder="Course ID"
              value={filters.course_id}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              name="tag"
              placeholder="Tag"
              value={filters.tag}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              name="index_id"
              placeholder="Index ID"
              value={filters.index_id}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              name="index_exchange_id"
              placeholder="Index Exchange ID"
              value={filters.index_exchange_id}
              onChange={handleInputChange}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary">
              Filter
            </Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : posts.length === 0 ? (
        <Alert variant="info">No posts found.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {posts.map((post) => (
            <Col key={post.id}>
              <PostCard post={post} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Filtered_posts;
