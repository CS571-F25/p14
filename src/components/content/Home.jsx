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
            <h2>Track artists and venues you love.</h2>
            <h2>Tell your friends what's good.</h2>
            <br />

            <div className="d-grid gap-2 d-md-block">

                <Button 
                    type="button"
                    style={{ backgroundColor: "#ffe9e9ff", borderColor: "#7d1f0aff", color: "#7d1f0aff" }}
                    className="btn btn-outline-dark me-4"
                    onClick={() => navigate("/ReviewByBand")}
                >
                    See Reviews by Band
                </Button>

                <Button
                    type="button"
                    style={{ backgroundColor: "#ffe9e9ff", borderColor: "#7d1f0aff", color: "#7d1f0aff" }}
                    className="btn btn-outline-dark me-4"
                    onClick={() => navigate("/ReviewByVenue")}
                >
                    See Reviews by Venue
                </Button>

                <Button
                    type="button"
                    style={{ backgroundColor: "#022062ff", borderColor: "#022062ff", color: "#FFF" }}
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
