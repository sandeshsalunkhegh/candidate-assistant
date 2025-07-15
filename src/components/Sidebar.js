import React from 'react';
import { MdUploadFile, MdDescription, MdAssessment } from 'react-icons/md';
import './Sidebar.css';

const navLinks = [
  { label: 'Resume Analysis', icon: <MdUploadFile />, href: '#resume-analysis-result' },
  { label: 'JD Analysis', icon: <MdDescription />, href: '#jd-analysis-result' },
  { label: 'JD to Resume Comparison', icon: <MdAssessment />, href: '#comparison' },
];

function Sidebar({ activeSection }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span role="img" aria-label="logo" className="sidebar-logo-icon">🧑‍💼</span>
        <span className="sidebar-logo-text">Resume-JD Analyzer</span>
      </div>
      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`sidebar-link${activeSection === link.href ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            <span className="sidebar-link-text">{link.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar; 