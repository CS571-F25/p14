import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { getRecentReviews } from "../../firebase/firebaseHelper";
import ReviewCard from "./ReviewCard";

export default function Home() {
    const navigate = useNavigate();

    const [recentReviews, setRecentReviews] = useState([]);

    // Load 3 most recent reviews
    useEffect(() => {
        async function load() {
            const latest = await getRecentReviews(3);
            setRecentReviews(latest);
        }
        load();
    }, []);

    return (
        <div className="page-container">
            <h1>Welcome to Riffrate</h1>
            <br />
            <h3>Track artists and venues you love.</h3>
            <h3>Tell your friends what's good.</h3>
            <br />

            <div className="d-grid gap-2 d-md-block">

                <Button
                    style={{ backgroundColor: "#ff2f00ff", borderColor: "#273043", color: "#FFF" }}
                    className="btn btn-outline-dark me-4"
                    onClick={() => navigate("/ReviewByBand")}
                >
                    See Reviews by Band
                </Button>

                <Button
                    style={{ backgroundColor: "#ff2f00ff", borderColor: "#273043", color: "#FFF" }}
                    className="btn btn-outline-dark me-4"
                    onClick={() => navigate("/ReviewByVenue")}
                >
                    See Reviews by Venue
                </Button>

                <Button
                    style={{ backgroundColor: "#273043", borderColor: "#FF5733", color: "#FFF" }}
                    className="btn btn-success"
                    onClick={() => navigate("/ReviewPage")}
                >
                    Write a Review
                </Button>

            </div>

            {/* ⭐ NEW SECTION: 3 MOST RECENT REVIEWS */}
            <h2 style={{ marginTop: "3rem" }}>Most Recent Reviews</h2>
            <hr style={{ width: "60%", margin: "1rem auto" }} />

            <div className="review-grid">
                {recentReviews.map((review) => (
                    <div className="review-card-wrapper" key={review.id}>
                        <ReviewCard {...review} />
                    </div>
                ))}
            </div>

            {recentReviews.length === 0 && (
                <p>No reviews yet — be the first to write one!</p>
            )}
        </div>
    );
}
