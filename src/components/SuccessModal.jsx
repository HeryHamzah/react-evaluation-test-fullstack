import React from 'react';
import { Modal } from 'react-bootstrap';
import { PiCheckCircle } from 'react-icons/pi';
import '../styles/SuccessModal.css';

/**
 * Component SuccessModal
 * 
 * Modal untuk menampilkan pesan sukses setelah operasi berhasil
 * 
 * Props:
 * - show: boolean untuk menampilkan/menyembunyikan modal
 * - onHide: function untuk menutup modal
 * - title: judul modal (default: "Berhasil Ditambah!")
 * - message: pesan modal (default: "Produk baru berhasil disimpan...")
 */
const SuccessModal = ({ 
  show, 
  onHide, 
  title = "Berhasil Ditambah!",
  message = "Produk baru berhasil disimpan dan sekarang muncul di daftar produk."
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="success-modal"
      backdrop="static"
    >
      <Modal.Body className="success-modal-body">
        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <div className="success-icon-bg">
            <div className="success-icon-circle">
              <PiCheckCircle size={48} className="success-icon" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="success-title">{title}</h3>

        {/* Message */}
        <p className="success-message">{message}</p>

        {/* Close Button */}
        <button 
          className="success-close-button"
          onClick={onHide}
        >
          Tutup
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
