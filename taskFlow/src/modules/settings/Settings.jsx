import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./settings.css";
import { ThemeContext } from "../../context/ThemeContextCreate";
import { FaBell, FaLock, FaSave, FaTrash, FaUpload } from "react-icons/fa";
import { getMyProfile, updateMyProfile } from "../../api";
import { useAuth } from "../../context/useAuth";

const AVATAR_PLACEHOLDER = "https://via.placeholder.com/140";
const LOCAL_AVATAR_KEY = "taskflow_local_avatar_url";

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PLACEHOLDER);
  const [message, setMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const fileInputRef = useRef(null);
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    const storedPrefs = localStorage.getItem("taskflow-notification-prefs");
    return storedPrefs
      ? JSON.parse(storedPrefs)
      : {
          taskReminders: true,
          emailNotifications: false,
          weeklyDigest: true,
        };
  });

  useEffect(() => {
    const loadProfile = async () => {
      setProfileError("");

      try {
        const profile = await getMyProfile();
        const localAvatar = localStorage.getItem(LOCAL_AVATAR_KEY);
        setName(profile?.name || user?.user_metadata?.name || "");
        setEmail(profile?.email || user?.email || "");
        setAvatarUrl(
          localAvatar ||
            profile?.avatar_url ||
            user?.user_metadata?.avatar_url ||
            AVATAR_PLACEHOLDER,
        );
      } catch (error) {
        setProfileError(error.message);
        const localAvatar = localStorage.getItem(LOCAL_AVATAR_KEY);
        setName(user?.user_metadata?.name || "");
        setEmail(user?.email || "");
        setAvatarUrl(
          localAvatar || user?.user_metadata?.avatar_url || AVATAR_PLACEHOLDER,
        );
      }
    };

    loadProfile();
  }, [user?.email, user?.user_metadata?.name, user?.user_metadata?.avatar_url]);

  useEffect(() => {
    localStorage.setItem(
      "taskflow-notification-prefs",
      JSON.stringify(notificationPrefs),
    );
  }, [notificationPrefs]);

  const sections = useMemo(
    () => [
      { id: "general", label: "General" },
      { id: "notifications", label: "Notifications" },
      { id: "security", label: "Login & Security" },
    ],
    [],
  );

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage("");
    setProfileError("");

    try {
      await updateMyProfile({ name });
      setMessage("Profile updated successfully.");
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Please upload an image file.");
      event.target.value = "";
      return;
    }

    setIsUploadingAvatar(true);
    setProfileError("");
    setMessage("");

    try {
      const uploadedAvatarUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read image file."));
        reader.readAsDataURL(file);
      });

      localStorage.setItem(LOCAL_AVATAR_KEY, uploadedAvatarUrl);
      window.dispatchEvent(new CustomEvent("taskflow:profile-changed"));
      setAvatarUrl(uploadedAvatarUrl || AVATAR_PLACEHOLDER);
      setMessage("Profile image uploaded successfully.");
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setIsRemovingAvatar(true);
    setProfileError("");
    setMessage("");

    try {
      localStorage.removeItem(LOCAL_AVATAR_KEY);
      window.dispatchEvent(new CustomEvent("taskflow:profile-changed"));
      setAvatarUrl(AVATAR_PLACEHOLDER);
      setMessage("Profile image removed.");
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  return (
    <section className="settings-page">
      <div className="settings-container">
        {/* LEFT PANEL */}
        <div className="settings-left">
          <ul>
            {sections.map((section) => (
              <li
                key={section.id}
                className={`settings-item ${activeSection === section.id ? "active" : ""}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="settings-right">
          <div className="settings-content">
            {activeSection === "general" && (
              <>
                <div className="section-header">
                  <h2>General Settings</h2>
                  <p>Update your profile details and appearance.</p>
                </div>

                <div className="profile-row">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="avatar-file-input"
                    onChange={handleAvatarFileChange}
                  />
                  <img src={avatarUrl} alt="profile" className="profile-img" />
                  <div className="profile-actions">
                    <button
                      className="btn delete"
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isRemovingAvatar || isUploadingAvatar}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="upload"
                      type="button"
                      onClick={handleUploadClick}
                      disabled={isRemovingAvatar || isUploadingAvatar}
                    >
                      <FaUpload />{" "}
                      {isUploadingAvatar ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="setting-left">
                    <label htmlFor="settings-name">Name</label>
                    <input
                      id="settings-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="setting-right">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      <FaSave /> {isSaving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="setting-left">
                    <label htmlFor="settings-email">Email</label>
                    <input
                      id="settings-email"
                      type="email"
                      value={email}
                      readOnly
                      placeholder="Email is managed by your account"
                    />
                  </div>
                  <div className="setting-right">
                    <span className="settings-note">Managed by auth</span>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="setting-left">
                    <label>Theme</label>
                    <h3>Appearance</h3>
                  </div>
                  <div className="setting-right">
                    <button type="button" onClick={toggleTheme}>
                      {theme === "light" ? "Light" : "Dark"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeSection === "notifications" && (
              <>
                <div className="section-header">
                  <h2>Notifications</h2>
                  <p>Choose which updates you want to receive.</p>
                </div>

                <div className="settings-row">
                  <div className="setting-left">
                    <label>Task Reminders</label>
                    <h3>Get notified before tasks are due</h3>
                  </div>
                  <div className="setting-right">
                    <button
                      type="button"
                      onClick={() => handleNotificationToggle("taskReminders")}
                    >
                      <FaBell />{" "}
                      {notificationPrefs.taskReminders ? "On" : "Off"}
                    </button>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="setting-left">
                    <label>Email Notifications</label>
                    <h3>Receive notification emails</h3>
                  </div>
                  <div className="setting-right">
                    <button
                      type="button"
                      onClick={() =>
                        handleNotificationToggle("emailNotifications")
                      }
                    >
                      <FaBell />{" "}
                      {notificationPrefs.emailNotifications ? "On" : "Off"}
                    </button>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="setting-left">
                    <label>Weekly Digest</label>
                    <h3>Summary of important activity</h3>
                  </div>
                  <div className="setting-right">
                    <button
                      type="button"
                      onClick={() => handleNotificationToggle("weeklyDigest")}
                    >
                      <FaBell /> {notificationPrefs.weeklyDigest ? "On" : "Off"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeSection === "security" && (
              <>
                <div className="section-header">
                  <h2>Login & Security</h2>
                  <p>Keep your account secure.</p>
                </div>

                <div className="settings-row">
                  <div className="setting-left">
                    <label>Password</label>
                    <h3>Coming Soon</h3>
                  </div>
                  <div className="setting-right">
                    <button type="button" disabled>
                      <FaLock /> Coming soon
                    </button>
                  </div>
                </div>
              </>
            )}

            {profileError && (
              <p className="settings-feedback error">{profileError}</p>
            )}
            {message && <p className="settings-feedback success">{message}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
