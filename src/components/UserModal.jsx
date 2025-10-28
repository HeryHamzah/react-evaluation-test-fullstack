import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { PiUpload, PiArrowsClockwise, PiTrash, PiImage, PiCheckCircle, PiCaretDown } from 'react-icons/pi';
import '../styles/UserModal.css';

/**
 * Component UserModal
 * 
 * Modal untuk tambah/edit user
 */
const UserModal = ({ show, onHide, onSave, user, mode }) => {
  
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    noTelp: '',
    status: 'nonaktif',
    avatar: '',
    tanggalDibuat: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Reset form ketika modal dibuka/ditutup atau mode berubah
  useEffect(() => {
    if (show) {
      if (mode === 'edit' && user) {
        setFormData({
          nama: user.nama || '',
          email: user.email || '',
          noTelp: user.noTelp || '',
          status: user.status || 'aktif',
          avatar: user.avatar || '',
          tanggalDibuat: user.tanggalDibuat || ''
        });
        setImagePreview(user.avatar || null);
      } else {
        // Mode add - reset form
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          nama: '',
          email: '',
          noTelp: '',
          status: 'nonaktif',
          avatar: '',
          tanggalDibuat: today
        });
        setImagePreview(null);
      }
      setErrors({});
    }
  }, [show, mode, user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error untuk field yang sedang diubah
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
          avatar: reader.result
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
      avatar: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validasi form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama user harus diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.noTelp.trim()) {
      newErrors.noTelp = 'No telepon harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="user-modal"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title>
            {mode === 'add' ? 'Tambah User' : 'Edit User'}
          </Modal.Title>
          <p className="modal-subtitle">
            {mode === 'add' 
              ? 'Masukkan detail user untuk menambahkannya ke management user' 
              : 'Perbarui informasi user di bawah ini.'}
          </p>
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
              {/* Nama User & No Telephone */}
              <div className="form-row-2">
                <div className="form-group-custom">
                  <label>
                    Nama User<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    className={`form-input-custom ${errors.nama ? 'error' : ''}`}
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Masukan nama user"
                  />
                  {errors.nama && <div className="error-message">{errors.nama}</div>}
                </div>
                
                <div className="form-group-custom">
                  <label>
                    No Telphone<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="noTelp"
                    className={`form-input-custom ${errors.noTelp ? 'error' : ''}`}
                    value={formData.noTelp}
                    onChange={handleChange}
                    placeholder="Masukan no telphone"
                  />
                  {errors.noTelp && <div className="error-message">{errors.noTelp}</div>}
                </div>
              </div>
              
              {/* Email */}
              <div className="form-group-custom">
                <label>
                  Email<span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-input-custom ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukan Email"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              
              {/* Status User Toggle */}
              <div className="status-toggle-section">
                <div className="status-toggle-header">
                  <div className="status-toggle-title">Status User</div>
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
                  Jika user telah lama tidak aktif anda bisa menonaktifkan status user secara manual
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <button type="button" className="btn-cancel" onClick={onHide}>
            Batal
          </button>
          <button type="submit" className="btn-submit">
            <PiCheckCircle size={18} />
            {mode === 'edit' ? 'Update' : 'Tambah'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default UserModal;
