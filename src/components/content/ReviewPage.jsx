import React, { useState } from "react";
import { Button, Form, ToggleButton, ButtonGroup, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addReview } from "../../firebase/firebaseHelper";
import { useAuth } from "../auth/AuthContext";

export default function ReviewPage() {
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();

  const [reviewType, setReviewType] = useState("band");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Redirect to login if not authenticated
  if (!userLoggedIn) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <Alert variant="warning">
          <h4>Please log in to write a review</h4>
          <Button type="button" variant="primary" onClick={() => navigate("/UserLogin")}>
            Go to Login
          </Button>
        </Alert>
      </div>
    );
  }

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
        poster: currentUser?.email || currentUser?.displayName || sessionStorage.getItem("username") || "Anonymous",
      });

      setSuccessMsg("Review submitted! Thanks — your review is live.");
      setName("");
      setContent("");
      setRating(0);

    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting your review.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Write Your Review</h1>
      <hr />

      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <h4>Review Type</h4>
      <ButtonGroup className="mb-3">
        <ToggleButton
          id="band-option"
          type="radio"
          variant="outline-primary"
          checked={reviewType === "band"}
          value="band"
          onClick={() => setReviewType("band")}
        >
          Band
        </ToggleButton>

        <ToggleButton
          id="venue-option"
          type="radio"
          variant="outline-primary"
          checked={reviewType === "venue"}
          value="venue"
          onClick={() => setReviewType("venue")}
        >
          Venue
        </ToggleButton>
      </ButtonGroup>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="typeOfReview">{reviewType === "band" ? "Band Name" : "Venue Name"}</Form.Label>
        <Form.Control
          id="typeOfReview"
          placeholder={`Enter ${reviewType} name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="yourReview">Your Review</Form.Label>
        <Form.Control
          id="yourReview"
          as="textarea"
          rows={4}
          placeholder="Write your review..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Form.Group>

      <h5>Rating</h5>
      <div className="mb-3">
        {[1, 2, 3, 4, 5].map((r) => (
          <Button
            type="button"
            key={r}
            variant={rating >= r ? "warning" : "outline-secondary"}
            onClick={() => setRating(r)}
            style={{ marginRight: "0.3rem" }}
          >
            ★
          </Button>
        ))}
      </div>

      <div className="mt-3">
        <Button type="submit" variant="secondary" onClick={() => {
          setName(""); setContent(""); setRating(0); setError(""); setSuccessMsg("");
        }}>
          Cancel
        </Button>{" "}
        <Button type="submit" variant="success" onClick={handleSubmit}>
          Submit Review
        </Button>
      </div>
    </div>
  );
}