import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../api/authApi";
import BASE_URL from "../../apiConfig";
import { formatDate } from "../../utils/dateUtils"; // your existing date util
import "./CustomerReviewHistory.css";

function CustomerReviewHistory() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllReviews(url = `${BASE_URL}/restaurante/customer-reviews/my/`, accum = []) {
      try {
        const res = await fetchWithAuth(url);
        const data = await res.json();
        const combined = accum.concat(data.results || data);

        if (data.next) {
          return fetchAllReviews(data.next, combined);
        }
        return combined;
      } catch {
        return accum;
      }
    }

    setLoading(true);
    fetchAllReviews()
      .then(all => setReviews(all))
      .finally(() => setLoading(false));
  }, []);
  

  if (loading) return <p>Loading your reviews...</p>;
  if (!reviews.length) return <p>You have not left any reviews yet.</p>;

  return (
    <div className="customer-review-history" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.2rem" }}>Your Reviews</h2>
      <table className="review-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Stars</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
            {reviews && reviews.length > 0 ? (
                reviews.map(review => (
                <tr key={review.id}>
                    <td>{formatDate(review.created_at)}</td>
                    <td>{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</td>
                    <td>{review.feedback}</td>
                </tr>
                ))
            ) : (
                <tr><td colSpan="3">No reviews found.</td></tr>
            )}
        </tbody>

      </table>
    </div>
  );
}

export default CustomerReviewHistory;
