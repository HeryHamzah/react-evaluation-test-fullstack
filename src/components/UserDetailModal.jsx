import React from 'react';
import { Modal } from 'react-bootstrap';
import { PiCheckCircle, PiPencilSimple, PiXCircleFill } from 'react-icons/pi';
import '../styles/UserDetailModal.css';

/**
 * Component UserDetailModal
 * 
 * Modal untuk menampilkan detail user (read-only)
 */
const UserDetailModal = ({ show, onHide, user, onEdit }) => {
  
  if (!user) return null;

  // Format tanggal
  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    if (status === 'aktif') {
      return (
        <div className="status-badge status-badge-aktif">
          <PiCheckCircle size={16} />
          Active
        </div>
      );
    } else {
      return (
        <div className="status-badge status-badge-nonaktif">
          <PiXCircleFill size={16} />
          Nonaktif
        </div>
      );
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="user-detail-modal"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Detail User</Modal.Title>
          <p className="modal-subtitle">Berikut adalah detail dari user yang dipilih.</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="detail-content">
          {/* Left Column - Avatar */}
          <div className="detail-avatar-section">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.nama}
                className="detail-user-avatar"
              />
            ) : (
              <div className="detail-avatar-placeholder">
                <span>{user.nama.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="detail-info-section">
            {/* Nama & Email */}
            <div className="detail-row-2">
              <div className="detail-field">
                <label>Nama User</label>
                <p className="detail-value">{user.nama}</p>
              </div>
              <div className="detail-field">
                <label>Email</label>
                <p className="detail-value">{user.email}</p>
              </div>
            </div>

            {/* No Telp & Tanggal */}
            <div className="detail-row-2">
              <div className="detail-field">
                <label>No Telepon</label>
                <p className="detail-value">{user.noTelp}</p>
              </div>
              <div className="detail-field">
                <label>Tanggal Dibuat</label>
                <p className="detail-value">{formatTanggal(user.tanggalDibuat)}</p>
              </div>
            </div>

            {/* Status */}
            <div className="detail-field">
              <label>Status User</label>
              {renderStatusBadge(user.status)}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="detail-footer">
        <button className="btn-detail-close" onClick={onHide}>
          Tutup
        </button>
        <button className="btn-detail-edit" onClick={onEdit}>
          <PiPencilSimple size={18} />
          Edit User
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;
