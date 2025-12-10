import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

import {
  addReview,
  getReviewsByUser,
  deleteReview,
  updateReview,
} from "../../firebase/firebaseHelper";

import ReviewCard from "./ReviewCard";

export default function ReviewPage() {
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();

  const [reviewType, setReviewType] = useState("band");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [myReviews, setMyReviews] = useState([]);

  // Load this user's reviews
  useEffect(() => {
    if (!userLoggedIn || !currentUser) return;

    async function load() {
      const reviews = await getReviewsByUser(currentUser.uid);
      setMyReviews(reviews);
    }
    load();
  }, [userLoggedIn, currentUser]);

  if (!userLoggedIn) {
    return (
      <div className="page-container" style={{ textAlign: "center" }}>
        <Alert variant="warning">
          <h4>Please log in to write a review</h4>
          <Button variant="primary" onClick={() => navigate("/UserLogin")}>
            Go to Login
          </Button>
        </Alert>
      </div>
    );
  }

  const clearForm = () => {
    setName("");
    setContent("");
    setRating(0);
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    if (!name.trim() || !content.trim() || rating === 0) {
      setError("Please fill out all fields and choose a rating.");
      return;
    }

    try {
      await addReview({
        bandName: reviewType === "band" ? name : null,
        venueName: reviewType === "venue" ? name : null,
        title: `${reviewType === "band" ? "Band" : "Venue"} Review`,
        content,
        rating,
        poster: currentUser?.email || "Anonymous",
      });

      // Clear form FIRST so it doesn’t erase the success message
      clearForm();

      // Now show success alert
      setSuccessMsg("Review submitted successfully!");

      // Auto-hide after 3s
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);

      // Reload user's reviews
      const updated = await getReviewsByUser(currentUser.uid);
      setMyReviews(updated);

    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting your review.");
    }
  };

  const handleDelete = async (id) => {
    await deleteReview(id);
    setMyReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdate = async (id, updates) => {
    await updateReview(id, updates);
    setMyReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  return (
    <div className="page-container">
      {/* ⭐ FORM CARD */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          background: "white",
          marginBottom: "2rem",
        }}
      >
        <h1>Write Your Review</h1>
        <hr />

        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Review Type Toggle */}
        <div className="mb-3">
          <Button
            variant={reviewType === "band" ? "primary" : "outline-primary"}
            onClick={() => setReviewType("band")}
            style={{ marginRight: "0.5rem" }}
          >
            Band
          </Button>
          <Button
            variant={reviewType === "venue" ? "primary" : "outline-primary"}
            onClick={() => setReviewType("venue")}
          >
            Venue
          </Button>
        </div>

        {/* Name Input */}
        <Form.Group className="mb-3">
          <Form.Label>
            {reviewType === "band" ? "Band Name" : "Venue Name"}
          </Form.Label>
          <Form.Control
            placeholder={`Enter ${reviewType}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        {/* Content */}
        <Form.Group className="mb-3">
          <Form.Label>Your Review</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Write your review..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>

        {/* Rating */}
        <h5>Rating</h5>
        <div className="mb-3">
          {[1, 2, 3, 4, 5].map((r) => (
            <Button
              key={r}
              variant={rating >= r ? "warning" : "outline-secondary"}
              onClick={() => setRating(r)}
              style={{ marginRight: "0.3rem" }}
            >
              ★
            </Button>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-3">
          <Button
            variant="secondary"
            onClick={clearForm}
            style={{ marginRight: "0.5rem" }}
          >
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Submit Review
          </Button>
        </div>
      </div>

      {/* ⭐ USER REVIEWS SECTION */}
      <h2>Your Reviews</h2>
      <hr />

      {myReviews.length === 0 ? (
        <Alert variant="info">You haven't written any reviews yet.</Alert>
      ) : (
        <div className="review-grid">
          {myReviews.map((review) => (
            <div className="review-card-wrapper" key={review.id}>
              <ReviewCard
                {...review}
                onDelete={() => handleDelete(review.id)}
                onUpdate={handleUpdate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
