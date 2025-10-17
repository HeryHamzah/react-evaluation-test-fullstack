// src/components/productDetail/ProductInfo.jsx
import React, { useState } from 'react';
import StarRating from '../common/StarRating';
import DiscountBadge from '../common/DiscountBadge';
import QuantitySelector from '../common/QuantitySelector';

/**
 * Product Information Component
 * @param {Object} product - Product data
 * @param {function} onAddToCart - Callback when add to cart button clicked
 */
const ProductInfo = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-info border rounded" style={{ padding: '24px' }}>
      {/* Product Title */}
      <h1 className="h3 mb-3">{product.name}</h1>

      {/* Rating */}
      <div className="mb-3">
        <StarRating 
          rating={product.rating} 
          reviewCount={product.reviewCount} 
        />
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="d-flex align-items-center gap-2">
          <h2 className="h3 mb-0 fw-bold" style={{ color: '#ff8c00' }}>
            {formatPrice(product.price)}
          </h2>
          {product.discount > 0 && (
            <DiscountBadge discount={product.discount} />
          )}
        </div>
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="text-muted text-decoration-line-through small mt-1">
            {formatPrice(product.originalPrice)}
          </div>
        )}
      </div>

      {/* Shipping Info */}
      {product.shipping && (
        <div className="mb-5">
          <div className="row">
            <div className="col-12 col-md-4">
              <strong>Pengiriman</strong>
            </div>
            <div className="col-12 col-md-8">
              <div className="mb-1">
                <strong>Garansi Tiba:</strong> {product.shipping.guarantee.replace('Garansi Tiba: ', '')}
              </div>
              {product.shipping.voucher && (
                <div className="text-muted small">
                  {product.shipping.voucher}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-4">
            <strong>Kuantitas</strong>
          </div>
          <div className="col-12 col-md-8">
            <div className="d-flex align-items-center gap-3">
              <QuantitySelector
                quantity={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                max={product.stock}
              />
              <span 
                className="badge" 
                style={{ 
                  backgroundColor: '#EBF3EB', 
                  color: '#499949',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  paddingLeft: '8px',
                  paddingRight: '8px'
                }}
              >
                Tersedia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="d-grid">
        <button 
          className="btn btn-lg text-white"
          style={{ 
            backgroundColor: '#ff8c00', 
            border: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          Beli Produk
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
