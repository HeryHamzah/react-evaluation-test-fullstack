// src/components/common/QuantitySelector.jsx
import React from 'react';

/**
 * Reusable Quantity Selector Component
 * Style mirip Tokopedia dengan border container dan separator
 * @param {number} quantity - Current quantity
 * @param {function} onIncrease - Callback when increase button clicked
 * @param {function} onDecrease - Callback when decrease button clicked
 * @param {number} max - Maximum quantity allowed
 * @param {number} min - Minimum quantity allowed
 */
const QuantitySelector = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  max = 99, 
  min = 1 
}) => {
  return (
    <div 
      className="d-flex align-items-center"
      style={{
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      {/* Decrease Button */}
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        style={{
          width: '36px',
          height: '36px',
          border: 'none',
          background: 'transparent',
          cursor: quantity <= min ? 'not-allowed' : 'pointer',
          color: quantity <= min ? '#ccc' : '#333',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        −
      </button>
      
      {/* Border Separator */}
      <div style={{ 
        width: '1px', 
        height: '24px', 
        backgroundColor: '#dee2e6' 
      }} />
      
      {/* Quantity Display */}
      <span 
        className="fw-medium" 
        style={{ 
          minWidth: '40px', 
          textAlign: 'center',
          fontSize: '14px'
        }}
      >
        {quantity}
      </span>
      
      {/* Border Separator */}
      <div style={{ 
        width: '1px', 
        height: '24px', 
        backgroundColor: '#dee2e6' 
      }} />
      
      {/* Increase Button */}
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        style={{
          width: '36px',
          height: '36px',
          border: 'none',
          background: 'transparent',
          cursor: quantity >= max ? 'not-allowed' : 'pointer',
          color: quantity >= max ? '#ccc' : '#333',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
