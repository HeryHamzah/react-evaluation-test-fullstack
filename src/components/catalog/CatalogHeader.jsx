import React from 'react';
import { IoCaretDown } from 'react-icons/io5';
import furnitureImage from '../../assets/furniture.jpg';
import logo from '../../assets/logo.svg';

const CatalogHeader = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div 
      className="position-relative text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${furnitureImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '400px'
      }}
    >
      {/* Logo - Top Left */}
      <div className="position-absolute top-0 start-0 p-4">
        <img src={logo} alt="Logo" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
      </div>
      
      <div className="container py-5">
        <div className="row justify-content-center align-items-center" style={{ minHeight: '350px' }}>
          <div className="col-lg-8 text-center">
            {/* Title */}
            <h2 className="display-5 fw-bold mb-3">Cari Funitur Impian</h2>
            <p className="lead mb-4">Cari funitur mulai dari meja, lemari, hingga rak disini</p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch}>
              <div className="position-relative d-flex align-items-center justify-content-center gap-3">
                <input
                  type="text"
                  className="form-control border-0 py-3 px-4 shadow-lg"
                  placeholder="Cari produk"
                  value={searchQuery}
                  onChange={handleInputChange}
                  style={{ 
                    fontSize: '1rem',
                    borderRadius: '50px',
                    maxWidth: '600px'
                  }}
                />
                <button 
                  className="btn shadow-lg" 
                  type="submit"
                  style={{ 
                    backgroundColor: '#ff8c00',
                    borderColor: '#ff8c00',
                    color: 'white',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* User Dropdown - Top Right */}
      <div className="position-absolute top-0 end-0 p-4">
        <div className="dropdown">
          <button
            className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ border: 'none', padding: 0 }}
          >
            <IoCaretDown size={16} />
            <span>user 01</span>
            <div 
              className="rounded-circle bg-white d-flex align-items-center justify-content-center"
              style={{ width: '35px', height: '35px' }}
            >
              <i className="bi bi-person-fill text-dark"></i>
            </div>
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CatalogHeader;
