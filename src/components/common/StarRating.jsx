import React from "react";

function StarRating({ value = 0, size = 16 }) {
  const full = Math.round(value);
  return (
    <div className="star-rating" aria-label={`Rating ${value}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={`star ${i < full ? "star-filled" : "star-empty"}`}
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      <span className="star-value">{value.toFixed(1)}</span>
    </div>
  );
}

export default StarRating;
