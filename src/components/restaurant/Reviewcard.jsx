import React from "react";
import StarRating from "../common/StarRating";

function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user">{review.user}</div>
        <StarRating value={review.rating} />
      </div>
      <div className="review-text">{review.text}</div>
      <div className="review-date">{review.date}</div>
    </div>
  );
}

export default ReviewCard;
