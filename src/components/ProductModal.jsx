import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { categories } from '../data/mockProducts';

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
  // Mirip dengan TextEditingController di Flutter atau state management
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Meja',
    stok: 0,
    harga: 0,
    status: 'aktif',
    gambar: ''
  });
  
  // State untuk validasi
  const [errors, setErrors] = useState({});
  
  // useEffect mirip dengan initState() di Flutter
  // Dijalankan ketika product atau mode berubah
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        nama: product.nama,
        kategori: product.kategori,
        stok: product.stok,
        harga: product.harga,
        status: product.status,
        gambar: product.gambar
      });
    } else {
      // Reset form untuk mode tambah
      setFormData({
        nama: '',
        kategori: 'Meja',
        stok: 0,
        harga: 0,
        status: 'aktif',
        gambar: ''
      });
    }
    setErrors({});
  }, [product, mode, show]);
  
  // Handler untuk perubahan input
  // Mirip dengan onChanged di TextField Flutter
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
  
  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama produk harus diisi';
    }
    
    if (formData.stok < 0) {
      newErrors.stok = 'Stok tidak boleh negatif';
    }
    
    if (formData.harga <= 0) {
      newErrors.harga = 'Harga harus lebih dari 0';
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
      stok: parseInt(formData.stok),
      harga: parseFloat(formData.harga)
    };
    
    onSave(dataToSave);
  };
  
  // Fungsi untuk format rupiah
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'add' ? 'Tambah Produk Baru' : 'Edit Produk'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Nama Produk */}
          <Form.Group className="mb-3">
            <Form.Label>Nama Produk *</Form.Label>
            <Form.Control
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="Masukkan nama produk"
              isInvalid={!!errors.nama}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nama}
            </Form.Control.Feedback>
          </Form.Group>
          
          {/* Kategori */}
          <Form.Group className="mb-3">
            <Form.Label>Kategori *</Form.Label>
            <Form.Select
              name="kategori"
              value={formData.kategori}
              onChange={handleInputChange}
            >
              {categories
                .filter(cat => cat !== 'Semua Kategori')
                .map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              }
            </Form.Select>
          </Form.Group>
          
          <div className="row">
            {/* Stok */}
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Stok *</Form.Label>
                <Form.Control
                  type="number"
                  name="stok"
                  value={formData.stok}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  isInvalid={!!errors.stok}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.stok}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            
            {/* Harga */}
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Harga (Rp) *</Form.Label>
                <Form.Control
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  isInvalid={!!errors.harga}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.harga}
                </Form.Control.Feedback>
                {formData.harga > 0 && (
                  <Form.Text className="text-muted">
                    {formatRupiah(formData.harga)}
                  </Form.Text>
                )}
              </Form.Group>
            </div>
          </div>
          
          {/* Status */}
          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="aktif">Aktif</option>
              <option value="menipis">Menipis</option>
              <option value="nonaktif">Nonaktif</option>
            </Form.Select>
          </Form.Group>
          
          {/* URL Gambar */}
          <Form.Group className="mb-3">
            <Form.Label>URL Gambar</Form.Label>
            <Form.Control
              type="text"
              name="gambar"
              value={formData.gambar}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
            <Form.Text className="text-muted">
              Opsional: URL gambar produk
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Batal
          </Button>
          <Button 
            variant="warning" 
            type="submit"
            style={{ 
              backgroundColor: '#ff6b2c', 
              borderColor: '#ff6b2c',
              color: 'white'
            }}
          >
            {mode === 'add' ? 'Tambah Produk' : 'Simpan Perubahan'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductModal;
