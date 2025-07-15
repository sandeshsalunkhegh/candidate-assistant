import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <span>&copy; {new Date().getFullYear()} Resume-JD Analyzer. All rights reserved.</span>
        {/* Future: Add Privacy Policy, Contact, or social links here */}
      </div>
    </footer>
  );
}

export default Footer; 