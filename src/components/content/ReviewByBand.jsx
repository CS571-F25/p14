import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import ReviewCard from "./ReviewCard";
import { useNavigate } from "react-router-dom";

import {
  getRecentReviews,
  getReviewsForBand,
  deleteReview,
} from "../../firebase/firebaseHelper";

export default function ReviewByBand() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Load 10 most recent on mount
  useEffect(() => {
    async function load() {
      const recent = await getRecentReviews(10);
      // filter for band reviews (documents that have bandName)
      setReviews(recent.filter((r) => r.bandName));
    }
    load();
  }, []);

  // Handle searching for band
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const results = await getReviewsForBand(searchTerm);
    setReviews(results);

    // calculate average rating
    if (results.length > 0) {
      const avg =
        results.reduce((acc, r) => acc + (r.rating || 0), 0) / results.length;
      setAvgRating(avg.toFixed(2));
    } else {
      setAvgRating(null);
    }

    setCurrentPage(1);
  };

  // Handle deleting a review
  const handleDelete = async (id) => {
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Pagination logic
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / postsPerPage);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Band Reviews</h1>

      <Button
        variant="success"
        onClick={() => navigate("/ReviewPage")}
        className="mb-3"
      >
        Write a Review
      </Button>

      <p>Search for bands below!</p>
      <hr />

      {/* Search Input */}
      <Form>
        <Form.Label htmlFor="searchBandName">Band name</Form.Label>
        <Form.Control
          id="searchBandName"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <br />
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Form>

      {/* Average rating */}
      {avgRating && (
        <h3 style={{ marginTop: "1rem" }}>
          Average Rating for "{searchTerm}": {avgRating}
        </h3>
      )}

      {/* Reviews List */}
      <Container fluid>
        <Row>
          {currentReviews.map((r) => (
            <Col md={4} key={r.id}>
              <ReviewCard
                id={r.id}
                title={r.title}
                content={r.content}
                poster={r.poster}
                created={r.created}
                rating={r.rating}
                userUid={r.userUid}
                onDelete={() => handleDelete(r.id)}
              />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Pagination */}
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
