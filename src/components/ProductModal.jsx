import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { PiUpload, PiArrowsClockwise, PiTrash, PiImage, PiCheckCircle, PiCaretDown, PiCaretUp } from 'react-icons/pi';
import { categories } from '../data/mockProducts';
import '../styles/ProductModal.css';
import '../styles/UpdateStockForm.css';

/**
 * Component ProductModal
 * 
 * Mirip dengan showDialog() atau showModalBottomSheet() di Flutter
 * Digunakan untuk menampilkan form tambah/edit produk
 * 
 * Props:
 * - show: boolean untuk show/hide modal
 * - onHide: callback ketika modal ditutup
 * - onSave: callback ketika data disimpan
 * - product: data produk (null jika mode tambah, ada data jika mode edit)
 * - mode: 'add' atau 'edit'
 */
const ProductModal = ({ show, onHide, onSave, product, mode = 'add' }) => {
  
  // State untuk form data
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    deskripsi: '',
    stok: 0,
    harga: '0',
    unit: 'Unit',
    status: 'aktif',
    produkMenipis: 8,
    gambar: ''
  });
  
  // State untuk image preview
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // State untuk validasi
  const [errors, setErrors] = useState({});

  const formatCurrencyInput = (value) => {
    const digitsOnly = (value || '').replace(/\D/g, '');
    if (!digitsOnly) {
      return '';
    }
    const numericValue = parseInt(digitsOnly, 10);
    if (Number.isNaN(numericValue)) {
      return '';
    }
    return new Intl.NumberFormat('id-ID').format(numericValue);
  };

  const parseCurrencyToNumber = (value) => {
    const digitsOnly = (value || '').replace(/\D/g, '');
    if (!digitsOnly) {
      return 0;
    }
    return parseInt(digitsOnly, 10) || 0;
  };
  
  // useEffect untuk reset form
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        nama: product.nama || '',
        kategori: product.kategori || '',
        deskripsi: product.deskripsi || '',
        stok: product.stok || 0,
        harga: formatCurrencyInput(String(product.harga || '0')),
        unit: product.unit || 'Unit',
        status: product.status || 'aktif',
        produkMenipis: product.produkMenipis || 8,
        gambar: product.gambar || ''
      });
      setImagePreview(product.gambar || null);
    } else {
      // Reset form untuk mode tambah
      setFormData({
        nama: '',
        kategori: '',
        deskripsi: '',
        stok: 0,
        harga: formatCurrencyInput('0'),
        unit: 'Unit',
        status: 'nonaktif',
        produkMenipis: 8,
        gambar: ''
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [product, mode, show]);
  
  // Handler untuk perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'harga') {
      const formattedValue = formatCurrencyInput(value);
      setFormData(prev => ({
        ...prev,
        harga: formattedValue
      }));

      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error untuk field ini
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handler untuk adjust stok dengan caret buttons
  const handleStokAdjust = (delta) => {
    setFormData(prev => {
      const next = Math.max(0, (parseInt(prev.stok) || 0) + delta);
      return { ...prev, stok: next };
    });
    if (errors.stok) {
      setErrors(prev => ({ ...prev, stok: null }));
    }
  };

  // Handler untuk adjust produk menipis dengan caret buttons
  const handleMenipisAdjust = (delta) => {
    setFormData(prev => {
      const next = Math.max(0, (parseInt(prev.produkMenipis) || 0) + delta);
      return { ...prev, produkMenipis: next };
    });
    if (errors.produkMenipis) {
      setErrors(prev => ({ ...prev, produkMenipis: null }));
    }
  };
  
  // Handler untuk toggle status
  const handleStatusToggle = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === 'aktif' ? 'nonaktif' : 'aktif'
    }));
  };
  
  // Handler untuk upload image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          gambar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler untuk hapus image
  const handleDeleteImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      gambar: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama produk harus diisi';
    }
    
    if (!formData.kategori) {
      newErrors.kategori = 'Kategori harus dipilih';
    }
    
    if (formData.stok < 0) {
      newErrors.stok = 'Stok tidak boleh negatif';
    }
    
    const hargaValue = parseCurrencyToNumber(formData.harga);
    if (hargaValue <= 0) {
      newErrors.harga = 'Harga harus lebih dari 0';
    }
    
    if (formData.status === 'aktif' && formData.produkMenipis < 0) {
      newErrors.produkMenipis = 'Produk menipis tidak boleh negatif';
    }
    
    return newErrors;
  };
  
  // Handler untuk submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Convert string ke number untuk stok dan harga
    const dataToSave = {
      ...formData,
      stok: parseInt(formData.stok) || 0,
      harga: parseCurrencyToNumber(formData.harga),
      produkMenipis: parseInt(formData.produkMenipis) || 8
    };
    
    onSave(dataToSave);
  };
  
  // Format number dengan thousand separator
  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };
  
  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="product-modal">
      <Modal.Header closeButton>
        <div>
          <div className="modal-title">Tambah Produk</div>
          <div className="modal-subtitle">Masukkan detail produk untuk menambahkannya ke inventaris.</div>
        </div>
      </Modal.Header>
      
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            {/* Left Column - Image Upload */}
            <div className="col-md-4">
              <div className="image-upload-section">
                <div className={`image-preview-box ${imagePreview ? 'has-image' : ''}`}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    <div className="image-placeholder">
                      <PiImage className="image-placeholder-icon" />
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                
                {!imagePreview ? (
                  <button
                    type="button"
                    className="btn-upload-image"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PiUpload size={16} />
                    Unggah Gambar
                  </button>
                ) : (
                  <div className="image-actions">
                    <button
                      type="button"
                      className="btn-change-image"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PiArrowsClockwise size={16} />
                      Ganti Gambar
                    </button>
                    <button
                      type="button"
                      className="btn-delete-image"
                      onClick={handleDeleteImage}
                    >
                      <PiTrash size={16} />
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Form Fields */}
            <div className="col-md-8">
              {/* Nama Produk & Kategori */}
              <div className="form-row-2">
                <div className="form-group-custom">
                  <label>
                    Nama Produk<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    className={`form-input-custom ${errors.nama ? 'error' : ''}`}
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukan nama produk"
                  />
                  {errors.nama && <div className="error-message">{errors.nama}</div>}
                </div>
                
                <div className="form-group-custom">
                  <label>
                    Kategori Produk<span className="required">*</span>
                  </label>
                  <div className="form-select-wrapper">
                    <select
                      name="kategori"
                      className={`form-input-custom ${errors.kategori ? 'error' : ''}`}
                      value={formData.kategori}
                      onChange={handleInputChange}
                    >
                      <option value="">Pilih kategori</option>
                      {categories
                        .filter(cat => cat !== 'Semua Kategori')
                        .map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                      }
                    </select>
                    <PiCaretDown className="form-select-caret" />
                  </div>
                  {errors.kategori && <div className="error-message">{errors.kategori}</div>}
                </div>
              </div>
              
              {/* Deskripsi Produk */}
              <div className="form-group-custom">
                <label>Deskripsi Produk</label>
                <textarea
                  name="deskripsi"
                  className="form-textarea-custom"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Masukan deskripsi produk"
                  rows="3"
                />
              </div>
              
              {/* Harga Satuan & Stok Awal */}
              <div className="form-row-2">
                <div className="form-group-custom">
                  <label>
                    Harga Satuan<span className="required">*</span>
                  </label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="harga"
                      className={`form-input-custom ${errors.harga ? 'error' : ''}`}
                      value={formData.harga}
                      onChange={handleInputChange}
                      placeholder="0"
                      autoComplete="off"
                    />
                  </div>
                  {errors.harga && <div className="error-message">{errors.harga}</div>}
                </div>
                
                <div className="form-group-custom">
                  <label>
                    Stok Awal<span className="required">*</span>
                  </label>
                  <div className="input-with-suffix">
                    <div className="update-input-wrapper">
                      <input
                        type="text"
                        inputMode="numeric"
                        name="stok"
                        className={`form-input-custom ${errors.stok ? 'error' : ''}`}
                        value={formData.stok}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, stok: Math.max(0, val) }));
                          if (errors.stok) setErrors(prev => ({ ...prev, stok: null }));
                        }}
                        placeholder="0"
                        autoComplete="off"
                      />
                      <div className="update-caret-actions">
                        <button
                          type="button"
                          className="update-caret-btn"
                          onClick={() => handleStokAdjust(1)}
                        >
                          <PiCaretUp size={14} />
                        </button>
                        <button
                          type="button"
                          className="update-caret-btn"
                          onClick={() => handleStokAdjust(-1)}
                        >
                          <PiCaretDown size={14} />
                        </button>
                      </div>
                    </div>
                    <select className="input-suffix-select" disabled>
                      <option>Unit</option>
                    </select>
                  </div>
                  {errors.stok && <div className="error-message">{errors.stok}</div>}
                </div>
              </div>
              
              {/* Status Produk Toggle */}
              <div className="status-toggle-section">
                <div className="status-toggle-header">
                  <div className="status-toggle-title">Status Produk</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="status-toggle-label">
                      {formData.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.status === 'aktif'}
                        onChange={handleStatusToggle}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="status-toggle-description">
                  Sistem akan menandai produk sebagai "Menipis" secara otomatis jika stoknya mendekati habis.
                </div>
              </div>
              
              {/* Produk Menipis - Conditional */}
              {formData.status === 'aktif' && (
                <div className="form-group-custom" style={{ marginTop: '1.25rem' }}>
                  <label>
                    Produk Menipis<span className="required">*</span>
                  </label>
                  <div className="input-with-suffix">
                    <div className="update-input-wrapper">
                      <input
                        type="text"
                        inputMode="numeric"
                        name="produkMenipis"
                        className={`form-input-custom ${errors.produkMenipis ? 'error' : ''}`}
                        value={formData.produkMenipis}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, produkMenipis: Math.max(0, val) }));
                          if (errors.produkMenipis) setErrors(prev => ({ ...prev, produkMenipis: null }));
                        }}
                        placeholder="8"
                        autoComplete="off"
                      />
                      <div className="update-caret-actions">
                        <button
                          type="button"
                          className="update-caret-btn"
                          onClick={() => handleMenipisAdjust(1)}
                        >
                          <PiCaretUp size={14} />
                        </button>
                        <button
                          type="button"
                          className="update-caret-btn"
                          onClick={() => handleMenipisAdjust(-1)}
                        >
                          <PiCaretDown size={14} />
                        </button>
                      </div>
                    </div>
                    <select className="input-suffix-select" disabled>
                      <option>Unit</option>
                    </select>
                  </div>
                  {errors.produkMenipis && <div className="error-message">{errors.produkMenipis}</div>}
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <button type="button" className="btn-cancel" onClick={onHide}>
            Batal
          </button>
          <button type="submit" className="btn-submit">
            <PiCheckCircle size={18} />
            Tambah
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ProductModal;
