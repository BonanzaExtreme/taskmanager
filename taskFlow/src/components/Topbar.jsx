import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Topbar.css";
import { IoIosNotifications } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import {
  getMyProfile,
  listMyNotifications,
  markAllMyNotificationsAsRead,
  signOut,
} from "../api";
import { useAuth } from "../context/useAuth";
import ProfileMenu from "./profileMenu";

const LOCAL_AVATAR_KEY = "taskflow_local_avatar_url";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const notificationRef = useRef(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!user?.id) {
        setProfileAvatarUrl("");
        return;
      }

      const localAvatar = localStorage.getItem(LOCAL_AVATAR_KEY);
      if (localAvatar) {
        if (isMounted) {
          setProfileAvatarUrl(localAvatar);
        }
        return;
      }

      try {
        const profile = await getMyProfile();

        if (isMounted) {
          setProfileAvatarUrl(
            profile?.avatar_url || user?.user_metadata?.avatar_url || "",
          );
        }
      } catch {
        if (isMounted) {
          setProfileAvatarUrl(user?.user_metadata?.avatar_url || "");
        }
      }
    };

    loadProfile();

    const handleProfileChanged = () => {
      loadProfile();
    };

    window.addEventListener("taskflow:profile-changed", handleProfileChanged);

    return () => {
      isMounted = false;
      window.removeEventListener(
        "taskflow:profile-changed",
        handleProfileChanged,
      );
    };
  }, [user?.id, user?.user_metadata?.avatar_url]);

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

    const handleNotificationsChanged = () => {
      loadNotifications();
    };

    window.addEventListener(
      "taskflow:notifications-changed",
      handleNotificationsChanged,
    );

    return () => {
      isMounted = false;
      window.removeEventListener(
        "taskflow:notifications-changed",
        handleNotificationsChanged,
      );
    };
  }, [user?.id]);

  useEffect(() => {
    if (!isNotificationOpen) return;

    const handleDocumentClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isNotificationOpen]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  );

  const formatNotificationTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    const minuteMs = 60 * 1000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;

    if (diffMs < minuteMs) return "Just now";
    if (diffMs < hourMs) return `${Math.floor(diffMs / minuteMs)}m ago`;
    if (diffMs < dayMs) return `${Math.floor(diffMs / hourMs)}h ago`;
    if (diffMs < 7 * dayMs) return `${Math.floor(diffMs / dayMs)}d ago`;

    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatNotificationTimestamp = (value) => {
    if (!value) return "No timestamp";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No timestamp";

    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const handleToggleNotifications = async () => {
    const willOpen = !isNotificationOpen;
    setIsNotificationOpen(willOpen);

    if (!willOpen || !user?.id || unreadCount === 0) {
      return;
    }

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        is_read: true,
      })),
    );

    try {
      await markAllMyNotificationsAsRead(user.id);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error.message);
      const freshNotifications = await listMyNotifications(user.id);
      setNotifications(freshNotifications);
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
          <div
            className={`notification-wrapper ${
              isNotificationOpen ? "open" : ""
            }`}
            ref={notificationRef}
          >
            <button
              type="button"
              className="notification-trigger"
              onClick={handleToggleNotifications}
              aria-label="Toggle notifications"
              aria-expanded={isNotificationOpen}
              aria-haspopup="dialog"
            >
              <IoIosNotifications className="icon" />
            </button>
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
                        {formatNotificationTime(notification.created_at)}
                      </span>
                    </div>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <p className="notification-timestamp">
                      {formatNotificationTimestamp(notification.created_at)}
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
            avatarUrl={profileAvatarUrl}
            onSignOut={handleSignOut}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
