import React, { useState, useEffect } from "react";
import { Container, Alert, Spinner, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { getReviewsByUser, deleteReview, updateReview } from "../../firebase/firebaseHelper";
import ReviewCard from "./ReviewCard";

export default function UserProfile() {
  const { currentUser, userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userLoggedIn) {
      return;
    }

    async function loadMyReviews() {
      try {
        setLoading(true);
        const reviews = await getReviewsByUser(currentUser.uid);
        setMyReviews(reviews);
      } catch (err) {
        console.error(err);
        setError("Failed to load your reviews");
      } finally {
        setLoading(false);
      }
    }

    loadMyReviews();
  }, [currentUser, userLoggedIn]);

  // Redirect to login if not authenticated
  if (!userLoggedIn) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <Alert variant="warning">
          <h4>Please log in to view your profile</h4>
          <button className="btn btn-primary" onClick={() => navigate("/UserLogin")}>
            Go to Login
          </button>
        </Alert>
      </div>
    );
  }

  const handleDelete = async (reviewId) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        setMyReviews(prev => prev.filter(r => r.id !== reviewId));
      } catch (err) {
        console.error(err);
        alert("Failed to delete review: " + err.message);
      }
    }
  };

  const handleUpdate = async (reviewId, updates) => {
    try {
      await updateReview(reviewId, updates);
      // Update local state
      setMyReviews(prev => 
        prev.map(r => r.id === reviewId ? { ...r, ...updates } : r)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update review: " + err.message);
    }
  };

  // Calculate stats
  const bandReviews = myReviews.filter(r => r.bandName);
  const venueReviews = myReviews.filter(r => r.venueName);
  const avgRating = myReviews.length > 0
    ? (myReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / myReviews.length).toFixed(1)
    : 0;

  return (
    <Container style={{ padding: "1rem", marginTop: "80px" }}>
      <h1>My Profile</h1>
      <hr />

      {/* User Info Card */}
      <Card className="mb-4" style={{ padding: "1rem" }}>
        <h3>👤 {currentUser?.displayName || currentUser?.email || "User"}</h3>
        <p className="text-muted">{currentUser?.email}</p>
        
        <Row className="mt-3">
          <Col md={3}>
            <strong>{myReviews.length}</strong>
            <div className="text-muted">Total Reviews</div>
          </Col>
          <Col md={3}>
            <strong>{bandReviews.length}</strong>
            <div className="text-muted">Band Reviews</div>
          </Col>
          <Col md={3}>
            <strong>{venueReviews.length}</strong>
            <div className="text-muted">Venue Reviews</div>
          </Col>
          <Col md={3}>
            <strong>{avgRating} ★</strong>
            <div className="text-muted">Avg Rating</div>
          </Col>
        </Row>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <h2 className="mb-3">My Reviews</h2>

      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
          <p>Loading your reviews...</p>
        </div>
      ) : myReviews.length === 0 ? (
        <Alert variant="info">
          <h4>No reviews yet!</h4>
          <p>Start by reviewing your favorite bands or venues.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/ReviewPage")}
          >
            Write Your First Review
          </button>
        </Alert>
      ) : (
        <Row>
          {myReviews.map((review) => (
            <Col md={6} lg={4} key={review.id}>
              <ReviewCard
                {...review}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}