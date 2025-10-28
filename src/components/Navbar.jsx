import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import logo from '../assets/logo.svg';
import '../styles/Navbar.css';
import { getCurrentUser, logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

/**
 * Component Navbar
 * 
 * Navbar dengan logo dan admin profile dropdown
 * Mirip dengan AppBar di Flutter
 */
const Navbar = () => {
  const navigate = useNavigate();
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
        // biarkan fallback
      });
    return () => { mounted = false; };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="main-navbar">
      <div className="navbar-content">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="navbar-logo-img" />
        </div>
        
        {/* Admin Profile Dropdown */}
        <Dropdown align="end" className="admin-dropdown">
          <Dropdown.Toggle variant="link" id="admin-dropdown" className="admin-toggle">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span className="admin-icon">👤</span>
            )}
            <span className="admin-text">{displayName}</span>
            <span className="dropdown-arrow">▼</span>
          </Dropdown.Toggle>
          
          <Dropdown.Menu className="admin-menu">
            <Dropdown.Item href="#/profile">
              <span className="menu-icon">👤</span> Profil
            </Dropdown.Item>
            <Dropdown.Item href="#/settings">
              <span className="menu-icon">⚙️</span> Pengaturan
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger">
              <span className="menu-icon">🚪</span> Keluar
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
