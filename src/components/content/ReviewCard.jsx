import React, { useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { useAuth } from "../auth/AuthContext";

function ReviewCard(props) {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(props.content);
  const [editRating, setEditRating] = useState(props.rating || 0);

  // Format date
  const created = props.created;
  let dt;
  if (!created) dt = new Date();
  else if (created.toDate) dt = created.toDate();
  else dt = new Date(created);

  // Check if current user owns this review
  const isOwner =
    currentUser &&
    (props.userUid === currentUser.uid ||
      (!props.userUid &&
        props.poster === (currentUser.email || currentUser.displayName)));

  const handleUpdate = () => {
    if (props.onUpdate) {
      props.onUpdate(props.id, {
        content: editContent,
        rating: editRating,
      });
    }
    setIsEditing(false);
  };

  return (
    <>
      <Card
        className="shadow-sm h-100"
        style={{
          margin: "0.5rem 0",
          padding: "0.75rem",
          width: "100%",          // fill the bootstrap column
          textAlign: "center",
        }}
      >
        <h1>{props.bandName || props.venueName}</h1>
        <sub>
          Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}
        </sub>
        <br />
        <i>{props.poster}</i>

        {props.rating > 0 && (
          <div
            style={{
              color: "#ffc107",
              fontSize: "1.2rem",
              marginTop: "0.25rem",
            }}
          >
            {"★".repeat(props.rating)}
            {"☆".repeat(5 - props.rating)}
          </div>
        )}

        <p style={{ marginTop: "0.5rem" }}>{props.content}</p>

        {isOwner && (
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => props.onDelete(props.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </Card>

      <Modal show={isEditing} onHide={() => setIsEditing(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </Form.Group>

          <Form.Label>Rating</Form.Label>
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map((r) => (
              <Button
                key={r}
                variant={editRating >= r ? "warning" : "outline-secondary"}
                onClick={() => setEditRating(r)}
                style={{ marginRight: "0.3rem" }}
              >
                ★
              </Button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReviewCard;
