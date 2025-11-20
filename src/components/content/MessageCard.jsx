import React from "react";
import { Button, Card } from "react-bootstrap";

function MessageCard(props) {
  // props.created might be a Date or Firestore Timestamp or string
  const created = props.created;
  let dt;
  if (!created) dt = new Date();
  else if (created.toDate) dt = created.toDate();
  else dt = new Date(created);

  return (
    <Card style={{ margin: "0.5rem", padding: "0.5rem" }}>
      <h2>{props.title}</h2>
      <sub>
        Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}
      </sub>
      <br />
      <i>{props.poster}</i>
      <p>{props.content}</p>
      {props.poster === sessionStorage.getItem("username") && (
        <>
          <Button variant="danger" onClick={() => props.delete(props.id)}>
            Delete
          </Button>
        </>
      )}
    </Card>
  );
}

export default MessageCard;
