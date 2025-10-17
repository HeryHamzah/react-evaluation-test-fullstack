import React, { useState, useEffect } from 'react';
import { PiMagnifyingGlass, PiXCircleFill } from 'react-icons/pi';
import Navbar from '../components/Navbar';
import UserDetailModal from '../components/UserDetailModal';
import UserModal from '../components/UserModal';
import SuccessModal from '../components/SuccessModal';
import SelectWithIcon from '../components/SelectWithIcon';
import userService from '../services/userService';
import { userStatuses } from '../data/mockUsers';
import '../styles/UserList.css';
import UserActions from '../components/UserActions';
import SortOrderButton from '../components/SortOrder';

/**
 * Component UserList - Halaman Management User
 */
const UserList = () => {
  
  // STATE MANAGEMENT
  const [users, setUsers] = useState([]); // List user
  const [loading, setLoading] = useState(false); // Loading indicator
  const [error, setError] = useState(null); // Error state
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  
  // State untuk filter dan search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  
  // State untuk sorting
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' atau 'desc'
  
  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' atau 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State untuk detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // State untuk success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('');
  
  /**
   * useEffect untuk fetch data ketika filter/sort/page berubah
   */
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, selectedStatus, sortOrder]);
  
  /**
   * Function untuk fetch users dari service
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.getUsers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        status: selectedStatus,
        sortOrder: sortOrder
      });
      
      if (result.success) {
        setUsers(result.data);
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
   * Handler untuk buka modal tambah user
   */
  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
    setShowModal(true);
  };
  
  /**
   * Handler untuk buka modal detail user
   */
  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  /**
   * Handler untuk buka modal edit user dari detail
   */
  const handleEditFromDetail = () => {
    setShowDetailModal(false);
    setModalMode('edit');
    setShowModal(true);
  };

  /**
   * Handler untuk buka modal edit user langsung
   */
  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };
  
  /**
   * Handler untuk save user (add/edit)
   */
  const handleSaveUser = async (userData) => {
    try {
      setLoading(true);
      
      let result;
      if (modalMode === 'add') {
        result = await userService.createUser(userData);
      } else {
        result = await userService.updateUser(selectedUser.id, userData);
      }
      
      if (result.success) {
        setShowModal(false);
        fetchUsers(); // Refresh data
        
        // Tampilkan success modal
        if (modalMode === 'add') {
          setSuccessTitle('Berhasil Ditambah!');
          setSuccessMessage('User baru berhasil disimpan dan sekarang muncul di daftar user.');
        } else {
          setSuccessTitle('Berhasil Diperbarui!');
          setSuccessMessage('Perubahan user berhasil disimpan dan telah diperbarui di daftar user.');
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
   * Handler untuk ubah status user
   */
  const handleUpdateStatus = (user) => {
    // Toggle status: aktif <-> nonaktif
    const newStatus = user.status === 'aktif' ? 'nonaktif' : 'aktif';
    
    const updatedUser = {
      ...user,
      status: newStatus
    };
    
    // Update menggunakan modal (atau bisa langsung update)
    setSelectedUser(updatedUser);
    setModalMode('edit');
    setShowModal(true);
  };

  /**
   * Handler untuk hapus user
   */
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      return;
    }
    
    try {
      setLoading(true);
      const result = await userService.deleteUser(userId);
      
      if (result.success) {
        fetchUsers();
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
   * Format tanggal
   */
  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  /**
   * Render status badge dengan icon berbeda untuk nonaktif
   */
  const renderStatusBadge = (status) => {
    if (status === 'aktif') {
      return (
        <span className="status-badge status-aktif">
          <span className="status-icon">✓</span>
          Active
        </span>
      );
    } else {
      return (
        <span className="status-badge status-nonaktif">
          <PiXCircleFill size={16} className="status-icon-x" />
          Nonaktif
        </span>
      );
    }
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
    e.target.src = 'https://ui-avatars.com/api/?name=User&background=e5e7eb&color=9ca3af';
  };
  
  /**
   * RENDER / BUILD UI
   */
  return (
    <>
      {/* Navbar */}
      <Navbar />
      
      <div className="user-list-container">
        {/* Header Section */}
        <div className="user-header d-flex justify-content-between align-items-start flex-wrap">
          <div>
            <h1 className="user-title">Management User</h1>
            <p className="user-subtitle">Lihat semua produk yang tersedia di inventaris.</p>
          </div>
          <div className="header-actions">
            <button className="btn-add-user" onClick={handleAddUser}>
              <span>+</span>
              Tambah User
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
                placeholder="Cari user"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            {/* Filter Status */}
            <SelectWithIcon
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              {userStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </SelectWithIcon>
            
            {/* Sort Section */}
            <div className="sort-section">
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
              <table className="user-table table">
                <thead>
                  <tr>
                    <th>Nama User</th>
                    <th>No Telp</th>
                    <th>Tanggal Dibuat</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        Tidak ada data user
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        {/* Nama User dengan Avatar */}
                        <td>
                          <div className="user-name-cell">
                            <img
                              src={user.avatar}
                              alt={user.nama}
                              className="user-avatar"
                              onError={handleImageError}
                            />
                            <div className="user-info">
                              <span className="user-name">{user.nama}</span>
                              <span className="user-email">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        
                        {/* No Telp */}
                        <td>{user.noTelp}</td>
                        
                        {/* Tanggal Dibuat */}
                        <td>{formatTanggal(user.tanggalDibuat)}</td>
                        
                        {/* Status */}
                        <td>{renderStatusBadge(user.status)}</td>
                        
                        {/* Actions */}
                        <td>
                          <div className="action-cell">
                            <UserActions
                              user={user}
                              onViewDetail={handleViewDetail}
                              onEdit={handleEditUser}
                              onUpdateStatus={handleUpdateStatus}
                              onDelete={handleDeleteUser}
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
      
      {/* Modal untuk View Detail User */}
      <UserDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        user={selectedUser}
        onEdit={handleEditFromDetail}
      />

      {/* Modal untuk Add/Edit User */}
      <UserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title={successTitle}
        message={successMessage}
      />
    </>
  );
};

export default UserList;
