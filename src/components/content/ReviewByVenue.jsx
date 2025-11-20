/* TODO
- search bar (hw4)
- search button (once hit, shows average rating of the venue if reviews exist)
- default displays 10 most recent band reviews
- After search display:
    - venue name
    - average rating
    - paginate reviews on venue (10 per page)
*/

import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import MessageCard from "./MessageCard";
import { useNavigate } from "react-router-dom";

import {
  getRecentReviews,
  getReviewsForVenue,
  deleteReview,
} from "../../firebase/firebaseHelper";

export default function ReviewByVenue() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    async function load() {
      const recent = await getRecentReviews(10);
      setReviews(recent.filter((r) => r.venueName)); // venue-only
    }
    load();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const results = await getReviewsForVenue(searchTerm);
    setReviews(results);

    if (results.length > 0) {
      const avg =
        results.reduce((acc, r) => acc + (r.rating || 0), 0) / results.length;
      setAvgRating(avg.toFixed(2));
    } else {
      setAvgRating(null);
    }

    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / postsPerPage);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Venue Reviews</h1>
      <Button
        variant="success"
        onClick={() => navigate("/ReviewPage")}
        className="mb-3"
      >
        Write a Review
      </Button>

      <p>Search for venues below!</p>
      <hr />

      <Form>
        <Form.Label htmlFor="searchVenueName">Venue name</Form.Label>
        <Form.Control
          id="searchVenueName"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <br />
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Form>

      {avgRating && (
        <h3 style={{ marginTop: "1rem" }}>
          Average Rating for "{searchTerm}": {avgRating}
        </h3>
      )}

      <Container fluid>
        <Row>
          {currentReviews.map((r) => (
            <Col md={4} key={r.id}>
              <MessageCard
                id={r.id}
                title={r.title}
                content={r.content}
                poster={r.poster}
                created={r.created}
                delete={() => handleDelete(r.id)}
              />
            </Col>
          ))}
        </Row>
      </Container>

      {totalPages > 1 && (
        <Pagination className="mt-3">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
}
