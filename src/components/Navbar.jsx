import React from 'react';
import { Dropdown } from 'react-bootstrap';
import logo from '../assets/logo.svg';
import '../styles/Navbar.css';

/**
 * Component Navbar
 * 
 * Navbar dengan logo dan admin profile dropdown
 * Mirip dengan AppBar di Flutter
 */
const Navbar = () => {
  
  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout clicked');
    // Redirect ke login page
    // window.location.href = '/login';
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
            <span className="admin-icon">👤</span>
            <span className="admin-text">Admin1</span>
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
