import React, { useEffect, useMemo, useState } from "react";
import "./Topbar.css";
import { IoIosNotifications } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import { listMyNotifications, signOut } from "../api";
import { useAuth } from "../context/useAuth";
import ProfileMenu from "./profileMenu";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      if (!user?.id) {
        setNotifications([]);
        return;
      }

      setLoadingNotifications(true);

      try {
        const data = await listMyNotifications(user.id);

        if (isMounted) {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error.message);
        if (isMounted) {
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setLoadingNotifications(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  );

  const formatNotificationTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

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
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}

            <div className="notification-popup">
              {loadingNotifications ? (
                <p className="notification-empty">Loading notifications...</p>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div className="notification-item" key={notification.id}>
                    <div className="notification-item-header">
                      <h4 className="notification-title">
                        {notification.title}
                      </h4>
                      <span className="notification-time">
                        {formatNotificationTime(notification.created_At)}
                      </span>
                    </div>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="notification-empty">No new notifications</p>
              )}
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
