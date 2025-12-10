import React, { useState, useEffect } from "react";
import { Button, Form, Pagination } from "react-bootstrap";
import ReviewCard from "./ReviewCard";
import { useNavigate } from "react-router-dom";

import { getRecentReviews, deleteReview } from "../../firebase/firebaseHelper";

export default function ReviewByBand() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [averageRating, setAverageRating] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  const [allReviews, setAllReviews] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Load all band reviews once
  useEffect(() => {
    async function load() {
      const recent = await getRecentReviews(300);
      const bandOnly = recent.filter((r) => r.bandName);
      const sorted = applySort(bandOnly);
      setAllReviews(sorted);
      setReviews(sorted);
    }
    load();
  }, [sortOption]);

  // ⭐ SORT FUNCTION
  const applySort = (list) => {
    let sorted = [...list];

    switch (sortOption) {
      case "newest":
        sorted.sort((a, b) => b.created - a.created);
        break;
      case "oldest":
        sorted.sort((a, b) => a.created - b.created);
        break;
      case "high":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "low":
        sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "az":
        sorted.sort((a, b) =>
          (a.bandName || "").localeCompare(b.bandName || "")
        );
        break;
      case "za":
        sorted.sort((a, b) =>
          (b.bandName || "").localeCompare(a.bandName || "")
        );
        break;
      default:
        break;
    }

    return sorted;
  };

  // ⭐ SEARCH BUTTON
  const handleSearch = () => {
    setSearchPerformed(true);
    setAverageRating(null);

    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      const sorted = applySort(allReviews);
      setReviews(sorted);
      setCurrentPage(1);
      return;
    }

    const filtered = allReviews.filter((review) =>
      review.bandName?.toLowerCase().includes(term)
    );

    const sorted = applySort(filtered);
    setReviews(sorted);
    setCurrentPage(1);

    if (filtered.length > 0) {
      const avg =
        filtered.reduce((sum, r) => sum + (r.rating || 0), 0) /
        filtered.length;
      setAverageRating(avg);
    }
  };

  // ⭐ CLEAR BUTTON
  const handleClear = () => {
    setSearchTerm("");
    const sorted = applySort(allReviews);
    setReviews(sorted);
    setSearchPerformed(false);
    setAverageRating(null);
    setCurrentPage(1);
  };

  // ⭐ DELETE
  const handleDelete = async (id) => {
    await deleteReview(id);
    const updated = allReviews.filter((r) => r.id !== id);
    const sorted = applySort(updated);
    setAllReviews(sorted);
    setReviews(sorted);
  };

  // ⭐ Pagination
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / postsPerPage);

  return (
    <div className="page-container">
      <h1>Band Reviews</h1>

      <Button
        variant="success"
        onClick={() => navigate("/ReviewPage")}
        className="mb-3"
      >
        Write a Review
      </Button>

      <hr />

      
      {/* ⭐ SEARCH */}
      <Form className="mb-4" onSubmit={(e) => e.preventDefault()}>
        <Form.Label>Band Name</Form.Label>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "0.5rem"
          }}
        >
          {/* Search Input */}
          <Form.Control
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bands..."
            style={{ maxWidth: "300px" }}
          />

          {/* Search Button */}
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>

          {/* Clear Button */}
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>

          {/* Hidden label for accessibility */}
          <Form.Label htmlFor="bandSortSelect" className="visually-hidden">
            Sort By
          </Form.Label>

          {/* Sort Dropdown */}
          <Form.Select
            id="bandSortSelect"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ maxWidth: "180px" }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="high">Highest Rated</option>
            <option value="low">Lowest Rated</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </Form.Select>
        </div>
      </Form>



      {/* ⭐ AVERAGE RATING */}
      {searchPerformed && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          {reviews.length === 0 ? (
            <h5>No results found.</h5>
          ) : (
            <h5>
              Average rating for "{searchTerm}": {" "}
              {averageRating && (
                <>
                  {"★".repeat(Math.round(averageRating))}
                  {"☆".repeat(5 - Math.round(averageRating))}
                  {" "}({averageRating.toFixed(1)})
                </>
              )}
            </h5>
          )}
        </div>
      )}

      {/* ⭐ CARD GRID */}
      <div className="review-grid">
        {currentReviews.map((review) => (
          <div className="review-card-wrapper" key={review.id}>
            <ReviewCard {...review} onDelete={() => handleDelete(review.id)} />
          </div>
        ))}
      </div>

      {/* ⭐ PAGINATION */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
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
