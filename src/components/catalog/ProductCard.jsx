import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../data/mockFurnitureProducts';
import DiscountBadge from '../common/DiscountBadge';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { id, name, price, originalPrice, discount, rating, totalReviews, image } = product;

  const handleCardClick = () => {
    if (id) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div 
      className="card h-100 border-0 shadow-sm hover-shadow-lg transition"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="position-relative overflow-hidden">
        <img
          src={image}
          className="card-img-top"
          alt={name}
          style={{
            height: '250px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-3" style={{ 
          fontSize: '1rem',
          minHeight: '48px',
          lineHeight: '1.5'
        }}>
          {name}
        </h5>
        
        <div className="mt-auto">
          {/* Price */}
          <div className="mb-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h4 className="fw-bold mb-0" style={{ fontSize: '1.25rem', color: '#ff8c00' }}>
                {formatPrice(price)}
              </h4>
              <DiscountBadge discount={discount} />
            </div>
            {discount > 0 && (
              <small className="text-muted text-decoration-line-through">
                {formatPrice(originalPrice)}
              </small>
            )}
          </div>
          
          {/* Rating */}
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center">
              <i className="bi bi-star-fill text-warning me-1"></i>
              <span className="fw-semibold">{rating}</span>
            </div>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              {totalReviews} Terjual
            </span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .hover-shadow-lg {
          transition: box-shadow 0.3s ease;
        }
        .hover-shadow-lg:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
