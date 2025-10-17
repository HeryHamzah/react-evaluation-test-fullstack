// src/components/productDetail/ImageGallery.jsx
import React, { useState } from 'react';

/**
 * Image Gallery Component for Product Detail
 * @param {Array} images - Array of image URLs
 * @param {string} productName - Product name for alt text
 */
const ImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-light d-flex align-items-center justify-content-center" 
           style={{ height: '400px' }}>
        <span className="text-muted">No image available</span>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      {/* Main Image */}
      <div className="main-image mb-3">
        <img
          src={images[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="img-fluid rounded"
          style={{ 
            width: '100%', 
            height: '400px', 
            objectFit: 'cover',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Thumbnail Images */}
      <div className="d-flex gap-2 overflow-auto">
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail ${selectedImage === index ? 'border-primary' : 'border-secondary'}`}
            style={{ 
              cursor: 'pointer',
              minWidth: '80px',
              width: '80px',
              height: '80px'
            }}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image}
              alt={`${productName} - Thumbnail ${index + 1}`}
              className={`img-fluid rounded border ${
                selectedImage === index ? 'border-primary border-3' : 'border-secondary'
              }`}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
