import React from "react";
import { FaArrowDown } from "react-icons/fa6";
import "./Topbar.css";

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          <h1 className="page-title">Hello, User!</h1>
          <h2 className="page-subtitle">Welcome back to TaskFlow</h2>
        </div>
        <div className="topbar-right">
          <div className="profile-section">
            <div className="profile-avatar">
              <span>👤</span>
            </div>
          </div>
          <div className="profile-name">
            <span>John Doe</span>
            <span className="profile-role">User</span>
          </div>
          <div className="dropdown-menu">
            <span>
              <FaArrowDown />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
