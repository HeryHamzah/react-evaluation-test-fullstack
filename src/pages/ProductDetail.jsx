// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ImageGallery from '../components/productDetail/ImageGallery';
import ProductInfo from '../components/productDetail/ProductInfo';
import ProductDescription from '../components/productDetail/ProductDescription';
import { getProductDetail, addToCart } from '../services/productDetailService';

/**
 * Product Detail Page
 * Responsive layout with Bootstrap
 */
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // No need to get current user - Navbar handles it internally

  useEffect(() => {
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductDetail(id);
      setProduct(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      const result = await addToCart(productId, quantity);
      
      // Show success message
      alert(`Berhasil menambahkan ${quantity} produk ke keranjang!`);
      
      // Optional: Navigate to cart page
      // navigate('/cart');
    } catch (err) {
      alert('Gagal menambahkan produk ke keranjang');
      console.error('Error adding to cart:', err);
    }
  };

  // Loading State
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Memuat detail produk...</p>
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error || 'Produk tidak ditemukan'}</p>
            <hr />
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/catalog')}
            >
              Kembali ke Katalog
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container py-4">
        <div className="row g-5">
          {/* Left Column - Image Gallery */}
          <div className="col-12 col-lg-6">
            <ImageGallery 
              images={product.images} 
              productName={product.name}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="col-12 col-lg-6">
            <ProductInfo 
              product={product}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Product Description - Full Width */}
        <div className="row">
          <div className="col-12">
            <ProductDescription description={product.description} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
