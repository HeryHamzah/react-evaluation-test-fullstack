// src/components/productDetail/ProductDescription.jsx
import React from 'react';

/**
 * Product Description Component
 * @param {Object} description - Product description data
 */
const ProductDescription = ({ description }) => {
  if (!description) return null;

  return (
    <div className="product-description mt-5">
      <div className="bg-light rounded p-4">
        <h3 className="h5 mb-4">Deskripsi Produk</h3>

        {/* Main Description */}
        {description.main && (
          <p className="mb-4">{description.main}</p>
        )}

        {/* Secondary Description */}
        {description.secondary && (
          <p className="mb-4">{description.secondary}</p>
        )}

        {/* Specifications */}
        {description.specifications && description.specifications.length > 0 && (
          <div className="mb-4">
            <h4 className="h6 mb-3">Spesifikasi Produk:</h4>
            <ul className="list-unstyled">
              {description.specifications.map((spec, index) => (
                <li key={index} className="mb-2">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Advantages */}
        {description.advantages && description.advantages.length > 0 && (
          <div>
            <h4 className="h6 mb-3">Kelebihan Produk:</h4>
            <ul className="list-unstyled">
              {description.advantages.map((advantage, index) => (
                <li key={index} className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
