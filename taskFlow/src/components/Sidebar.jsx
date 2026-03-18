import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { SlNotebook } from "react-icons/sl";
import { CiSettings } from "react-icons/ci";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>TaskFlow</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" className="nav-link">
              <span className="nav-icon">
                <IoHomeOutline />
              </span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className="nav-link">
              <span className="nav-icon">
                <SlNotebook />
              </span>
              <span>Tasks</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className="nav-link">
              <span className="nav-icon">
                <CiSettings />
              </span>
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
