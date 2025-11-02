import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCaretDown } from 'react-icons/io5';
import ProductGrid from '../components/catalog/ProductGrid';
import furnitureService from '../services/furnitureService';
import logo from '../assets/logo.svg';
import { getCurrentUser, logout } from '../services/authService';

const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  // Current user state for AppBar
  const [displayName, setDisplayName] = useState('Pengguna');
  const [avatarUrl, setAvatarUrl] = useState(null);

  const defaultAvatar = React.useMemo(() => {
    const name = displayName || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e5e7eb&color=9ca3af`;
  }, [displayName]);

  const normalizeAvatarUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('/uploads')) return trimmed;
    if (trimmed.startsWith('uploads/')) return '/' + trimmed;
    return trimmed; // absolute URL
  };

  // Load semua produk saat component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Scroll listener untuk sticky header (sliver effect)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsHeaderSticky(true);
      } else {
        setIsHeaderSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ambil profil pengguna saat mount untuk AppBar
  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then(user => {
        if (mounted) {
          if (user?.name) setDisplayName(user.name);
          const normalized = normalizeAvatarUrl(user?.avatar);
          if (normalized) setAvatarUrl(normalized);
        }
      })
      .catch(() => {
        // biarkan fallback ke default avatar
      });
    return () => { mounted = false; };
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await furnitureService.getAllProducts();
      setProducts(data);
      setDisplayedProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setDisplayedProducts(products);
      return;
    }

    try {
      setLoading(true);
      const results = await furnitureService.searchProducts(searchQuery);
      setDisplayedProducts(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/catalog');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Sticky Header - Sliver Effect */}
      <div 
        className={`position-sticky top-0 bg-white shadow-sm transition-all ${isHeaderSticky ? 'py-2' : 'py-3'}`}
        style={{ 
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            {/* Back Button & Logo */}
            <div className="d-flex align-items-center gap-3">
              <button 
                onClick={handleBack}
                className="btn btn-link text-dark p-0"
                style={{ fontSize: '1.5rem' }}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <img 
                src={logo} 
                alt="Logo" 
                style={{ 
                  height: isHeaderSticky ? '30px' : '40px',
                  transition: 'height 0.3s ease'
                }} 
              />
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-grow-1 mx-4">
              <div className="position-relative d-flex align-items-center gap-2">
                <input
                  type="text"
                  className="form-control border py-2 px-4"
                  placeholder="Cari produk"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    borderRadius: '50px',
                    borderColor: '#E7EAF0'
                  }}
                />
                <button 
                  className="btn shadow-sm" 
                  type="submit"
                  style={{ 
                    backgroundColor: '#ff8c00',
                    borderColor: '#ff8c00',
                    color: 'white',
                    width: '45px',
                    height: '45px',
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

            {/* User Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ border: 'none', padding: 0 }}
              >
                <IoCaretDown size={16} />
                <span>{displayName}</span>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                    className="rounded-circle"
                    style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                    style={{ width: '35px', height: '35px' }}
                  >
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                )}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="#/profile">Profile</a></li>
                <li><a className="dropdown-item" href="#/settings">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Page Title */}
        <div className="mb-4">
          <h3 className="fw-bold mb-1">Semua Produk</h3>
          <p className="text-muted mb-0">
            Menampilkan {displayedProducts.length} dari {products.length} produk
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={displayedProducts} loading={loading} />
      </div>
    </div>
  );
};

export default AllProducts;
