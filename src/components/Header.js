import React from 'react';
import logo from '../logo.svg';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <img src={logo} alt="App Logo" className="app-logo" />
        <span className="app-title">Resume-JD Analyzer</span>
        {/* Future nav or user menu can go here */}
      </div>
    </header>
  );
}

export default Header; 