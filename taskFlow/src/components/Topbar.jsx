import React from "react";
import { FaArrowDown } from "react-icons/fa6";
import "./Topbar.css";
import { IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          <h1 className="page-title">Hello, User!</h1>
          <h2 className="page-subtitle">Welcome back to TaskFlow</h2>
        </div>

        <div className="topbar-right">
          {/* Notification */}
          <div className="notification-wrapper">
            <IoIosNotifications className="icon" />

            <div className="notification-popup">
              <p>No new notifications</p>
            </div>
          </div>

          {/* Profile */}
          <div className="profile-section">
            <CgProfile className="icon profile-avatar" />

            <div className="profile-name">
              <span>John Doe</span>
              <span className="profile-role">User</span>
            </div>

            <FaArrowDown className="dropdown-icon" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
