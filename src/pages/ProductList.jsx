import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { PiMagnifyingGlass } from 'react-icons/pi';
import Navbar from '../components/Navbar';
import ProductModal from '../components/ProductModal';
import ProductDetailModal from '../components/ProductDetailModal';
import SuccessModal from '../components/SuccessModal';
import StatusModal from '../components/StatusModal';
import SelectWithIcon from '../components/SelectWithIcon';
import productService from '../services/productService';
import { categories, statuses } from '../data/mockProducts';
import '../styles/ProductList.css';
import  ProductActions  from '../components/ProductActions';
import SortOrderButton from '../components/SortOrder';



/**
 * Component ProductList - Halaman Daftar Produk
 * 
 * KONSEP UNTUK FLUTTER DEVELOPER:
 * 
 * 1. useState = mirip dengan State management (setState di StatefulWidget)
 *    Setiap kali state berubah, component akan re-render (build ulang)
 * 
 * 2. useEffect = mirip dengan lifecycle methods
 *    - useEffect tanpa dependency = componentDidMount + componentDidUpdate
 *    - useEffect dengan [] = componentDidMount (hanya sekali)
 *    - useEffect dengan [dep] = dijalankan ketika dep berubah
 * 
 * 3. Component ini seperti StatefulWidget di Flutter
 *    Return statement mirip dengan build() method
 */
const ProductList = () => {
  
  // STATE MANAGEMENT
  // Mirip dengan variabel state di StatefulWidget Flutter
  
  const [products, setProducts] = useState([]); // List produk
  const [loading, setLoading] = useState(false); // Loading indicator
  const [error, setError] = useState(null); // Error state
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  
  // State untuk filter dan search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  
  // State untuk sorting (default: updated_at desc untuk data ter-update)
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' atau 'desc'
  
  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' atau 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State untuk detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // State untuk success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('');
  // State untuk edit status
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusProduct, setStatusProduct] = useState(null);
  const [statusChoice, setStatusChoice] = useState('aktif');
  
  /**
   * useEffect untuk fetch data ketika filter/sort/page berubah
   * Mirip dengan addListener di Flutter atau watch di Provider
   */
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);
  
  /**
   * Function untuk fetch products dari service
   * Mirip dengan method async di Flutter untuk fetch data dari repository
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await productService.getProducts({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        kategori: selectedCategory,
        status: selectedStatus,
        sortBy: sortBy,
        sortOrder: sortOrder
      });
      
      if (result.success) {
        setProducts(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalItems(result.pagination.totalItems);
      } else {
        setError(result.error);
      }
      
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handler untuk search
   * Menggunakan debouncing untuk performa lebih baik
   */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset ke halaman pertama
  };
  
  /**
   * Handler untuk toggle sort order (Asc/Desc)
   */
  const handleToggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  /**
   * Handler untuk buka modal tambah produk
   */
  const handleAddProduct = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setShowModal(true);
  };
  
  /**
   * Handler untuk buka modal detail produk
   */
  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  /**
   * Handler untuk buka modal edit produk dari detail
   */
  const handleEditFromDetail = () => {
    setShowDetailModal(false);
    setModalMode('edit');
    setShowModal(true);
  };

  /**
   * Handler untuk buka modal edit produk langsung
   */
  const handleEditProduct = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setShowModal(true);
  };
  
  /**
   * Handler untuk save produk (add/edit)
   */
  const handleSaveProduct = async (productData) => {
    try {
      setLoading(true);
      
      let result;
      if (modalMode === 'add') {
        result = await productService.createProduct(productData);
      } else {
        result = await productService.updateProduct(selectedProduct.id, productData);
      }
      
      if (result.success) {
        setShowModal(false);
        fetchProducts(); // Refresh data
        
        // Tampilkan success modal
        if (modalMode === 'add') {
          setSuccessTitle('Berhasil Ditambah!');
          setSuccessMessage('Produk baru berhasil disimpan dan sekarang muncul di daftar produk.');
        } else {
          setSuccessTitle('Berhasil Diperbarui!');
          setSuccessMessage('Perubahan produk berhasil disimpan dan telah diperbarui di daftar produk.');
        }
        setShowSuccessModal(true);
      } else {
        alert('Error: ' + result.error);
      }
      
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handler untuk ubah status produk
   */
  const handleOpenStatusEditor = (product) => {
    setStatusProduct(product);
    setStatusChoice(product.status === 'nonaktif' ? 'nonaktif' : 'aktif');
    setShowStatusModal(true);
  };

  const handleSubmitStatus = async (newStatus) => {
    if (!statusProduct) return;
    if (!['aktif', 'nonaktif'].includes(newStatus)) return;
    try {
      setLoading(true);
      const result = await productService.updateProductStatus(statusProduct.id, newStatus);
      if (result.success) {
        setShowStatusModal(false);
        fetchProducts();
        setSelectedProduct(prev => (prev && prev.id === statusProduct.id) ? { ...prev, status: newStatus } : prev);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengubah status produk');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handler untuk update stock produk
   */
  const handleUpdateStock = async (productId, newStock) => {
    try {
      setLoading(true);
      const result = await productService.updateProduct(productId, { stok: newStock });
      
      if (result.success) {
        fetchProducts(); // Refresh data
        // Update selected product untuk detail modal
        setSelectedProduct(prev => ({ ...prev, stok: newStock }));
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat memperbarui stok');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler untuk hapus produk
   */
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }
    
    try {
      setLoading(true);
      const result = await productService.deleteProduct(productId);
      
      if (result.success) {
        fetchProducts();
        alert(result.message);
      } else {
        alert('Error: ' + result.error);
      }
      
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Format harga ke Rupiah
   */
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(value);
  };

  
  /**
   * Render status badge dengan check circle icon
   */
  const renderStatusBadge = (status) => {
    const statusClass = `status-badge status-${status}`;
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    
    return (
      <span className={statusClass}>
        <span className="status-icon">✓</span>
        {statusText}
      </span>
    );
  };
  
  /**
   * Generate array halaman untuk pagination
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };
  
  /**
   * Handle image error - set placeholder
   */
  const handleImageError = (e) => {
    e.target.src = '/placeholder.svg';
  };
  
  /**
   * RENDER / BUILD UI
   * Mirip dengan method build() di Flutter Widget
   */
  return (
    <>
      {/* Navbar */}
      <Navbar />
      
      <div className="product-list-container">
        {/* Header Section */}
        <div className="product-header d-flex justify-content-between align-items-start flex-wrap">
          <div>
            <h1 className="product-title">Daftar Produk</h1>
            <p className="product-subtitle">Lihat semua produk yang tersedia di inventaris.</p>
          </div>
          <div className="header-actions">
            <button className="btn-update-stock">
              Perbarui Stok Produk
            </button>
            <button className="btn-add-product" onClick={handleAddProduct}>
              <span>+</span>
              Tambah Produk
            </button>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-row">
            {/* Search Box */}
            <div className="search-box">
              <PiMagnifyingGlass className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Cari produk"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            {/* Filter Group */}
            <div className="filter-group">
              {/* Filter Kategori */}
              <SelectWithIcon
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </SelectWithIcon>
              
              {/* Filter Status */}
              <SelectWithIcon
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </SelectWithIcon>
            </div>
            
            {/* Sort Section */}
            <div className="sort-section">
              <span className="sort-label">Urutkan:</span>
              <SelectWithIcon
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="updated_at">Update Terakhir</option>
                <option value="nama">Nama Produk</option>
                <option value="harga">Harga</option>
                <option value="stok">Stok</option>
                <option value="kategori">Kategori</option>
              </SelectWithIcon>
               <SortOrderButton sortOrder={sortOrder} handleToggleSortOrder={handleToggleSortOrder}/>
            </div>
          </div>
        </div>
        
        {/* Table Section */}
        <div className="table-container">
          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          )}
          
          {/* Table */}
          {!loading && !error && (
            <>
              <table className="product-table table">
                <thead>
                  <tr>
                    <th>Nama Produk</th>
                    <th>Kategori</th>
                    <th>Stok</th>
                    <th>Harga (Rp)</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        Tidak ada data produk
                      </td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id}>
                        {/* Nama Produk dengan Gambar */}
                        <td>
                          <div className="product-name-cell">
                            <img
                              src={product.gambar}
                              alt={product.nama}
                              className="product-image"
                              onError={handleImageError}
                            />
                            <span className="product-name">{product.nama}</span>
                          </div>
                        </td>
                        
                        {/* Kategori */}
                        <td>{product.kategori}</td>
                        
                        {/* Stok */}
                        <td>{product.stok}</td>
                        
                        {/* Harga */}
                        <td>{formatRupiah(product.harga)}</td>
                        
                        {/* Status */}
                        <td>{renderStatusBadge(product.status)}</td>
                        
                        {/* Actions */}
                        <td>
                          <div className="action-cell">
                          
                            
                            {/* Dropdown Menu */}
                            <ProductActions
          product={product}
          onViewDetail={handleViewDetail}
          onEdit={handleEditProduct}
          onUpdateStatus={handleOpenStatusEditor}
          onDelete={handleDeleteProduct}
        />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="pagination-section">
                <div className="pagination-info">
                  Menampilkan {itemsPerPage} Dari{' '}
                  <span className="total-data">{totalItems} Data</span>
                </div>
                
                <div className="pagination-controls">
                  {/* Previous Button */}
                  <button
                    className="page-button"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  
                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="page-button" disabled>...</span>
                      ) : (
                        <button
                          className={`page-button ${currentPage === page ? 'active' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {/* Next Button */}
                  <button
                    className="page-button"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Modal untuk View Detail Product */}
      <ProductDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        product={selectedProduct}
        onEdit={handleEditFromDetail}
        onUpdateStock={handleUpdateStock}
      />

      {/* Modal untuk Add/Edit Product */}
      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        mode={modalMode}
      />

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title={successTitle}
        message={successMessage}
      />

      {/* Status Modal */}
      <StatusModal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        onSubmit={(selected) => handleSubmitStatus(selected)}
        currentStatus={statusChoice}
        title={statusProduct ? `Edit Status: ${statusProduct.nama}` : 'Edit Status Produk'}
      />
    </>
  );
};

export default ProductList;
