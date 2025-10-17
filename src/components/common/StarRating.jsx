// src/components/common/StarRating.jsx
import React from 'react';

/**
 * Reusable Star Rating Component
 * @param {number} rating - Rating value (0-5)
 * @param {number} reviewCount - Number of reviews
 * @param {boolean} showCount - Show review count
 */
const StarRating = ({ rating, reviewCount, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="d-flex align-items-center gap-2">
      <span className="fw-medium">{rating}</span>
      <div className="d-flex">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
        ))}
        {hasHalfStar && <i className="bi bi-star-half text-warning"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star text-warning"></i>
        ))}
      </div>
      {showCount && reviewCount && (
        <span className="text-muted small">{reviewCount} Terjual</span>
      )}
    </div>
  );
};

export default StarRating;
