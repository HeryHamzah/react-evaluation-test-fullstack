import { Dropdown } from "react-bootstrap";
import { FiEdit2, FiTrash2, FiRefreshCw, FiMoreHorizontal } from "react-icons/fi";

function UserActions({ user, onEdit, onViewDetail, onUpdateStatus, onDelete }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      {/* Tombol Lihat Detail */}
      <button 
        className="btn-detail"
        onClick={() => onViewDetail(user)}
      >
        Lihat Detail
      </button>

      {/* Menu Dropdown */}
      <Dropdown align="end">
        <Dropdown.Toggle
          variant="link"
          bsPrefix="btn" // <- override prefix default biar caret hilang
          className="btn-menu p-0 border-0 text-dark"
          id={`dropdown-${user.id}`}
        >
          <FiMoreHorizontal size={18} />
        </Dropdown.Toggle>

        <Dropdown.Menu className="shadow-sm custom-dropdown-menu">
          <Dropdown.Item onClick={() => onEdit(user)} className="d-flex align-items-center gap-2">
            <FiEdit2 size={16} />
            <span>Edit</span>
          </Dropdown.Item>

          <Dropdown.Item onClick={() => onUpdateStatus(user)} className="d-flex align-items-center gap-2">
            <FiRefreshCw size={16} />
            <span>Ubah Status</span>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => onDelete(user.id)}
            className="d-flex align-items-center gap-2 text-danger"
          >
            <FiTrash2 size={16} />
            <span>Hapus</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default UserActions;
