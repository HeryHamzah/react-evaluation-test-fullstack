import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

/**
 * StatusModal
 * Modal sederhana untuk memilih status produk: aktif atau nonaktif.
 * Props:
 * - show: boolean
 * - onHide: function
 * - onSubmit: function(selectedStatus)
 * - currentStatus: 'aktif' | 'nonaktif'
 * - title: string (opsional)
 */
const StatusModal = ({ show, onHide, onSubmit, currentStatus = 'aktif', title = 'Edit Status Produk' }) => {
  const [selected, setSelected] = useState(currentStatus);

  useEffect(() => {
    setSelected(currentStatus);
  }, [currentStatus, show]);

  const handleSave = () => {
    if (!['aktif', 'nonaktif'].includes(selected)) return;
    onSubmit(selected);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-2">
          <label className="d-flex align-items-center gap-2">
            <input
              type="radio"
              name="status"
              value="aktif"
              checked={selected === 'aktif'}
              onChange={(e) => setSelected(e.target.value)}
            />
            <span>Aktif</span>
          </label>
          <label className="d-flex align-items-center gap-2">
            <input
              type="radio"
              name="status"
              value="nonaktif"
              checked={selected === 'nonaktif'}
              onChange={(e) => setSelected(e.target.value)}
            />
            <span>Nonaktif</span>
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-light" onClick={onHide}>Batal</button>
        <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusModal;