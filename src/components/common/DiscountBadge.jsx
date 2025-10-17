// src/components/common/DiscountBadge.jsx
import React from 'react';

/**
 * Reusable Discount Badge Component
 * Style sama dengan yang digunakan di catalog
 * @param {number} discount - Discount percentage
 * @param {string} className - Additional CSS classes
 */
const DiscountBadge = ({ discount, className = '' }) => {
  if (!discount || discount <= 0) return null;

  return (
    <span 
      className={`px-3 py-1 position-relative d-inline-block ${className}`}
      style={{ 
        backgroundColor: '#FFF2E6',
        color: '#ff8c00',
        fontSize: '0.875rem',
        fontWeight: '600',
        clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)'
      }}
    >
      -{discount}%
    </span>
  );
};

export default DiscountBadge;
