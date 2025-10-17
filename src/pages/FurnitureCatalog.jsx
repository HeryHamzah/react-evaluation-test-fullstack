import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CatalogHeader from '../components/catalog/CatalogHeader';
import ProductGrid from '../components/catalog/ProductGrid';
import furnitureService from '../services/furnitureService';

const FurnitureCatalog = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load semua produk saat component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await furnitureService.getAllProducts();
      setProducts(data);
      // Show only first 8 products initially
      setDisplayedProducts(data.slice(0, 8));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setDisplayedProducts(products.slice(0, 8));
      return;
    }

    try {
      setLoading(true);
      const results = await furnitureService.searchProducts(query);
      setDisplayedProducts(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigate to all products page
  const handleShowAll = () => {
    navigate('/catalog/all');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header with Search */}
      <CatalogHeader onSearch={handleSearch} />
      
      {/* Main Content */}
      <div className="container py-5">
        {/* Section Title */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="fw-bold mb-1">Rekomendasi</h3>
              <p className="text-muted mb-0">Produk - produk pilihan terbaik dari kami</p>
            </div>
            {products.length > 8 && (
              <button 
                className="btn fw-semibold"
                onClick={handleShowAll}
                style={{ 
                  color: '#000',
                  border: '1px solid #E7EAF0',
                  backgroundColor: 'transparent'
                }}
              >
                Lihat Semua Produk
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={displayedProducts} loading={loading} />
      </div>
    </div>
  );
};

export default FurnitureCatalog;
