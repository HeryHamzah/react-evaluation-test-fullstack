import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { PiCheckCircle, PiPencilSimple, PiCaretUp, PiCaretDown, PiCheck, PiX } from 'react-icons/pi';
import '../styles/ProductDetailModal.css';
import '../styles/UpdateStockForm.css';

/**
 * Component ProductDetailModal
 * 
 * Modal untuk menampilkan detail produk (read-only)
 * 
 * Props:
 * - show: boolean untuk menampilkan/menyembunyikan modal
 * - onHide: function untuk menutup modal
 * - product: object data produk yang akan ditampilkan
 * - onEdit: function callback ketika user klik "Edit Produk"
 */
const ProductDetailModal = ({ show, onHide, product, onEdit, onUpdateStock }) => {
  
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateType, setUpdateType] = useState('penambahan'); // 'penambahan' atau 'pengurangan'
  const [updateAmount, setUpdateAmount] = useState(0);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  if (!product) return null;
  
  // Handler untuk adjust update amount
  const handleAdjustAmount = (delta) => {
    setUpdateAmount(prev => Math.max(0, prev + delta));
  };
  
  // Handler untuk update stock
  const handleUpdateStock = async () => {
    if (updateAmount <= 0) return;
    
    setIsUpdating(true);
    try {
      const newStock = updateType === 'penambahan' 
        ? product.stok + updateAmount 
        : Math.max(0, product.stok - updateAmount);
      
      // Call parent handler
      if (onUpdateStock) {
        await onUpdateStock(product.id, newStock);
      }
      
      // Show success notification
      setShowSuccessNotif(true);
      setShowUpdateForm(false);
      setUpdateAmount(0);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowSuccessNotif(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handler untuk batal update
  const handleCancelUpdate = () => {
    setShowUpdateForm(false);
    setUpdateAmount(0);
    setUpdateType('penambahan');
  };

  // Format harga ke Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusConfig = {
      'aktif': { label: 'Aktif', className: 'status-badge-aktif' },
      'menipis': { label: 'Menipis', className: 'status-badge-menipis' },
      'nonaktif': { label: 'Nonaktif', className: 'status-badge-nonaktif' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig['nonaktif'];

    return (
      <div className={`status-badge ${config.className}`}>
        <PiCheckCircle size={16} />
        {config.label}
      </div>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="product-detail-modal"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Detail Produk</Modal.Title>
          <p className="modal-subtitle">Berikut adalah detail dari produk yang dipilih.</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="detail-content">
          {/* Left Column - Image */}
          <div className="detail-image-section">
            {product.gambar ? (
              <img 
                src={product.gambar} 
                alt={product.nama}
                className="detail-product-image"
              />
            ) : (
              <div className="detail-image-placeholder">
                <span>Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="detail-info-section">
            {/* Nama & Kategori */}
            <div className="detail-row-2">
              <div className="detail-field">
                <label>Nama Produk</label>
                <p className="detail-value">{product.nama}</p>
              </div>
              <div className="detail-field">
                <label>Kategori Produk</label>
                <p className="detail-value">{product.kategori}</p>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="detail-field">
              <label>Deskripsi Produk</label>
              <p className="detail-value">{product.deskripsi || '-'}</p>
            </div>

            {/* Harga & Stok */}
            <div className="detail-row-2">
              <div className="detail-field">
                <label>Harga Satuan</label>
                <p className="detail-value">{formatRupiah(product.harga)}</p>
              </div>
              <div className="detail-field">
                <div className="detail-stok-container">
                  <div className="detail-stok-info">
                    <label>Stok Saat Ini</label>
                    <p className="detail-value">{product.stok} {product.unit || 'Unit'}</p>
                  </div>
                  <button 
                    className="btn-update-stock"
                    onClick={() => setShowUpdateForm(!showUpdateForm)}
                  >
                    Perbarui
                  </button>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="detail-field">
              <label>Status Produk</label>
              {renderStatusBadge(product.status)}
            </div>
            
            {/* Update Stock Form */}
            {showUpdateForm && (
              <div className="update-stock-form">
                <div className="update-stock-header">
                  <label>Update Stok<span className="required">*</span></label>
                </div>
                
                <div className="update-stock-body">
                  {/* Input dengan caret controls */}
                  <div className="update-input-wrapper">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="update-input"
                      value={updateAmount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setUpdateAmount(Math.max(0, val));
                      }}
                      placeholder="0"
                    />
                    <div className="update-caret-actions">
                      <button
                        type="button"
                        className="update-caret-btn"
                        onClick={() => handleAdjustAmount(1)}
                      >
                        <PiCaretUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="update-caret-btn"
                        onClick={() => handleAdjustAmount(-1)}
                      >
                        <PiCaretDown size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Tabs Penambahan/Pengurangan */}
                  <div className="update-tabs">
                    <button
                      className={`update-tab ${updateType === 'penambahan' ? 'active' : ''}`}
                      onClick={() => setUpdateType('penambahan')}
                    >
                      Penambahan
                    </button>
                    <button
                      className={`update-tab ${updateType === 'pengurangan' ? 'active' : ''}`}
                      onClick={() => setUpdateType('pengurangan')}
                    >
                      Pengurangan
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="update-stock-actions">
                  <button 
                    className="btn-update-cancel"
                    onClick={handleCancelUpdate}
                    disabled={isUpdating}
                  >
                    Batal
                  </button>
                  <button 
                    className="btn-update-submit"
                    onClick={handleUpdateStock}
                    disabled={updateAmount <= 0 || isUpdating}
                  >
                    Update
                    <PiCheck size={18} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Success Notification */}
            {showSuccessNotif && (
              <div className="stock-success-notif">
                <div className="success-notif-content">
                  <PiCheckCircle size={20} />
                  <span>Stok berhasil diperbarui!</span>
                </div>
                <button 
                  className="success-notif-close"
                  onClick={() => setShowSuccessNotif(false)}
                >
                  <PiX size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="detail-footer">
        <button className="btn-detail-close" onClick={onHide}>
          Tutup
        </button>
        <button className="btn-detail-edit" onClick={onEdit}>
          <PiPencilSimple size={18} />
          Edit Produk
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailModal;
