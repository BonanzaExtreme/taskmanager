import React from "react";
import "./Topbar.css";
import { IoIosNotifications } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import { signOut } from "../api";
import { useAuth } from "../context/useAuth";
import ProfileMenu from "./profileMenu";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayName = user?.user_metadata?.name || "User";
  const displayRole = user?.email || "Signed in";

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Sign out failed:", error.message);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          <h1 className="page-title">Hello, {displayName}!</h1>
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
          <ProfileMenu
            name={displayName}
            role={displayRole}
            onSignOut={handleSignOut}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
